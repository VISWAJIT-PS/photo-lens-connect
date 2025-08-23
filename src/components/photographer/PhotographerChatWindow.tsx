import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Search, Send, Paperclip, Phone, Video, MoreVertical, Smile, ArrowLeft, MessageSquare, Images, Receipt, Lock, Award, CheckCircle, XCircle, Eye, Camera } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { useToast } from '../ui/use-toast';

// Chat component with all functionality
const ChatApp: React.FC = () => {
  const [chatData, setChatData] = useState<ChatAppData>({
    currentUserId: "user-1",
    conversations: [
      {
        id: "conv-1",
        name: "Sarah Johnson",
        role: "Wedding Photographer", 
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
        lastMessage: "Perfect! I'll bring the backup camera as well.",
        timestamp: "2m ago",
        unreadCount: 0,
        isOnline: true,
        bookingId: "WED-2024-001",
        messages: [
          {
            id: "msg-1",
            senderId: "sarah-1",
            content: "Hi! I wanted to confirm the details for your wedding shoot next weekend.",
            timestamp: "10:30 AM",
            type: "text",
            status: "read"
          }
        ]
      }
    ]
  });

  const params = useParams();
  const location = useLocation();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(params?.conversationId ?? "conv-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeView, setActiveView] = useState<'messages' | 'gallery' | 'invoice'>('messages');
  const { toast } = useToast();
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

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-xl font-semibold">Chat</h1>
        </div>
        <div className="flex-1 p-4">
          <div className="bg-white rounded-lg border h-full p-4">
            <p className="text-center text-muted-foreground">Chat functionality will be available here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Types
interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
}

interface Conversation {
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
}

interface ChatAppData {
  currentUserId: string;
  conversations: Conversation[];
}

export function PhotographerChatWindow() {
  return (
    <div className="h-full">
      <ChatApp />
    </div>
  );
}