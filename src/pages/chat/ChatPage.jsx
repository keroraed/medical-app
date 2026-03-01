import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import PageTitle from "@/components/shared/PageTitle";
import ConversationList from "@/components/chat/ConversationList";
import ChatWindow from "@/components/chat/ChatWindow";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/hooks/useAuth";
import { useConversations } from "@/hooks/queries/useChat";
import { useQueryClient } from "@tanstack/react-query";
import { chatKeys } from "@/hooks/queries/useChat";
import { extractId } from "@/lib/utils";
import { ROLES } from "@/lib/constants";

/**
 * Given a conversation { doctor: { user: { name } }, patient: { user: { name } } }
 * and the current user's role, return info about the OTHER party.
 */
function getOtherParty(conversation, role) {
  if (!conversation) return { name: "Unknown", userId: null };

  const isPatient = role === ROLES.PATIENT;
  const other = isPatient ? conversation.doctor : conversation.patient;

  // Name: other.user.name (populated) or fallback
  const name = other?.user?.name ?? "Unknown";

  // userId: the User _id of the other party
  const userId = extractId(other?.user) ?? extractId(other?.user?._id);

  return { name, userId, profile: other };
}

export default function ChatPage() {
  const { user, role } = useAuth();
  const currentUserId = extractId(user);
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedConversationId, setSelectedConversationId] = useState(
    () => searchParams.get("conversation") ?? null,
  );
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());

  const { data: conversationsData } = useConversations({ page: 1, limit: 50 });
  const conversations = conversationsData?.data ?? [];
  const selectedConversation = conversations.find(
    (c) => c._id === selectedConversationId,
  );

  const { name: otherName, userId: otherId } = getOtherParty(
    selectedConversation,
    role,
  );

  // ----- Online presence tracking -----
  const handleUserOnline = useCallback(({ userId }) => {
    setOnlineUserIds((prev) => new Set([...prev, userId]));
  }, []);

  const handleUserOffline = useCallback(({ userId }) => {
    setOnlineUserIds((prev) => {
      const next = new Set(prev);
      next.delete(userId);
      return next;
    });
  }, []);

  // Global socket listeners (presence + notification badge)
  useEffect(() => {
    if (!socket) return;

    socket.on("user:online", handleUserOnline);
    socket.on("user:offline", handleUserOffline);

    // message:new → bump unread count badge
    const handleMessageNew = ({ conversationId }) => {
      if (conversationId !== selectedConversationId) {
        queryClient.invalidateQueries({ queryKey: chatKeys.unreadCount() });
        queryClient.invalidateQueries({ queryKey: chatKeys.conversations({}) });
      }
    };
    socket.on("message:new", handleMessageNew);

    return () => {
      socket.off("user:online", handleUserOnline);
      socket.off("user:offline", handleUserOffline);
      socket.off("message:new", handleMessageNew);
    };
  }, [
    socket,
    handleUserOnline,
    handleUserOffline,
    selectedConversationId,
    queryClient,
  ]);

  // Check online status of the other participant when conversation changes
  useEffect(() => {
    if (!socket || !otherId) return;
    socket.emit("user:checkOnline", otherId, ({ online }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        online ? next.add(otherId) : next.delete(otherId);
        return next;
      });
    });
  }, [socket, otherId]);

  const handleSelectConversation = (id) => {
    setSelectedConversationId(id);
    // Keep the URL in sync so the selection survives a page refresh
    setSearchParams(id ? { conversation: id } : {}, { replace: true });
  };

  return (
    <div className="flex flex-col h-full">
      <PageTitle title="Messages" />

      <div className="flex flex-1 min-h-0 border rounded-xl overflow-hidden bg-background shadow-sm">
        {/* Left pane — conversation list */}
        <div className="w-72 shrink-0 border-r flex flex-col">
          <div className="px-4 py-3 border-b">
            <h2 className="font-semibold text-sm text-foreground">
              Conversations
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ConversationList
              currentUserId={currentUserId}
              currentUserRole={role}
              selectedId={selectedConversationId}
              onSelect={handleSelectConversation}
              onSelectAfterDelete={() => handleSelectConversation(null)}
              onlineUserIds={onlineUserIds}
            />
          </div>
        </div>

        {/* Right pane — chat window or empty state */}
        {selectedConversationId ? (
          <div className="flex flex-col flex-1 min-w-0">
            <ChatWindow
              conversationId={selectedConversationId}
              currentUserId={currentUserId}
              otherParticipantName={otherName}
              isOtherOnline={onlineUserIds.has(otherId)}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
            <MessageSquare className="h-12 w-12 opacity-30" />
            <p className="text-sm">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
