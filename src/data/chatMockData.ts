import type { ChatAppData } from '../types/chat.types';

export const initialChatData: ChatAppData = {
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
    },
    {
      id: "conv-5",
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
      id: "conv-6",
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
      id: "conv-7",
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
      id: "conv-8",
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
    },{
      id: "conv-9",
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
      id: "conv-10",
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
      id: "conv-11",
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
      id: "conv-12",
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