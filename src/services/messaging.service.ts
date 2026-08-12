import axiosInstance from '../lib/axiosInstance';

interface ApiEnvelope<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string | null;
  image: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  customerId: string;
  professionalId: string;
  bookingId: string | null;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  professional?: {
    id: string;
    name: string;
    companyName: string;
    trade: string;
    avatar: string | null;
    rating: number;
  };
  customer?: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  messages?: Message[];
}

export interface SendMessageInput {
  body?: string;
  image?: string;
}

export const getOrCreateConversation = async (
  professionalId: string,
  bookingId?: string
): Promise<Conversation> => {
  const { data } = await axiosInstance.post<ApiEnvelope<Conversation>>('/conversations', {
    professionalId,
    bookingId,
  });
  return data.data;
};

export const getMyConversations = async (): Promise<Conversation[]> => {
  const { data } = await axiosInstance.get<ApiEnvelope<Conversation[]>>('/conversations/me');
  return data.data ?? [];
};

export const getConversation = async (id: string): Promise<Conversation> => {
  const { data } = await axiosInstance.get<ApiEnvelope<Conversation>>(`/conversations/${id}`);
  return data.data;
};

export const sendMessage = async (
  conversationId: string,
  payload: SendMessageInput
): Promise<Message> => {
  const { data } = await axiosInstance.post<ApiEnvelope<Message>>(
    `/conversations/${conversationId}/messages`,
    payload
  );
  return data.data;
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
  const { data } = await axiosInstance.get<ApiEnvelope<Message[]>>(
    `/conversations/${conversationId}/messages`
  );
  return data.data ?? [];
};

export const markConversationRead = async (conversationId: string): Promise<void> => {
  await axiosInstance.patch(`/conversations/${conversationId}/read`);
};
