import { useState, useRef, useEffect } from 'react';
import type { ChatAppData, ChatState, Message, ActiveView, Conversation } from '../types/chat.types';
import { initialChatData } from '../data/chatMockData';

export const useChat = () => {
  const [chatData, setChatData] = useState<ChatAppData>(initialChatData);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>("conv-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>('messages');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversationId, chatData]);

  // Get filtered conversations based on search
  const getFilteredConversations = (): Conversation[] => {
    return chatData.conversations.filter(conv =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.bookingId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Get selected conversation
  const selectedConversation = selectedConversationId 
    ? chatData.conversations.find(conv => conv.id === selectedConversationId)
    : null;

  // Send message function
  const sendMessage = () => {
    if (!messageInput.trim() || !selectedConversationId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: chatData.currentUserId,
      content: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      status: 'sent'
    };

    setChatData(prev => ({
      ...prev,
      conversations: prev.conversations.map(conv => {
        if (conv.id === selectedConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: newMessage.content,
            timestamp: 'now'
          };
        }
        return conv;
      })
    }));

    setMessageInput("");
  };

  // Mark conversation as read
  const markAsRead = (conversationId: string) => {
    setChatData(prev => ({
      ...prev,
      conversations: prev.conversations.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, unreadCount: 0 };
        }
        return conv;
      })
    }));
  };

  // Handle conversation selection
  const selectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    markAsRead(conversationId);
    setActiveView('messages');
  };

  return {
    // State
    chatData,
    selectedConversationId,
    searchQuery,
    messageInput,
    isMobileView,
    activeView,
    selectedConversation,
    messagesEndRef,
    
    // Actions
    setSelectedConversationId,
    setSearchQuery,
    setMessageInput,
    setActiveView,
    sendMessage,
    selectConversation,
    getFilteredConversations,
  };
};