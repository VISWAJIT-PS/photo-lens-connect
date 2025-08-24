import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Search, Send, Paperclip, Phone, Video, MoreVertical, Smile, ArrowLeft, MessageSquare, Images, Receipt, Lock, Award, CheckCircle, XCircle, Eye, Camera, Star, Upload, Package, Plus, Edit, Trash2, Calendar, Clock, FileText, Users, AlertCircle, CheckCheck, MapPin, DollarSign, UserPlus, Zap, PenTool, UserCheck, UserX, Settings, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { useToast } from '../ui/use-toast';

// Enhanced Chat component with 3 tabs
const ChatApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState("messages");
  const [conversations, setConversations] = useState([
    {
      id: "conv-1",
      name: "Sarah Johnson",
      role: "Client", 
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      lastMessage: "Perfect! I'll bring the backup camera as well.",
      timestamp: "2m ago",
      unreadCount: 0,
      isOnline: true,
      bookingId: "WED-2024-001",
      eventType: "Wedding Photography",
      projectStatus: "active",
      priority: "high",
      eventDate: "2024-02-15",
      deadline: "2024-02-20",
      messageType: "text"
    },
    {
      id: "conv-2",
      name: "Michael Chen",
      role: "Client",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      lastMessage: "Could you send the contract draft?",
      timestamp: "15m ago",
      unreadCount: 2,
      isOnline: false,
      bookingId: "CORP-2024-003",
      eventType: "Corporate Event",
      projectStatus: "pending",
      priority: "medium",
      eventDate: "2024-02-22",
      deadline: "2024-02-18",
      messageType: "document"
    },
    {
      id: "conv-3",
      name: "Emma Rodriguez",
      role: "Client",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      lastMessage: "The edited photos look amazing! Thank you.",
      timestamp: "1h ago",
      unreadCount: 0,
      isOnline: true,
      bookingId: "PORT-2024-012",
      eventType: "Portrait Session",
      projectStatus: "completed",
      priority: "low",
      eventDate: "2024-02-10",
      deadline: "2024-02-25",
      messageType: "image"
    },
    {
      id: "conv-4",
      name: "James Wilson",
      role: "Colleague",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      lastMessage: "Can we collaborate on the tech conference?",
      timestamp: "2h ago",
      unreadCount: 1,
      isOnline: true,
      bookingId: "COLLAB-2024-001",
      eventType: "Collaboration",
      projectStatus: "discussion",
      priority: "medium",
      eventDate: "2024-03-05",
      deadline: "2024-02-28",
      messageType: "text"
    }
  ]);

  const [galleryEvents, setGalleryEvents] = useState([
    {
      id: "event-1",
      eventName: "Sarah & John Wedding",
      customer: "Sarah Johnson",
      eventDate: "2024-02-15",
      uploadedPhotos: 45,
      approvedPhotos: 42,
      averageRating: 4.8,
      photos: [
        {
          id: "photo-1",
          url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
          rating: 5,
          approved: true,
          userFeedback: "Absolutely beautiful shot!"
        },
        {
          id: "photo-2",
          url: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=300&fit=crop",
          rating: 4,
          approved: true,
          userFeedback: "Love this one!"
        }
      ]
    }
  ]);

  const [portfolioPackages, setPortfolioPackages] = useState([
    {
      id: "pkg-1",
      name: "Wedding Photography",
      description: "Complete wedding day coverage with professional editing",
      budgetRange: "$1200-$2500",
      specialization: "Wedding & Events",
      subPackages: [
        { type: "Basic", price: "$1200", hours: "6 hours", photos: "200 edited photos" },
        { type: "Pro", price: "$1800", hours: "8 hours", photos: "400 edited photos + album" },
        { type: "Advance", price: "$2500", hours: "12 hours", photos: "600 edited photos + album + video highlights" }
      ]
    }
  ]);

  // Event Details Data
  const [eventDetails, setEventDetails] = useState({
    eventName: "Sarah & John Wedding",
    eventType: "Wedding Photography",
    client: "Sarah Johnson",
    date: "2024-02-15",
    time: "2:00 PM - 10:00 PM",
    location: "Central Park Conservatory Garden, NYC",
    venue: {
      name: "Conservatory Garden",
      address: "Central Park, 5th Ave & E 105th St, New York, NY 10029",
      contact: "+1 (212) 310-6600",
      notes: "Permit required for photography"
    },
    timeline: [
      { time: "2:00 PM", activity: "Bride preparation photos", location: "Plaza Hotel Suite" },
      { time: "4:00 PM", activity: "First look session", location: "Bethesda Fountain" },
      { time: "5:00 PM", activity: "Wedding ceremony", location: "Conservatory Garden" },
      { time: "6:00 PM", activity: "Cocktail hour", location: "Garden Reception Area" },
      { time: "7:30 PM", activity: "Reception dinner", location: "Main Pavilion" },
      { time: "9:00 PM", activity: "Dancing & party photos", location: "Dance Floor" }
    ],
    requirements: [
      "2 photographers (main + assistant)",
      "Drone shots permitted with advance notice",
      "No flash during ceremony",
      "Backup equipment required"
    ],
    deliverables: [
      "500+ edited high-resolution photos",
      "Online gallery within 4 weeks",
      "USB drive with full resolution images",
      "20-page wedding album"
    ],
    budget: "$2,500",
    status: "confirmed",
    notes: "Client prefers natural lighting and candid moments. Special focus on family group photos."
  });

  // Invoice Data
  const [invoices, setInvoices] = useState([
    {
      id: "INV-2024-001",
      client: "Sarah Johnson",
      projectName: "Sarah & John Wedding",
      issueDate: "2024-01-15",
      dueDate: "2024-02-01",
      status: "paid",
      subtotal: 2500,
      tax: 200,
      total: 2700,
      items: [
        {
          description: "Wedding Photography Package - Premium",
          quantity: 1,
          rate: 2000,
          amount: 2000
        },
        {
          description: "Additional Hour Coverage",
          quantity: 2,
          rate: 150,
          amount: 300
        },
        {
          description: "Wedding Album (20 pages)",
          quantity: 1,
          rate: 200,
          amount: 200
        }
      ],
      payments: [
        {
          date: "2024-01-20",
          amount: 1350, // 50% deposit
          method: "Bank Transfer",
          reference: "TXN-001"
        },
        {
          date: "2024-02-01",
          amount: 1350, // Final payment
          method: "Credit Card",
          reference: "TXN-002"
        }
      ]
    },
    {
      id: "INV-2024-002",
      client: "Michael Chen",
      projectName: "Corporate Event Photography",
      issueDate: "2024-02-10",
      dueDate: "2024-02-25",
      status: "pending",
      subtotal: 800,
      tax: 64,
      total: 864,
      items: [
        {
          description: "Corporate Event Photography (4 hours)",
          quantity: 1,
          rate: 800,
          amount: 800
        }
      ],
      payments: []
    }
  ]);

  // Team Members Data
  const [teamMembers, setTeamMembers] = useState([
    {
      id: "member-1",
      name: "Alex Rivera",
      role: "Assistant Photographer",
      email: "alex@photoassist.com",
      phone: "+1 (555) 123-4567",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      status: "active",
      joinDate: "2024-01-15",
      specialties: ["Portrait Photography", "Event Coverage"],
      equipment: ["Canon EOS R6", "24-70mm f/2.8", "Speedlight"],
      availability: "full-time",
      hourlyRate: "$50/hour"
    },
    {
      id: "member-2",
      name: "Jessica Chen",
      role: "Video Specialist",
      email: "jessica@videoteam.com",
      phone: "+1 (555) 987-6543",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      status: "active",
      joinDate: "2024-02-01",
      specialties: ["Wedding Videography", "Drone Operations"],
      equipment: ["Sony FX3", "DJI Mavic 3", "Gimbal Stabilizer"],
      availability: "weekends",
      hourlyRate: "$75/hour"
    },
    {
      id: "member-3",
      name: "David Park",
      role: "Photo Editor",
      email: "david@editpro.com",
      phone: "+1 (555) 456-7890",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      status: "freelance",
      joinDate: "2023-12-10",
      specialties: ["Photo Retouching", "Color Grading", "Album Design"],
      equipment: ["High-end Workstation", "Wacom Tablet", "Calibrated Monitors"],
      availability: "remote",
      hourlyRate: "$40/hour"
    }
  ]);

  // Available Rental Equipment Data
  const [rentalEquipment, setRentalEquipment] = useState([
    {
      id: 1,
      name: "Canon EOS R5",
      category: "Cameras",
      price: "$150/day",
      rating: 4.9,
      location: "New York, NY",
      description: "Professional mirrorless camera with 45MP sensor and 8K video recording.",
      image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
      available: true,
      reviews: 45,
      specs: ["45MP Full Frame", "8K Video", "5-axis Stabilization"],
      owner: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b3d8?w=64&h=64&fit=crop&crop=face",
        rating: 4.8,
        totalRentals: 120
      }
    },
    {
      id: 2,
      name: "Sony A7S III",
      category: "Cameras",
      price: "$120/day",
      rating: 4.8,
      location: "Los Angeles, CA",
      description: "Full-frame mirrorless perfect for video with excellent low-light performance.",
      image_url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd",
      available: true,
      reviews: 38,
      specs: ["12MP Full Frame", "4K Video", "Dual Base ISO"],
      owner: {
        name: "Mike Chen",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
        rating: 4.9,
        totalRentals: 98
      }
    },
    {
      id: 3,
      name: "DJI Mavic 3",
      category: "Drones",
      price: "$200/day",
      rating: 4.9,
      location: "San Francisco, CA",
      description: "Professional drone with Hasselblad camera and 5.1K video recording.",
      image_url: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108",
      available: true,
      reviews: 62,
      specs: ["Hasselblad Camera", "5.1K Video", "46min Flight Time"],
      owner: {
        name: "Alex Rivera",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
        rating: 4.7,
        totalRentals: 76
      }
    },
    {
      id: 4,
      name: "Godox AD200 Pro",
      category: "Lighting",
      price: "$80/day",
      rating: 4.7,
      location: "Chicago, IL",
      description: "Portable flash system with 200Ws power and lithium battery.",
      image_url: "https://images.unsplash.com/photo-1519638399535-1b036603ac77",
      available: true,
      reviews: 29,
      specs: ["200Ws Power", "Lithium Battery", "TTL Compatible"],
      owner: {
        name: "Jessica Liu",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
        rating: 4.6,
        totalRentals: 54
      }
    },
    {
      id: 5,
      name: "Sigma 85mm f/1.4",
      category: "Lenses",
      price: "$60/day",
      rating: 4.8,
      location: "Miami, FL",
      description: "Professional portrait lens with beautiful bokeh and sharp optics.",
      image_url: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35",
      available: false,
      reviews: 33,
      specs: ["f/1.4 Aperture", "Art Series", "HSM Autofocus"],
      owner: {
        name: "Carlos Rodriguez",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
        rating: 4.5,
        totalRentals: 42
      }
    },
    {
      id: 6,
      name: "Manfrotto Tripod",
      category: "Accessories",
      price: "$25/day",
      rating: 4.6,
      location: "Boston, MA",
      description: "Heavy-duty aluminum tripod with fluid head for smooth movements.",
      image_url: "https://images.unsplash.com/photo-1495707902641-75cac588d2e9",
      available: true,
      reviews: 21,
      specs: ["Aluminum Build", "Fluid Head", "Max Load 8kg"],
      owner: {
        name: "Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face",
        rating: 4.4,
        totalRentals: 38
      }
    }
  ]);

  const [messageInput, setMessageInput] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showPackageDialog, setShowPackageDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showFileDialog, setShowFileDialog] = useState(false);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [showCreateInvoiceDialog, setShowCreateInvoiceDialog] = useState(false);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const { toast } = useToast();

  // Work chat specific states
  const [workMessages, setWorkMessages] = useState([
    {
      id: "msg-1",
      conversationId: "conv-1",
      sender: "Sarah Johnson",
      senderType: "client",
      content: "Hi! I wanted to confirm the details for your wedding shoot next weekend. The venue is Central Park and we'll need to start at 2 PM.",
      timestamp: "10:30 AM",
      type: "text",
      isRead: true,
      attachments: []
    },
    {
      id: "msg-2",
      conversationId: "conv-1",
      sender: "You",
      senderType: "photographer",
      content: "Perfect! I'll bring the backup camera as well. Also sending you the shot list for review.",
      timestamp: "10:35 AM",
      type: "text",
      isRead: true,
      attachments: [
        {
          id: "att-1",
          name: "Wedding_Shot_List.pdf",
          type: "document",
          size: "245 KB"
        }
      ]
    },
    {
      id: "msg-3",
      conversationId: "conv-2",
      sender: "Michael Chen",
      senderType: "client",
      content: "Could you send the contract draft? Also, what equipment will you be bringing for the corporate event?",
      timestamp: "9:15 AM",
      type: "text",
      isRead: false,
      attachments: []
    }
  ]);

  const [taskList, setTaskList] = useState([
    {
      id: "task-1",
      conversationId: "conv-1",
      title: "Prepare equipment for wedding",
      description: "Pack cameras, lenses, and backup equipment",
      priority: "high",
      status: "pending",
      dueDate: "2024-02-14",
      assignedTo: "You"
    },
    {
      id: "task-2",
      conversationId: "conv-1",
      title: "Send shot list to client",
      description: "Review and send finalized shot list",
      priority: "medium",
      status: "completed",
      dueDate: "2024-02-12",
      assignedTo: "You"
    }
  ]);

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      sender: "You",
      senderType: "photographer",
      content: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "text",
      isRead: true,
      attachments: []
    };
    
    setWorkMessages(prev => [...prev, newMessage]);
    
    toast({
      title: "Message sent",
      description: "Your message has been sent to the client.",
    });
    setMessageInput("");
  };

  const sendFile = (file: any) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      sender: "You",
      senderType: "photographer",
      content: `Shared a file: ${file.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "file",
      isRead: true,
      attachments: [file]
    };
    
    setWorkMessages(prev => [...prev, newMessage]);
    
    toast({
      title: "File sent",
      description: `${file.name} has been shared with the client.`,
    });
  };

  const addTask = (task: any) => {
    const newTask = {
      id: `task-${Date.now()}`,
      conversationId: selectedConversation.id,
      ...task,
      status: "pending",
      assignedTo: "You"
    };
    
    setTaskList(prev => [...prev, newTask]);
    
    toast({
      title: "Task created",
      description: "New task has been added to your workflow.",
    });
  };

  const getFilteredConversations = () => {
    return conversations.filter(conv => {
      const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           conv.eventType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || conv.projectStatus === filterStatus;
      const matchesPriority = filterPriority === "all" || conv.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  };

  const getConversationMessages = (conversationId: string) => {
    return workMessages.filter(msg => msg.conversationId === conversationId);
  };

  const getConversationTasks = (conversationId: string) => {
    return taskList.filter(task => task.conversationId === conversationId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "discussion": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-full bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="border-b border-border px-6 py-4">
          <TabsList className="grid w-full grid-cols-8 max-w-4xl">
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Images className="h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="event-details" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Event Details
            </TabsTrigger>
            <TabsTrigger value="invoice" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Invoice
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="rentals" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              Rentals
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          {/* Messages Tab */}
          <TabsContent value="messages" className="h-full m-0">
            <div className="flex h-full">
              {/* Enhanced Conversation List */}
              <div className="w-80 border-r border-border bg-card">
                <div className="p-4 border-b border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Work Conversations</h2>
                    <Badge variant="secondary">{getFilteredConversations().length}</Badge>
                  </div>
                  
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Filters */}
                  <div className="flex gap-2">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="discussion">Discussion</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="overflow-y-auto">
                  {getFilteredConversations().map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 ${
                        selectedConversation?.id === conv.id ? "bg-muted" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={conv.avatar}
                            alt={conv.name}
                            className="w-10 h-10 rounded-full"
                          />
                          {conv.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{conv.name}</p>
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${getPriorityColor(conv.priority)}`}></div>
                              {conv.unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {conv.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">{conv.eventType}</p>
                            <Badge className={`text-xs ${getStatusColor(conv.projectStatus)}`}>
                              {conv.projectStatus}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{conv.timestamp}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {conv.eventDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Chat Area */}
              <div className="flex-1 flex flex-col">
                {selectedConversation && (
                  <>
                    {/* Enhanced Chat Header */}
                    <div className="p-4 border-b border-border bg-card">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={selectedConversation.avatar}
                              alt={selectedConversation.name}
                              className="w-8 h-8 rounded-full"
                            />
                            {selectedConversation.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{selectedConversation.name}</p>
                              <Badge variant="outline" className="text-xs">{selectedConversation.role}</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{selectedConversation.eventType}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {selectedConversation.eventDate}
                              </span>
                              <span>•</span>
                              <Badge className={getStatusColor(selectedConversation.projectStatus)}>
                                {selectedConversation.projectStatus}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => setShowTaskDialog(true)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setShowFileDialog(true)}>
                            <Paperclip className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Video className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Project Info Bar */}
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Deadline:</span>
                            <span className={`font-medium ${
                              new Date(selectedConversation.deadline) < new Date() ? 'text-red-600' : 'text-foreground'
                            }`}>
                              {selectedConversation.deadline}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertCircle className={`h-4 w-4 ${getPriorityColor(selectedConversation.priority)}`} />
                            <span className="text-muted-foreground">Priority:</span>
                            <span className={`font-medium capitalize ${getPriorityColor(selectedConversation.priority)}`}>
                              {selectedConversation.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">ID:</span>
                            <span className="font-medium">{selectedConversation.bookingId}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Message Area */}
                    <div className="flex-1 p-4 overflow-y-auto">
                      <div className="space-y-4">
                        {getConversationMessages(selectedConversation.id).map((message) => (
                          <div key={message.id} className={`flex ${message.senderType === 'photographer' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderType === 'photographer' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-xs font-medium">{message.sender}</p>
                                {!message.isRead && message.senderType !== 'photographer' && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-sm">{message.content}</p>
                              
                              {/* File Attachments */}
                              {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {message.attachments.map((attachment, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 bg-white/10 rounded text-xs">
                                      <FileText className="h-3 w-3" />
                                      <span>{attachment.name}</span>
                                      <span className="text-xs opacity-70">({attachment.size})</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between mt-1">
                                <p className={`text-xs ${
                                  message.senderType === 'photographer' ? 'opacity-70' : 'text-muted-foreground'
                                }`}>
                                  {message.timestamp}
                                </p>
                                {message.senderType === 'photographer' && (
                                  <CheckCheck className={`h-3 w-3 ${
                                    message.isRead ? 'text-blue-400' : 'opacity-50'
                                  }`} />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Enhanced Message Input */}
                    <div className="p-4 border-t border-border">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setShowFileDialog(true)}>
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Input
                          placeholder="Type your professional message..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={() => setShowTaskDialog(true)} variant="ghost" size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button onClick={sendMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="h-full m-0 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Work Tasks</h2>
                <Button onClick={() => setShowTaskDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>

              {/* Task Filters */}
              <div className="flex gap-4">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tasks List */}
              <div className="grid gap-4">
                {taskList
                  .filter(task => {
                    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
                    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
                    return matchesStatus && matchesPriority;
                  })
                  .map((task) => {
                    const conversation = conversations.find(c => c.id === task.conversationId);
                    return (
                      <Card key={task.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{task.title}</h3>
                              <Badge className={`text-xs ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {task.priority} priority
                              </Badge>
                              <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                                {task.status}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mb-3">{task.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Due: {task.dueDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {conversation?.name || 'Unknown'}
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {conversation?.eventType || 'General'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setTaskList(prev => prev.map(t => 
                                  t.id === task.id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
                                ));
                                toast({
                                  title: task.status === 'completed' ? "Task marked as pending" : "Task completed",
                                  description: "Task status updated successfully."
                                });
                              }}
                            >
                              {task.status === 'completed' ? (
                                <XCircle className="h-4 w-4 text-orange-600" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
              </div>
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="h-full m-0 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Event Gallery</h2>
                <Button onClick={() => setShowUploadDialog(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photos
                </Button>
              </div>

              <div className="grid gap-6">
                {galleryEvents.map((event) => (
                  <Card key={event.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{event.eventName}</CardTitle>
                          <p className="text-muted-foreground">Customer: {event.customer}</p>
                          <p className="text-sm text-muted-foreground">Date: {event.eventDate}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <p className="text-2xl font-bold text-primary">{event.uploadedPhotos}</p>
                              <p className="text-xs text-muted-foreground">Uploaded</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-600">{event.approvedPhotos}</p>
                              <p className="text-xs text-muted-foreground">Approved</p>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <p className="text-xl font-bold">{event.averageRating}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">Avg Rating</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {event.photos.map((photo) => (
                          <div key={photo.id} className="relative group">
                            <img
                              src={photo.url}
                              alt="Event photo"
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <div className="text-white text-center">
                                <div className="flex items-center justify-center mb-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${i < photo.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
                                    />
                                  ))}
                                </div>
                                <p className="text-xs">{photo.userFeedback}</p>
                              </div>
                            </div>
                            {photo.approved && (
                              <Badge className="absolute top-2 right-2 bg-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approved
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="h-full m-0 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Portfolio Packages</h2>
                <Button onClick={() => setShowPackageDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Package
                </Button>
              </div>

              <div className="grid gap-6">
                {portfolioPackages.map((pkg) => (
                  <Card key={pkg.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{pkg.name}</CardTitle>
                          <p className="text-muted-foreground">{pkg.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="secondary">{pkg.specialization}</Badge>
                            <Badge>{pkg.budgetRange}</Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className='bg-white'>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Package
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Package
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {pkg.subPackages.map((subPkg, index) => (
                          <Card key={index} className="border-2">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold">{subPkg.type}</h4>
                                <Badge variant={subPkg.type === 'Basic' ? 'outline' : subPkg.type === 'Pro' ? 'secondary' : 'default'}>
                                  {subPkg.price}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="space-y-2 text-sm text-muted-foreground">
                                <p>• {subPkg.hours}</p>
                                <p>• {subPkg.photos}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Event Details Tab */}
          <TabsContent value="event-details" className="h-full m-0 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Event Details</h2>
                <Badge className={eventDetails.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {eventDetails.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Basic Information */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Event Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Event Name</Label>
                        <p className="font-semibold">{eventDetails.eventName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Event Type</Label>
                        <p className="font-semibold">{eventDetails.eventType}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Client</Label>
                        <p className="font-semibold">{eventDetails.client}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Date & Time</Label>
                        <p className="font-semibold">{eventDetails.date}</p>
                        <p className="text-sm text-muted-foreground">{eventDetails.time}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                      <p className="font-semibold">{eventDetails.location}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Budget & Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Budget & Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Total Budget</Label>
                      <p className="text-2xl font-bold text-primary">{eventDetails.budget}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <Badge className="mt-1">{eventDetails.status}</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Event Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {eventDetails.timeline.map((item, index) => (
                        <div key={index} className="flex items-start gap-4 p-3 border rounded-lg">
                          <div className="flex-shrink-0">
                            <Badge variant="outline">{item.time}</Badge>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{item.activity}</p>
                            <p className="text-sm text-muted-foreground">{item.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Invoice Tab */}
          <TabsContent value="invoice" className="h-full m-0 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Invoice Management</h2>
                <Button onClick={() => setShowCreateInvoiceDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </div>

              <div className="grid gap-6">
                {invoices.map((invoice) => (
                  <Card key={invoice.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Receipt className="h-5 w-5" />
                            {invoice.id}
                          </CardTitle>
                          <p className="text-muted-foreground">{invoice.projectName}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={invoice.status === 'paid' ? 'bg-green-100 text-green-800' : invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>
                            {invoice.status}
                          </Badge>
                          <p className="text-2xl font-bold text-primary mt-1">${invoice.total}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Invoice Details */}
                        <div>
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Client</Label>
                              <p className="font-semibold">{invoice.client}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-muted-foreground">Issue Date</Label>
                              <p className="font-semibold">{invoice.issueDate}</p>
                            </div>
                          </div>

                          {/* Invoice Items */}
                          <div>
                            <h4 className="font-semibold mb-3">Invoice Items</h4>
                            <div className="space-y-2">
                              {invoice.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                                  <div className="flex-1">
                                    <p className="font-medium">{item.description}</p>
                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity} × ${item.rate}</p>
                                  </div>
                                  <p className="font-semibold">${item.amount}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Payment History */}
                        <div>
                          <h4 className="font-semibold mb-3">Payment History</h4>
                          {invoice.payments.length > 0 ? (
                            <div className="space-y-3">
                              {invoice.payments.map((payment, index) => (
                                <div key={index} className="p-3 border rounded-lg">
                                  <p className="font-medium">${payment.amount}</p>
                                  <p className="text-sm text-muted-foreground">{payment.date}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                              <p className="text-muted-foreground">No payments received</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="h-full m-0 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Team Members</h2>
                <Button onClick={() => setShowAddMemberDialog(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>

              <div className="grid gap-6">
                {teamMembers.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-16 h-16 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{member.name}</h3>
                              <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                                {member.status}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-2">{member.role}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <Label className="text-xs font-medium text-muted-foreground">Email</Label>
                                <p>{member.email}</p>
                              </div>
                              <div>
                                <Label className="text-xs font-medium text-muted-foreground">Phone</Label>
                                <p>{member.phone}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">{member.hourlyRate}</p>
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Rentals Tab */}
          <TabsContent value="rentals" className="h-full m-0 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Available Equipment Rentals</h2>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="cameras">Cameras</SelectItem>
                    <SelectItem value="lenses">Lenses</SelectItem>
                    <SelectItem value="lighting">Lighting</SelectItem>
                    <SelectItem value="drones">Drones</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rentalEquipment.map((item) => (
                  <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
                    <div className="relative">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {!item.available && (
                        <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                          <Badge variant="destructive">Not Available</Badge>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary">{item.category}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="font-bold text-primary">{item.price}</p>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">({item.reviews} reviews)</span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{item.location}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" disabled={!item.available}>
                          <Plus className="h-4 w-4 mr-2" />
                          Request Rental
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Upload Photo Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Event Photos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Event</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an event" />
                </SelectTrigger>
                <SelectContent>
                  {galleryEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.eventName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Upload Photos</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Drag & drop photos here or click to browse</p>
                <Button variant="outline" className="mt-4">
                  Choose Files
                </Button>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setShowUploadDialog(false);
                toast({ title: "Photos uploaded successfully!" });
              }}>
                Upload
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Package Dialog */}
      <Dialog open={showPackageDialog} onOpenChange={setShowPackageDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Package</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Package Name</Label>
                <Input placeholder="e.g., Wedding Photography" />
              </div>
              <div>
                <Label>Budget Range</Label>
                <Input placeholder="e.g., $1200-$2500" />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Describe your package..." />
            </div>
            <div>
              <Label>Specialization</Label>
              <Input placeholder="e.g., Wedding & Events" />
            </div>
            <div className="space-y-4">
              <Label>Sub-packages</Label>
              {['Basic', 'Pro', 'Advance'].map((type) => (
                <div key={type} className="grid grid-cols-4 gap-2 items-center p-3 border rounded-lg">
                  <Label className="font-medium">{type}</Label>
                  <Input placeholder="Price" />
                  <Input placeholder="Hours" />
                  <Input placeholder="Deliverables" />
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowPackageDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                setShowPackageDialog(false);
                toast({ title: "Package created successfully!" });
              }}>
                Create Package
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Task Title</Label>
              <Input placeholder="Enter task title..." />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Describe the task..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Due Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div>
              <Label>Related Conversation</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select conversation" />
                </SelectTrigger>
                <SelectContent>
                  {conversations.map((conv) => (
                    <SelectItem key={conv.id} value={conv.id}>
                      {conv.name} - {conv.eventType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowTaskDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                addTask({
                  title: "New Task",
                  description: "Task description",
                  priority: "medium",
                  dueDate: new Date().toISOString().split('T')[0]
                });
                setShowTaskDialog(false);
              }}>
                Create Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* File Sharing Dialog */}
      <Dialog open={showFileDialog} onOpenChange={setShowFileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Files</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>File Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select file type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="shot-list">Shot List</SelectItem>
                  <SelectItem value="timeline">Timeline</SelectItem>
                  <SelectItem value="other">Other Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Upload File</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <FileText className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Drag & drop file here or click to browse</p>
                <Button variant="outline" className="mt-4">
                  Choose File
                </Button>
              </div>
            </div>
            <div>
              <Label>Message (Optional)</Label>
              <Textarea placeholder="Add a message with the file..." />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowFileDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                sendFile({
                  id: `file-${Date.now()}`,
                  name: "sample-document.pdf",
                  type: "document",
                  size: "245 KB"
                });
                setShowFileDialog(false);
              }}>
                Send File
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Chat Dialog */}
      <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start New Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Client Name</Label>
              <Input placeholder="Enter client name..." />
            </div>
            <div>
              <Label>Client Email</Label>
              <Input type="email" placeholder="client@example.com" />
            </div>
            <div>
              <Label>Event Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wedding">Wedding Photography</SelectItem>
                  <SelectItem value="portrait">Portrait Session</SelectItem>
                  <SelectItem value="corporate">Corporate Event</SelectItem>
                  <SelectItem value="family">Family Photography</SelectItem>
                  <SelectItem value="engagement">Engagement Photos</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Initial Message</Label>
              <Textarea placeholder="Write your initial message to the client..." rows={4} />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowNewChatDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Conversation Started",
                  description: "New conversation has been created with the client."
                });
                setShowNewChatDialog(false);
              }}>
                Start Conversation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Invoice Dialog */}
      <Dialog open={showCreateInvoiceDialog} onOpenChange={setShowCreateInvoiceDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Client</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {conversations.map((conv) => (
                      <SelectItem key={conv.id} value={conv.id}>
                        {conv.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Project Name</Label>
                <Input placeholder="Enter project name..." />
              </div>
              <div>
                <Label>Issue Date</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input type="date" />
              </div>
            </div>

            <div>
              <Label className="text-lg font-semibold">Invoice Items</Label>
              <div className="space-y-3 mt-2">
                <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
                  <div className="col-span-5">Description</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Rate</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-1">Action</div>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <Input className="col-span-5" placeholder="Service description" />
                  <Input className="col-span-2" type="number" placeholder="1" />
                  <Input className="col-span-2" type="number" placeholder="0.00" />
                  <div className="col-span-2 flex items-center text-sm font-medium">$0.00</div>
                  <Button variant="outline" size="sm" className="col-span-1">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div></div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span className="font-semibold">$0.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-primary">$0.00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateInvoiceDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Invoice Created",
                  description: "New invoice has been created and saved as draft."
                });
                setShowCreateInvoiceDialog(false);
              }}>
                Create Invoice
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input placeholder="Enter full name..." />
              </div>
              <div>
                <Label>Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assistant">Assistant Photographer</SelectItem>
                    <SelectItem value="videographer">Video Specialist</SelectItem>
                    <SelectItem value="editor">Photo Editor</SelectItem>
                    <SelectItem value="coordinator">Event Coordinator</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="member@example.com" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input type="tel" placeholder="+1 (555) 123-4567" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Hourly Rate</Label>
                <Input placeholder="$50/hour" />
              </div>
              <div>
                <Label>Availability</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="weekends">Weekends only</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Specialties</Label>
              <Input placeholder="e.g., Portrait Photography, Event Coverage (comma separated)" />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Member Added",
                  description: "New team member has been added successfully."
                });
                setShowAddMemberDialog(false);
              }}>
                Add Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export function PhotographerChatWindow() {
  return (
    <div className="h-full">
      <ChatApp />
    </div>
  );
}