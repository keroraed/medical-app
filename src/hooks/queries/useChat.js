import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/api/chat.api";

export const chatKeys = {
  all: ["chat"],
  conversations: (params) => ["chat", "conversations", params],
  messages: (conversationId, params) => [
    "chat",
    "messages",
    conversationId,
    params,
  ],
  unreadCount: () => ["chat", "unread-count"],
};

export function useConversations(params = {}) {
  return useQuery({
    queryKey: chatKeys.conversations(params),
    queryFn: async () => {
      const { data } = await chatApi.getConversations(params);
      return data;
    },
  });
}

export function useMessages(conversationId, params = {}) {
  return useQuery({
    queryKey: chatKeys.messages(conversationId, params),
    queryFn: async () => {
      const { data } = await chatApi.getMessages(conversationId, params);
      return data;
    },
    enabled: !!conversationId,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: chatKeys.unreadCount(),
    queryFn: async () => {
      const { data } = await chatApi.getUnreadCount();
      return data;
    },
    refetchInterval: 30_000, // re-poll every 30 s as safety net
  });
}
