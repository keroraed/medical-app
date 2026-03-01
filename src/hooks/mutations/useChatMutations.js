import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/api/chat.api";
import { chatKeys } from "@/hooks/queries/useChat";
import { toast } from "sonner";

export function useStartConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (targetProfileId) => chatApi.startConversation(targetProfileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations({}) });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ?? "Could not start conversation",
      );
    },
  });
}

export function useSendMessageRest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, content }) =>
      chatApi.sendMessage(conversationId, content),
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(conversationId, {}),
      });
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations({}) });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to send message",
      );
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId) => chatApi.markAsRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.unreadCount() });
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations({}) });
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId) => chatApi.deleteConversation(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations({}) });
      queryClient.invalidateQueries({ queryKey: chatKeys.unreadCount() });
      toast.success("Conversation deleted");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to delete conversation",
      );
    },
  });
}
