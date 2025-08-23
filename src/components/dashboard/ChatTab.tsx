import React, { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Search, Send, Paperclip, Phone, Video, MoreVertical, Smile, ArrowLeft, MessageSquare, Images, Receipt, Lock, Award, CheckCircle, XCircle, Eye, Camera } from 'lucide-react';
import { Button } from '../ui/button';

// Types
interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
}

interface GalleryPhoto {
  id: string;
  url: string;
  thumbnail: string;
  caption?: string;
  uploadedBy: string;
  uploadDate: string;
  status?: 'approved' | 'not_approved' | 'editors_choice';
}

interface Invoice {
  id: string;
  bookingId: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  services: string[];
  issueDate: string;
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
  gallery?: GalleryPhoto[];
  invoice?: Invoice;
}

interface ChatAppData {
  currentUserId: string;
  conversations: Conversation[];
}

// Mock data
const initialChatData: ChatAppData = {
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
      gallery: [
        {
          id: "photo-1",
          url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800",
          thumbnail: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=300",
          caption: "Ceremony entrance",
          uploadedBy: "sarah-1",
          uploadDate: "2024-01-15",
          status: "editors_choice"
        },
        {
          id: "photo-2",
          url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
          thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?w=300",
          caption: "First dance",
          uploadedBy: "sarah-1",
          uploadDate: "2024-01-15",
          status: "approved"
        },
        {
          id: "photo-3",
          url: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800",
          thumbnail: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=300",
          caption: "Wedding cake",
          uploadedBy: "sarah-1",
          uploadDate: "2024-01-15",
          status: "not_approved"
        }
      ],
      invoice: {
        id: "inv-001",
        bookingId: "WED-2024-001",
        amount: 2500,
        status: "paid",
        dueDate: "2024-01-20",
        services: ["Wedding Photography", "Photo Editing", "Digital Gallery"],
        issueDate: "2024-01-10"
      },
      messages: [
        {
          id: "msg-1",
          senderId: "sarah-1",
          content: "Hi! I wanted to confirm the details for your wedding shoot next weekend.",
          timestamp: "10:30 AM",
          type: "text",
          status: "read"
        },
        {
          id: "msg-2",
          senderId: "user-1",
          content: "Yes, absolutely! The ceremony starts at 2 PM at Central Park.",
          timestamp: "10:32 AM",
          type: "text",
          status: "read"
        },
        {
          id: "msg-3",
          senderId: "sarah-1",
          content: "Perfect! I'll arrive at 1:30 PM to set up. Should I bring the backup camera as well?",
          timestamp: "10:33 AM",
          type: "text",
          status: "read"
        },
        {
          id: "msg-4",
          senderId: "user-1",
          content: "That would be great! Better to be prepared. Will you also capture the reception?",
          timestamp: "10:35 AM",
          type: "text",
          status: "read"
        },
        {
          id: "msg-5",
          senderId: "sarah-1",
          content: "Absolutely! I'll stay until 9 PM as discussed. The golden hour shots will be beautiful.",
          timestamp: "10:36 AM",
          type: "text",
          status: "read"
        },
        {
          id: "msg-6",
          senderId: "user-1",
          content: "Amazing! Can't wait to see the photos. When should we expect the edited gallery?",
          timestamp: "10:38 AM",
          type: "text",
          status: "read"
        },
        {
          id: "msg-7",
          senderId: "sarah-1",
          content: "I'll have the full gallery ready within 2 weeks. You'll get a preview within 48 hours!",
          timestamp: "10:40 AM",
          type: "text",
          status: "read"
        },
        {
          id: "msg-8",
          senderId: "sarah-1",
          content: "Perfect! I'll bring the backup camera as well.",
          timestamp: "10:42 AM",
          type: "text",
          status: "delivered"
        }
      ]
    },
    {
      id: "conv-2",
      name: "Michael Chen",
      role: "Portrait Photographer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      lastMessage: "The lighting setup looks great for tomorrow's shoot.",
      timestamp: "1h ago",
      unreadCount: 2,
      isOnline: false,
      bookingId: "PORT-2024-002",
      messages: [
        {
          id: "msg-9",
          senderId: "michael-1",
          content: "Hi! I've reviewed the location photos you sent. The natural lighting looks fantastic.",
          timestamp: "9:15 AM",
          type: "text",
          status: "read"
        },
        {
          id: "msg-10",
          senderId: "user-1",
          content: "Great! I was hoping the morning light would work well. What time should we start?",
          timestamp: "9:20 AM",
          type: "text",
          status: "read"
        },
        {
          id: "msg-11",
          senderId: "michael-1",
          content: "The lighting setup looks great for tomorrow's shoot.",
          timestamp: "9:25 AM",
          type: "text",
          status: "sent"
        },
        {
          id: "msg-12",
          senderId: "michael-1",
          content: "Let's start at 8 AM to catch the golden hour. I'll bring reflectors just in case.",
          timestamp: "9:26 AM",
          type: "text",
          status: "sent"
        }
      ]
    },
    {
      id: "conv-3",
      name: "Camera Rental Co.",
      role: "Equipment Rental",
      avatar: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop&crop=face",
      lastMessage: "Your equipment is ready for pickup.",
      timestamp: "3h ago",
      unreadCount: 1,
      isOnline: true,
      bookingId: "RENT-2024-003",
      messages: [
        {
          id: "msg-13",
          senderId: "rental-1",
          content: "Hello! This is to confirm your rental order for the Canon EOS R5 and 24-70mm lens.",
          timestamp: "7:30 AM",
          type: "text",
          status: "read"
        },
        {
          id: "msg-14",
          senderId: "user-1",
          content: "Yes, I need them for this weekend. When can I pick them up?",
          timestamp: "7:35 AM",
          type: "text",
          status: "read"
        },
        {
          id: "msg-15",
          senderId: "rental-1",
          content: "Your equipment is ready for pickup.",
          timestamp: "7:40 AM",
          type: "text",
          status: "sent"
        }
      ]
    },
    {
      id: "conv-4",
      name: "Alex Rodriguez",
      role: "Wedding Videographer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      lastMessage: "I've uploaded the highlight reel to your gallery.",
      timestamp: "1d ago",
      unreadCount: 0,
      isOnline: false,
      bookingId: "VID-2024-004",
      messages: [
        {
          id: "msg-16",
          senderId: "alex-1",
          content: "The wedding footage turned out amazing! I'm working on the highlight reel now.",
          timestamp: "Yesterday 2:15 PM",
          type: "text",
          status: "read"
        },
        {
          id: "msg-17",
          senderId: "user-1",
          content: "Fantastic! Can't wait to see it. How long will the full video be?",
          timestamp: "Yesterday 2:20 PM",
          type: "text",
          status: "read"
        },
        {
          id: "msg-18",
          senderId: "alex-1",
          content: "I've uploaded the highlight reel to your gallery.",
          timestamp: "Yesterday 4:30 PM",
          type: "text",
          status: "read"
        }
      ]
    }
  ]
};

