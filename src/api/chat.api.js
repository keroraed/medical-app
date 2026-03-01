import api from "./axios";

export const chatApi = {
  /**
   * Start or retrieve a conversation with a target profile.
   * @param {string} targetProfileId - DoctorProfile _id (for patient) or Patient _id (for doctor)
   */
  startConversation: (targetProfileId) =>
    api.post("/chat/conversations", { targetProfileId }),

  /**
   * List all conversations for the authenticated user.
   * @param {{ page?: number, limit?: number }} params
   */
  getConversations: (params = {}) =>
    api.get("/chat/conversations", { params }),

  /**
   * Get paginated messages for a conversation.
   * @param {string} conversationId
   * @param {{ page?: number, limit?: number }} params
   */
  getMessages: (conversationId, params = {}) =>
    api.get(`/chat/conversations/${conversationId}/messages`, { params }),

  /**
   * Send a message via REST (fallback when socket is unavailable).
   * @param {string} conversationId
   * @param {string} content
   */
  sendMessage: (conversationId, content) =>
    api.post(`/chat/conversations/${conversationId}/messages`, { content }),

  /**
   * Mark all messages in a conversation as read.
   * @param {string} conversationId
   */
  markAsRead: (conversationId) =>
    api.patch(`/chat/conversations/${conversationId}/read`),

  /**
   * Get total unread message count across all conversations.
   */
  getUnreadCount: () => api.get("/chat/unread-count"),

  /**
   * Soft-delete a conversation (hides it from your list only).
   * @param {string} conversationId
   */
  deleteConversation: (conversationId) =>
    api.delete(`/chat/conversations/${conversationId}`),
};
