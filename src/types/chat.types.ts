// Chat-related type definitions

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
}

export interface GalleryPhoto {
  id: string;
  url: string;
  thumbnail: string;
  caption?: string;
  uploadedBy: string;
  uploadDate: string;
  status?: 'approved' | 'not_approved' | 'editors_choice';
}

export interface Invoice {
  id: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  services: string[];
  issueDate: string;
}

export interface Conversation {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  bookingId: string;
  messages: Message[];
  gallery?: GalleryPhoto[];
  invoice?: Invoice;
}

export interface ChatAppData {
  currentUserId: string;
  conversations: Conversation[];
}

export type ActiveView = 'messages' | 'gallery' | 'invoice';

export interface ChatState {
  chatData: ChatAppData;
  selectedConversationId: string | null;
  searchQuery: string;
  messageInput: string;
  isMobileView: boolean;
  activeView: ActiveView;
}