const ChatApp: React.FC = () => {
  const [chatData, setChatData] = useState<ChatAppData>(initialChatData);
  const params = useParams();
  const location = useLocation();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(params?.conversationId ?? "conv-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeView, setActiveView] = useState<'messages' | 'gallery' | 'invoice'>('messages');
  
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

  // Load persisted mock messages for a selected conversation (written by ProfilePage)
  useEffect(() => {
    if (!selectedConversationId) return;
    try {
      const vendorId = selectedConversationId.replace(/^conv-/, '');
      const key = `mock_chat_${vendorId}`;
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) as any[] : [];

      // Transform persisted messages into Message shape
      const savedMessages: Message[] = Array.isArray(arr) ? arr.map((m, i) => ({
        id: `mock-${Date.now()}-${i}`,
        senderId: m.author === 'user' ? chatData.currentUserId : `vendor-${vendorId}`,
        content: m.content,
        timestamp: new Date(m.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        status: 'sent'
      })) : [];

      setChatData(prev => {
        const exists = prev.conversations.some(conv => conv.id === selectedConversationId);
        if (exists) {
          return {
            ...prev,
            conversations: prev.conversations.map(conv => {
              if (conv.id !== selectedConversationId) return conv;

              // Avoid duplicating if last message already matches
              const lastExisting = conv.messages[conv.messages.length - 1];
              const lastSaved = savedMessages[savedMessages.length - 1];
              if (lastExisting && lastSaved && lastExisting.content === lastSaved.content) {
                return conv;
              }

              return {
                ...conv,
                messages: [...conv.messages, ...savedMessages],
                lastMessage: savedMessages.length ? savedMessages[savedMessages.length - 1].content : conv.lastMessage,
                timestamp: 'now'
              };
            })
          };
        }

        // Conversation doesn't exist — create a new one using query params
        const qs = new URLSearchParams(location.search);
        const name = qs.get('name') ? qs.get('name') as string : `User ${vendorId}`;
        const role = qs.get('role') ? qs.get('role') as string : '';
        const avatar = qs.get('avatar') ? qs.get('avatar') as string : '';

        const newConv: Conversation = {
          id: selectedConversationId,
          name: decodeURIComponent(name),
          role: decodeURIComponent(role),
          avatar: decodeURIComponent(avatar),
          lastMessage: savedMessages.length ? savedMessages[savedMessages.length - 1].content : '',
          timestamp: 'now',
          unreadCount: 0,
          isOnline: false,
          bookingId: `BOOK-${vendorId}`,
          messages: savedMessages.length ? savedMessages : [],
        } as any;

        return {
          ...prev,
          conversations: [...prev.conversations, newConv]
        };
      });
    } catch (e) {
      // noop
    }
  }, [selectedConversationId, location.search]);

  // Get filtered conversations based on search
  const getFilteredConversations = () => {
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

  // Render conversation list
  const renderConversationList = () => (
    <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
        <h2 className="text-xl font-bold mb-3 text-gray-900">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Scrollable Conversations List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {getFilteredConversations().map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => selectConversation(conversation.id)}
              className={`p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                selectedConversationId === conversation.id 
                  ? "bg-blue-50 border border-blue-200 shadow-sm" 
                  : "hover:shadow-sm"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={conversation.avatar}
                    alt={conversation.name}
                    className="h-10 w-10 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.name)}&size=40&background=6366f1&color=ffffff`;
                    }}
                  />
                  {conversation.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold truncate text-gray-900 text-sm">{conversation.name}</h4>
                    <span className="text-xs text-gray-500 flex-shrink-0">{conversation.timestamp}</span>
                  </div>
                  
                  <p className="text-xs text-blue-600 mb-1 font-medium">{conversation.role}</p>
                  
                  <p className="text-sm text-gray-600 truncate mb-2 leading-tight">
                    {conversation.lastMessage}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-mono">
                      {conversation.bookingId}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <span className="h-5 w-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Gallery Section
  const renderGallery = () => {
    if (!selectedConversation?.gallery || selectedConversation.gallery.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <div className="mb-4 w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
              <Lock className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Gallery Locked</h3>
            <p className="text-gray-500">Photos will be available after the event</p>
          </div>
        </div>
      );
    }

    const sortedPhotos = [...selectedConversation.gallery].sort((a, b) => {
      const statusPriority = { editors_choice: 3, approved: 2, not_approved: 1 };
      const aPriority = statusPriority[a.status || 'approved'];
      const bPriority = statusPriority[b.status || 'approved'];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    });

    const getStatusInfo = (status?: string) => {
      switch (status) {
        case 'editors_choice':
          return {
            icon: <Award className="h-3 w-3" />,
            label: "Editor's Choice",
            className: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
          };
        case 'approved':
          return {
            icon: <CheckCircle className="h-3 w-3" />,
            label: 'Approved',
            className: 'bg-green-100 text-green-800 border-green-200'
          };
        case 'not_approved':
          return {
            icon: <XCircle className="h-3 w-3" />,
            label: 'Review',
            className: 'bg-orange-100 text-orange-800 border-orange-200'
          };
        default:
          return {
            icon: <CheckCircle className="h-3 w-3" />,
            label: 'Approved',
            className: 'bg-green-100 text-green-800 border-green-200'
          };
      }
    };

    return (
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Camera className="h-5 w-5 text-blue-600" />
            Event Photos ({selectedConversation.gallery.length})
          </h3>
          <p className="text-sm text-gray-600">Sorted by review status and upload date</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedPhotos.map((photo) => {
            const statusInfo = getStatusInfo(photo.status);
            return (
              <div key={photo.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group border border-gray-100">
                <div className="aspect-square relative">
                  <img
                    src={photo.thumbnail}
                    alt={photo.caption || 'Event photo'}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() => window.open(photo.url, '_blank')}
                  />
                  
                  <div className="absolute top-2 left-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm ${statusInfo.className}`}>
                      {statusInfo.icon}
                      <span className="hidden sm:inline">{statusInfo.label}</span>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="ghost" className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-white transition-colors">
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                  </div>
                </div>
                
                {photo.caption && (
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate">{photo.caption}</p>
                    <p className="text-xs text-gray-500 mt-1">{photo.uploadDate}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Invoice Section
  const renderInvoice = () => {
    if (!selectedConversation?.invoice) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <div className="mb-4 w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
              <Lock className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Invoice Not Available</h3>
            <p className="text-gray-500">Invoice will be generated after booking confirmation</p>
          </div>
        </div>
      );
    }

    const invoice = selectedConversation.invoice;
    const statusColors = {
      paid: 'text-green-700 bg-green-100 border-green-200',
      pending: 'text-amber-700 bg-amber-100 border-amber-200',
      overdue: 'text-red-700 bg-red-100 border-red-200'
    };

    return (
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Invoice #{invoice.id}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusColors[invoice.status]}`}>
                {invoice.status === 'paid' ? '✓ Paid' : 
                 invoice.status === 'pending' ? '⏳ Pending' : 
                 '⚠️ Overdue'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Issue Date</p>
                <p className="font-semibold">{invoice.issueDate}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Due Date</p>
                <p className="font-semibold">{invoice.dueDate}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Booking ID</p>
                <p className="font-mono font-semibold">{invoice.bookingId}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Total Amount</p>
                <p className="font-bold text-xl text-blue-600">${invoice.amount.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-3">Services Included</h4>
            <div className="space-y-2">
              {invoice.services.map((service, index) => (
                <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700 font-medium">{service}</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              ))}
            </div>
          </div>

          {invoice.status === 'pending' && (
            <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-xl">
              <Button variant="ghost" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                <Receipt className="h-4 w-4" />
                Pay Now - ${invoice.amount.toLocaleString()}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render Messages Section
  const renderMessages = () => (
    <div className="flex-1 flex flex-col h-full">
      {/* Scrollable Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {selectedConversation!.messages.map((message) => {
            const isOwn = message.senderId === chatData.currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    isOwn
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-900 border border-gray-200 shadow-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs ${
                      isOwn ? "text-blue-100" : "text-gray-500"
                    }`}>
                      {message.timestamp}
                    </p>
                    {isOwn && (
                      <span className={`text-xs ml-2 ${
                        message.status === 'read' ? 'text-blue-200' : 
                        message.status === 'delivered' ? 'text-blue-300' : 'text-blue-400'
                      }`}>
                        {message.status === 'read' ? '✓✓' : 
                         message.status === 'delivered' ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      
    </div>
  );

  // Render chat area
  const renderChatArea = () => {
    if (!selectedConversation) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mb-4 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <MessageSquare className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a conversation</h3>
            <p className="text-gray-500">Choose a conversation from the sidebar to start chatting</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col bg-white">
        {/* Fixed Chat Header */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isMobileView && (
                <Button variant="ghost"
                  onClick={() => setSelectedConversationId(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Button>
              )}
              
              <div className="relative">
                <img
                  src={selectedConversation.avatar}
                  alt={selectedConversation.name}
                  className="h-12 w-12 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConversation.name)}&size=48&background=6366f1&color=ffffff`;
                  }}
                />
                {selectedConversation.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{selectedConversation.name}</h3>
                <p className="text-sm text-blue-600 font-medium">{selectedConversation.role}</p>
                <p className="text-xs text-gray-500">{selectedConversation.isOnline ? 'Active now' : 'Last seen recently'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-mono font-semibold">
                {selectedConversation.bookingId}
              </span>
              <Button variant="ghost" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Phone className="h-5 w-5 text-gray-600" />
              </Button>
              <Button variant="ghost" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Video className="h-5 w-5 text-gray-600" />
              </Button>
              <Button variant="ghost" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>

        {/* Fixed Tab Navigation */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-white">
          <div className="flex">
            <Button variant="ghost"
              onClick={() => setActiveView('messages')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
                activeView === 'messages'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Messages
            </Button>
            <Button variant="ghost"
              onClick={() => {
                if (!selectedConversation?.gallery) {
                  return;
                }
                setActiveView('gallery');
              }}
              disabled={!selectedConversation.gallery}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
                activeView === 'gallery'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : selectedConversation.gallery
                    ? 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    : 'border-transparent text-gray-400 cursor-not-allowed'
              }`}
            >
              <Images className="h-4 w-4" />
              Gallery
              {selectedConversation.gallery && (
                <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full font-medium">
                  {selectedConversation.gallery.length}
                </span>
              )}
              {!selectedConversation.gallery && <Lock className="h-3 w-3" />}
            </Button>
            <Button variant="ghost"
              onClick={() => {
                if (!selectedConversation?.invoice) {
                  return;
                }
                setActiveView('invoice');
              }}
              disabled={!selectedConversation.invoice}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
                activeView === 'invoice'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : selectedConversation.invoice
                    ? 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    : 'border-transparent text-gray-400 cursor-not-allowed'
              }`}
            >
              <Receipt className="h-4 w-4" />
              Invoice
              {selectedConversation.invoice && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                  selectedConversation.invoice.status === 'paid' 
                    ? 'bg-green-100 text-green-800'
                    : selectedConversation.invoice.status === 'pending'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedConversation.invoice.status === 'paid' ? '✓' : 
                   selectedConversation.invoice.status === 'pending' ? '⏳' : '⚠️'}
                </span>
              )}
              {!selectedConversation.invoice && <Lock className="h-3 w-3" />}
            </Button>
          </div>
        </div>
        
        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-hidden h-[90vh]">
          {activeView === 'messages' && renderMessages()}
          {activeView === 'gallery' && renderGallery()}
          {activeView === 'invoice' && renderInvoice()}
        </div>

        {/* Fixed Message Input */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Paperclip className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Smile className="h-5 w-5 text-gray-600" />
          </Button>
          <input
            type="text"
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          />
          <Button variant="ghost"
            onClick={sendMessage}
            disabled={!messageInput.trim()}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">
      {/* Mobile Layout */}
      {isMobileView && (
        <div className="w-full h-full">
          {selectedConversationId ? renderChatArea() : renderConversationList()}
        </div>
      )}

      {/* Desktop Layout */}
      {!isMobileView && (
        <>
          {renderConversationList()}
          {renderChatArea()}
        </>
      )}
    </div>
  );
};

export default ChatApp;