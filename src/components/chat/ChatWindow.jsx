import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import MessageBubble from "@/components/chat/MessageBubble";
import TypingIndicator from "@/components/chat/TypingIndicator";
import ChatInput from "@/components/chat/ChatInput";
import { useSocket } from "@/context/SocketContext";
import { useMessages } from "@/hooks/queries/useChat";
import { chatKeys } from "@/hooks/queries/useChat";
import { useMarkAsRead } from "@/hooks/mutations/useChatMutations";
import { extractId } from "@/lib/utils";

/**
 * @param {{
 *   conversationId: string,
 *   currentUserId: string,
 *   otherParticipantName: string,
 *   isOtherOnline?: boolean,
 * }} props
 */
export default function ChatWindow({
  conversationId,
  currentUserId,
  otherParticipantName,
  isOtherOnline = false,
}) {
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const { mutate: markAsRead } = useMarkAsRead();

  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const bottomRef = useRef(null);
  const isFirstLoad = useRef(true);

  const { data, isLoading, isError } = useMessages(conversationId, {
    page: 1,
    limit: 50,
  });

  // Seed local messages from REST response
  useEffect(() => {
    if (data?.data) {
      // Sort messages chronologically (oldest first) regardless of API order
      const sorted = [...data.data].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
      setMessages(sorted);
      isFirstLoad.current = true;
    }
  }, [data]);

  // Auto-scroll to bottom on new messages
  useLayoutEffect(() => {
    if (isFirstLoad.current || messages.length) {
      bottomRef.current?.scrollIntoView({ behavior: isFirstLoad.current ? "auto" : "smooth" });
      isFirstLoad.current = false;
    }
  }, [messages]);

  // ----- Socket.IO room management & event listeners -----
  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("conversation:join", conversationId);

    const handleNewMessage = ({ message }) => {
      setMessages((prev) => {
        // Avoid duplicates
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    };

    const handleTypingStart = () => {
      setIsTyping(true);
      clearTimeout(typingTimeoutRef.current);
      // Auto-clear after 5 s as safety net
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 5000);
    };

    const handleTypingStop = () => {
      setIsTyping(false);
      clearTimeout(typingTimeoutRef.current);
    };

    const handleMessagesRead = ({ readBy }) => {
      if (readBy !== currentUserId) {
        // Other party read our messages — mark all as read locally
        setMessages((prev) =>
          prev.map((m) => {
            const sid = extractId(m.sender);
            return sid === currentUserId ? { ...m, isRead: true } : m;
          }),
        );
      }
    };

    socket.on("message:received", handleNewMessage);
    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);
    socket.on("messages:read", handleMessagesRead);

    // Mark conversation as read when window opens
    markAsRead(conversationId);
    queryClient.invalidateQueries({ queryKey: chatKeys.unreadCount() });

    return () => {
      socket.emit("conversation:leave", conversationId);
      socket.emit("messages:read", { conversationId });
      socket.off("message:received", handleNewMessage);
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
      socket.off("messages:read", handleMessagesRead);
      clearTimeout(typingTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, conversationId]);

  // Handle re-join after socket reconnect
  useEffect(() => {
    if (!socket) return;
    const handleReconnect = () => {
      socket.emit("conversation:join", conversationId);
    };
    socket.on("connect", handleReconnect);
    return () => socket.off("connect", handleReconnect);
  }, [socket, conversationId]);

  // ----- Send message via Socket.IO with optimistic UI -----
  const handleSend = useCallback(
    (content) => {
      if (!socket) {
        toast.error("Not connected. Please wait…");
        return;
      }

      const tempId = `temp-${Date.now()}`;
      const optimistic = {
        _id: tempId,
        content,
        sender: currentUserId,
        createdAt: new Date().toISOString(),
        isRead: false,
        pending: true,
      };

      setMessages((prev) => [...prev, optimistic]);

      socket.emit(
        "message:send",
        { conversationId, content },
        ({ error, message }) => {
          if (error) {
            setMessages((prev) => prev.filter((m) => m._id !== tempId));
            toast.error(error ?? "Failed to send message");
          } else {
            setMessages((prev) =>
              prev.map((m) => (m._id === tempId ? message : m)),
            );
            // Refresh conversation list (last message preview)
            queryClient.invalidateQueries({
              queryKey: chatKeys.conversations({}),
            });
          }
        },
      );
    },
    [socket, conversationId, currentUserId, queryClient],
  );

  // ----- Typing events -----
  const handleTypingStart = useCallback(() => {
    socket?.emit("typing:start", { conversationId });
  }, [socket, conversationId]);

  const handleTypingStop = useCallback(() => {
    socket?.emit("typing:stop", { conversationId });
  }, [socket, conversationId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center flex-1 text-destructive text-sm">
        Failed to load messages.
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-background">
        <div className="relative">
          <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold uppercase text-sm">
            {otherParticipantName?.charAt(0) ?? "?"}
          </div>
          {isOtherOnline && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
          )}
        </div>
        <div>
          <p className="font-medium text-sm leading-none">{otherParticipantName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isOtherOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
        {messages.map((msg) => {
          const senderId = extractId(msg.sender);
          return (
            <MessageBubble
              key={msg._id}
              message={msg}
              isMine={senderId === currentUserId}
            />
          );
        })}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Typing indicator + input */}
      <ChatInput
        onSend={handleSend}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
        disabled={!socket}
      />
    </div>
  );
}
