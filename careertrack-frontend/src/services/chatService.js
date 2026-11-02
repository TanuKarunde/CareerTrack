
import { apiRequest } from "./api";

export const getChatStudents = () =>
  apiRequest("/chat/students");

export const getChatConversations = () =>
  apiRequest("/chat/conversations");

export const getChatMessages = (conversationId) =>
  apiRequest(`/chat/conversations/${conversationId}/messages`);

export const getOrCreateChatConversation = (studentId) =>
  apiRequest(`/chat/conversations/${studentId}`, {
    method: "POST",
  });

export const sendChatMessage = (conversationId, content) =>
  apiRequest(`/chat/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });

  export const markChatMessagesAsRead = (conversationId) =>
  apiRequest(`/chat/conversations/${conversationId}/read`, {
    method: "PATCH",
  });
