import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Search, Send, Paperclip, Phone, Video, MoreVertical, Smile, ArrowLeft, MessageSquare, Images, Receipt, Lock, Award, CheckCircle, XCircle, Eye, Camera, Star, Upload, Package, Plus, Edit, Trash2, Calendar, Clock, FileText, Users, AlertCircle, CheckCheck, MapPin, DollarSign, UserPlus, Zap, Wrench, UserCheck, UserX, Settings, Download, ChevronRight, ChevronLeft, Share2, Users2, BarChart3, PieChart, Activity, TrendingUp, Heart, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
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

  // Enhanced Chat component with event listing and management
const ChatApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState("events");
  
  // Event listings - created by photographer or initiated by users
  const [eventListings, setEventListings] = useState([
    {
      id: "event-4",
      eventName: "Farzan's Bachelor Party",
      eventType: "Event Photography",
      eventOwner: "Farzan Shibu",
      eventOwnerRole: "Groom",
      eventOwnerEmail: "farzan.netlens@gmail.com",
      eventOwnerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      createdBy: "user",
      createdAt: "2024-02-01",
      eventDate: "2025-10-25",
      eventTime: "2:00 PM - 10:00 PM",
      location: "Seattle, WA",
      status: "pending",
      priority: "high",
      budget: "$2,500",
      packageType: "Custom",
      assignedTeamMembers: ["member-1", "member-2"],
      conversationId: "conv-5",
      hasChat: true,
      galleryPhotos: 45,
      approvedPhotos: 42,
      unreadMessages: 0,
      lastActivity: "2m ago"
    },
    {
      id: "event-1",
      eventName: "Sarah & John Wedding",
      eventType: "Wedding Photography",
      eventOwner: "Sarah Johnson",
      eventOwnerRole: "Bride",
      eventOwnerEmail: "sarah.johnson@email.com",
      eventOwnerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      createdBy: "photographer",
      createdAt: "2024-02-01",
      eventDate: "2024-02-15",
      eventTime: "2:00 PM - 10:00 PM",
      location: "Central Park Conservatory Garden, NYC",
      status: "active",
      priority: "high",
      budget: "$2,500",
      packageType: "Premium Wedding",
      assignedTeamMembers: ["member-1", "member-2"],
      conversationId: "conv-1",
      hasChat: true,
      galleryPhotos: 45,
      approvedPhotos: 42,
      unreadMessages: 0,
      lastActivity: "2m ago"
    },
    {
      id: "event-2",
      eventName: "Corporate Event Photography",
      eventType: "Corporate Event",
      eventOwner: "Michael Chen",
      eventOwnerRole: "Event Manager",
      eventOwnerEmail: "michael.chen@company.com",
      eventOwnerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      createdBy: "user",
      createdAt: "2024-02-10",
      eventDate: "2024-02-22",
      eventTime: "9:00 AM - 6:00 PM",
      location: "Downtown Convention Center",
      status: "pending",
      priority: "medium",
      budget: "$1,200",
      packageType: "Corporate Standard",
      assignedTeamMembers: ["member-3"],
      conversationId: "conv-2",
      hasChat: true,
      galleryPhotos: 0,
      approvedPhotos: 0,
      unreadMessages: 2,
      lastActivity: "15m ago"
    },
    {
      id: "event-3",
      eventName: "Emma's Portrait Session",
      eventType: "Portrait Session",
      eventOwner: "Emma Rodriguez",
      eventOwnerRole: "Client",
      eventOwnerEmail: "emma.rodriguez@email.com",
      eventOwnerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      createdBy: "user",
      createdAt: "2024-02-05",
      eventDate: "2024-02-20",
      eventTime: "10:00 AM - 12:00 PM",
      location: "Central Park",
      status: "completed",
      priority: "low",
      budget: "$500",
      packageType: "Portrait Basic",
      assignedTeamMembers: [],
      conversationId: "conv-3",
      hasChat: true,
      galleryPhotos: 35,
      approvedPhotos: 35,
      unreadMessages: 0,
      lastActivity: "1h ago"
    }
  ]);
  
  const [selectedEvent, setSelectedEvent] = useState(eventListings[0]);
  
  // Admin Dashboard Data Structures
  const [selectedEventForAnalytics, setSelectedEventForAnalytics] = useState<string>("");
  const [eventAnalytics, setEventAnalytics] = useState<any>(null);
  const [eventUsers, setEventUsers] = useState<any[]>([]);

  // Enhanced event analytics data
  const [eventAnalyticsData, setEventAnalyticsData] = useState({
    [eventListings[0].id]: {
      totalRegistrations: 45,
      totalPhotosUploaded: 180,
      totalMatchesFound: 42,
      averageMatchConfidence: 87,
      userDemographics: {
        ageGroups: {
          "18-25": 12,
          "26-35": 18,
          "36-45": 10,
          "46-55": 4,
          "55+": 1
        },
        genderDistribution: {
          male: 22,
          female: 20,
          other: 3
        }
      },
      popularTags: [
        { tag: "wedding", count: 45 },
        { tag: "portrait", count: 32 },
        { tag: "ceremony", count: 28 },
        { tag: "reception", count: 25 },
        { tag: "family", count: 18 }
      ],
      engagementMetrics: {
        photosDownloaded: 156,
        photosShared: 89,
        favoritesMarked: 67,
        averageSessionTime: "12m 34s"
      },
      registrationTrends: [
        { date: "2024-01-15", count: 5 },
        { date: "2024-01-16", count: 8 },
        { date: "2024-01-17", count: 12 },
        { date: "2024-01-18", count: 15 },
        { date: "2024-01-19", count: 5 }
      ]
    }
  });

  // Enhanced user data
  const [eventUsersData, setEventUsersData] = useState({
    [eventListings[0].id]: [
      {
        id: "user-1",
        name: "Sarah Johnson",
        whatsappNumber: "+1234567890",
        phoneNumber: "+1234567890",
        registrationDate: "2024-01-15T10:00:00Z",
        status: "completed",
        photosUploaded: 25,
        matchesFound: 23,
        lastActivity: "2024-01-20T14:30:00Z"
      },
      {
        id: "user-2",
        name: "Michael Chen",
        whatsappNumber: "+1234567891",
        phoneNumber: "+1234567891",
        registrationDate: "2024-01-16T09:15:00Z",
        status: "completed",
        photosUploaded: 18,
        matchesFound: 16,
        lastActivity: "2024-01-19T16:45:00Z"
      },
      {
        id: "user-3",
        name: "Emma Rodriguez",
        whatsappNumber: "+1234567892",
        phoneNumber: "+1234567892",
        registrationDate: "2024-01-17T11:30:00Z",
        status: "pending",
        photosUploaded: 12,
        matchesFound: 3,
        lastActivity: "2024-01-18T13:20:00Z"
      },
      {
        id: "user-4",
        name: "Farzan Shibu",
        whatsappNumber: "+1234567892",
        phoneNumber: "+1234567892",
        registrationDate: "2024-01-17T11:30:00Z",
        status: "pending",
        photosUploaded: 12,
        matchesFound: 3,
        lastActivity: "2024-01-18T13:20:00Z"
      }
    ]
  });
  
  // Available photographers and videographers for team assignment
  const [availableCreators, setAvailableCreators] = useState([
    {
      id: "creator-1",
      name: "Alex Thompson",
      type: "photographer",
      specialties: ["Wedding Photography", "Portrait"],
      rating: 4.9,
      location: "New York, NY",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      hourlyRate: "$150/hour",
      availability: "available"
    },
    {
      id: "creator-2",
      name: "Maria Garcia",
      type: "videographer",
      specialties: ["Wedding Videography", "Corporate Events"],
      rating: 4.8,
      location: "New York, NY",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      hourlyRate: "$200/hour",
      availability: "available"
    },
    {
      id: "creator-3",
      name: "James Wilson",
      type: "photographer",
      specialties: ["Corporate Photography", "Event Coverage"],
      rating: 4.7,
      location: "New York, NY",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
      hourlyRate: "$120/hour",
      availability: "busy"
    },
    {
      id: "creator-4",
      name: "Lisa Chen",
      type: "videographer",
      specialties: ["Drone Operations", "Cinematic Videos"],
      rating: 4.9,
      location: "New York, NY",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b3d8?w=64&h=64&fit=crop&crop=face",
      hourlyRate: "$180/hour",
      availability: "available"
    },
    {
      id: "creator-5",
      name: "Farzan Chen",
      type: "videographer",
      specialties: ["Drone Operations", "Cinematic Videos"],
      rating: 4.9,
      location: "New York, NY",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b3d8?w=64&h=64&fit=crop&crop=face",
      hourlyRate: "$180/hour",
      availability: "available"
    }
  ]);
  
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
      id: "conv-5",
      name: "Farzan shibu",
      role: "Client",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      lastMessage: "",
      timestamp: "15m ago",
      unreadCount: 2,
      isOnline: false,
      bookingId: "CORP-2024-003",
      eventType: "Corporate Event",
      projectStatus: "pending",
      priority: "medium",
      eventDate: "2025-10-25",
      deadline: "2025-10-30",
      messageType: "document"
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
    },
    {
      id: "conv-5",
      name: "farzan shibu",
      role: "Colleague",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      lastMessage: "Can we collaborate on the tech conference?",
      timestamp: "2h ago",
      unreadCount: 1,
      isOnline: true,
      bookingId: "WED-2024-005",
      eventType: "Collaboration",
      projectStatus: "discussion",
      priority: "medium",
      eventDate: "2025-10-25",
      deadline: "2025-10-30",
      messageType: "text"
    }
  ]);

  const [galleryEvents, setGalleryEvents] = useState([
    {
      id: "event-4",
      eventName: "Farzan's Bachelor Party",
      customer: "Farzan Shibu",
      eventDate: "2025-10-25",
      uploadedPhotos: 45,
      approvedPhotos: 42,
      averageRating: 4.8,
      photos: [
        {
          id: "photo-1",
          url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop",
          rating: 5,
          approved: true,
          userFeedback: "Absolutely beautiful shot!"
        },
        {
          id: "photo-2",
          url: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=1200&h=800&fit=crop",
          rating: 4,
          approved: true,
          userFeedback: "Love this one!"
        },
        {
          id: "photo-3",
          url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&h=800&fit=crop",
          rating: 5,
          approved: true,
          userFeedback: "Perfect ceremony moment!"
        },
        {
          id: "photo-4",
          url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=800&fit=crop",
          rating: 4,
          approved: true,
          userFeedback: "Beautiful venue shot!"
        },
        {
          id: "photo-5",
          url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&h=800&fit=crop",
          rating: 5,
          approved: true,
          userFeedback: "Amazing couple portrait!"
        },
        {
          id: "photo-6",
          url: "https://images.unsplash.com/photo-1594736797933-d0bc2a7f7121?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1594736797933-d0bc2a7f7121?w=1200&h=800&fit=crop",
          rating: 4,
          approved: true,
          userFeedback: "Great candid moment!"
        },
        {
          id: "photo-7",
          url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&h=800&fit=crop",
          rating: 5,
          approved: true,
          userFeedback: "Stunning reception photo!"
        },
        {
          id: "photo-8",
          url: "https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?w=1200&h=800&fit=crop",
          rating: 4,
          approved: true,
          userFeedback: "Beautiful ring details!"
        }
      ]
    },
    {
      id: "event-3",
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
          fullUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop",
          rating: 5,
          approved: true,
          userFeedback: "Absolutely beautiful shot!"
        },
        {
          id: "photo-2",
          url: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=1200&h=800&fit=crop",
          rating: 4,
          approved: true,
          userFeedback: "Love this one!"
        },
        {
          id: "photo-3",
          url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&h=800&fit=crop",
          rating: 5,
          approved: true,
          userFeedback: "Perfect ceremony moment!"
        },
        {
          id: "photo-4",
          url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=800&fit=crop",
          rating: 4,
          approved: true,
          userFeedback: "Beautiful venue shot!"
        },
        {
          id: "photo-5",
          url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&h=800&fit=crop",
          rating: 5,
          approved: true,
          userFeedback: "Amazing couple portrait!"
        },
        {
          id: "photo-6",
          url: "https://images.unsplash.com/photo-1594736797933-d0bc2a7f7121?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1594736797933-d0bc2a7f7121?w=1200&h=800&fit=crop",
          rating: 4,
          approved: true,
          userFeedback: "Great candid moment!"
        },
        {
          id: "photo-7",
          url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&h=800&fit=crop",
          rating: 5,
          approved: true,
          userFeedback: "Stunning reception photo!"
        },
        {
          id: "photo-8",
          url: "https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?w=1200&h=800&fit=crop",
          rating: 4,
          approved: true,
          userFeedback: "Beautiful ring details!"
        }
      ]
    },
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
          fullUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop",
          rating: 5,
          approved: true,
          userFeedback: "Absolutely beautiful shot!"
        },
        {
          id: "photo-2",
          url: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=1200&h=800&fit=crop",
          rating: 4,
          approved: true,
          userFeedback: "Love this one!"
        },
        {
          id: "photo-3",
          url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&h=800&fit=crop",
          rating: 5,
          approved: true,
          userFeedback: "Perfect ceremony moment!"
        },
        {
          id: "photo-4",
          url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=800&fit=crop",
          rating: 4,
          approved: true,
          userFeedback: "Beautiful venue shot!"
        },
        {
          id: "photo-5",
          url: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&h=800&fit=crop",
          rating: 5,
          approved: true,
          userFeedback: "Amazing couple portrait!"
        },
        {
          id: "photo-6",
          url: "https://images.unsplash.com/photo-1594736797933-d0bc2a7f7121?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1594736797933-d0bc2a7f7121?w=1200&h=800&fit=crop",
          rating: 4,
          approved: true,
          userFeedback: "Great candid moment!"
        },
        {
          id: "photo-7",
          url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&h=800&fit=crop",
          rating: 5,
          approved: true,
          userFeedback: "Stunning reception photo!"
        },
        {
          id: "photo-8",
          url: "https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?w=1200&h=800&fit=crop",
          rating: 4,
          approved: true,
          userFeedback: "Beautiful ring details!"
        }
      ]
    },
    {
      id: "event-2",
      eventName: "Corporate Event Photography",
      customer: "Michael Chen",
      eventDate: "2024-02-22",
      uploadedPhotos: 28,
      approvedPhotos: 25,
      averageRating: 4.6,
      photos: [
        {
          id: "photo-9",
          url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&h=800&fit=crop",
          rating: 5,
          approved: true,
          userFeedback: "Professional conference shot!"
        },
        {
          id: "photo-10",
          url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=800&fit=crop",
          rating: 4,
          approved: true,
          userFeedback: "Great speaker capture!"
        },
        {
          id: "photo-11",
          url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800&fit=crop",
          rating: 4,
          approved: true,
          userFeedback: "Nice networking moment!"
        },
        {
          id: "photo-12",
          url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
          fullUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop",
          rating: 5,
          approved: true,
          userFeedback: "Perfect venue overview!"
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
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);
  const [showInviteUserDialog, setShowInviteUserDialog] = useState(false);
  const [showAddTeamMemberDialog, setShowAddTeamMemberDialog] = useState(false);
  const [showEventDetailsDialog, setShowEventDetailsDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [eventFilter, setEventFilter] = useState("all"); // all, created-by-me, user-initiated
  
  // Lightbox state for photo viewer
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentEventPhotos, setCurrentEventPhotos] = useState([]);
  
  // Create Event Form Data
  const [createEventForm, setCreateEventForm] = useState({
    eventName: "",
    eventType: "",
    clientName: "",
    clientEmail: "",
    eventDate: "",
    eventTime: "",
    location: "",
    venueAddress: "",
    budget: "",
    packageType: "",
    assignedMembers: [] as string[]
  });
  
  const { toast } = useToast();

  // Work chat specific states
  const [workMessages, setWorkMessages] = useState([
    {
      id: "msg-4",
      conversationId: "conv-5",
      sender: "Farzan shibu",
      senderType: "client",
      content: "Hi Viswajit P S, I'd like to book the custom package for $25000. Please confirm.",
      timestamp: "10:30 AM",
      type: "text",
      isRead: true,
      attachments: []
    },
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

  // Add keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!showLightbox || currentEventPhotos.length <= 1) return;
      
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const prevIndex = currentPhotoIndex > 0 ? currentPhotoIndex - 1 : currentEventPhotos.length - 1;
        setCurrentPhotoIndex(prevIndex);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        const nextIndex = currentPhotoIndex < currentEventPhotos.length - 1 ? currentPhotoIndex + 1 : 0;
        setCurrentPhotoIndex(nextIndex);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        setShowLightbox(false);
      }
    };

    if (showLightbox) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [showLightbox, currentPhotoIndex, currentEventPhotos.length]);

  // Handle event selection for analytics
  useEffect(() => {
    if (selectedEventForAnalytics) {
      setEventAnalytics(eventAnalyticsData[selectedEventForAnalytics] || null);
      setEventUsers(eventUsersData[selectedEventForAnalytics] || []);
    }
  }, [selectedEventForAnalytics, eventAnalyticsData, eventUsersData]);

  const getFilteredConversations = () => {
    return conversations.filter(conv => {
      const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           conv.eventType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || conv.projectStatus === filterStatus;
      const matchesPriority = filterPriority === "all" || conv.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  };

  // Event listing helper functions
  const getFilteredEvents = () => {
    return eventListings.filter(event => {
      const matchesSearch = event.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.eventOwner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           event.eventType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || event.status === filterStatus;
      const matchesPriority = filterPriority === "all" || event.priority === filterPriority;
      const matchesEventFilter = eventFilter === "all" || 
                                (eventFilter === "created-by-me" && event.createdBy === "photographer") ||
                                (eventFilter === "user-initiated" && event.createdBy === "user");
      
      return matchesSearch && matchesStatus && matchesPriority && matchesEventFilter;
    });
  };

  const addTeamMemberToEvent = (eventId: string, creatorId: string) => {
    setEventListings(prev => prev.map(event => {
      if (event.id === eventId) {
        const updatedMembers = [...event.assignedTeamMembers];
        if (!updatedMembers.includes(creatorId)) {
          updatedMembers.push(creatorId);
        }
        return { ...event, assignedTeamMembers: updatedMembers };
      }
      return event;
    }));
    
    const creator = availableCreators.find(c => c.id === creatorId);
    if (creator) {
      toast({
        title: "Team Member Added",
        description: `${creator.name} has been added to the event team.`
      });
    }
  };

  const removeTeamMemberFromEvent = (eventId: string, creatorId: string) => {
    setEventListings(prev => prev.map(event => {
      if (event.id === eventId) {
        return { 
          ...event, 
          assignedTeamMembers: event.assignedTeamMembers.filter(id => id !== creatorId)
        };
      }
      return event;
    }));
    
    toast({
      title: "Team Member Removed",
      description: "Team member has been removed from the event."
    });
  };

  const createNewEvent = (eventData: any) => {
    const newEvent = {
      id: `event-${Date.now()}`,
      eventName: eventData.eventName,
      eventType: eventData.eventType,
      eventOwner: eventData.clientName,
      eventOwnerRole: "Client",
      eventOwnerEmail: eventData.clientEmail,
      eventOwnerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      createdBy: "photographer",
      createdAt: new Date().toISOString().split('T')[0],
      eventDate: eventData.eventDate,
      eventTime: eventData.eventTime,
      location: eventData.location,
      status: "pending",
      priority: "medium",
      budget: `$${eventData.budget}`,
      packageType: eventData.packageType || "Custom",
      assignedTeamMembers: eventData.assignedMembers || [],
      conversationId: `conv-${Date.now()}`,
      hasChat: true,
      galleryPhotos: 0,
      approvedPhotos: 0,
      unreadMessages: 0,
      lastActivity: "now"
    };
    
    setEventListings(prev => [newEvent, ...prev]);
    setSelectedEvent(newEvent);
    
    // Create corresponding conversation
    const newConversation = {
      id: newEvent.conversationId,
      name: eventData.clientName,
      role: "Client",
      avatar: newEvent.eventOwnerAvatar,
      lastMessage: `Event created: ${eventData.eventName}`,
      timestamp: "now",
      unreadCount: 0,
      isOnline: false,
      bookingId: newEvent.id,
      eventType: eventData.eventType,
      projectStatus: "pending",
      priority: "medium",
      eventDate: eventData.eventDate,
      deadline: eventData.eventDate,
      messageType: "text"
    };
    
    setConversations(prev => [newConversation, ...prev]);
    
    return newEvent;
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
    <div className="h-full bg-background flex">
      {/* Enhanced Conversation List */}
              <div className="w-96 border-r border-border bg-card">
                <div className="p-4 border-b border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Quick Access</h2>
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
                  
                  {/* Quick Filters */}
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
                  
                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      onClick={() => setShowCreateEventDialog(true)} 
                      variant="outline" 
                      size="sm"
                      className="justify-start"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Event
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('events')} 
                      variant="outline" 
                      size="sm"
                      className="justify-start"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      View All Events
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('messages')} 
                      variant="outline" 
                      size="sm"
                      className="justify-start"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat Center
                    </Button>
                  </div>
                </div>

                {/* Event Listings */}
                <div className="overflow-y-auto">
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Event Listings</h3>
                  </div>
                  {getFilteredEvents().slice(0, 10).map((event) => (
                    <div
                      key={event.id}
                      onClick={() => {
                        setSelectedEvent(event);
                        setActiveTab('events');
                      }}
                      className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 ${
                        selectedEvent?.id === event.id ? "bg-muted" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={event.eventOwnerAvatar}
                            alt={event.eventOwner}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            event.createdBy === 'photographer' ? 'bg-blue-500' : 'bg-green-500'
                          }`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{event.eventName}</p>
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${getPriorityColor(event.priority)}`}></div>
                              {event.unreadMessages > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {event.unreadMessages}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">{event.eventOwner}</p>
                            <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                              {event.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{event.lastActivity}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {event.eventDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Show More Button if there are more events */}
                  {getFilteredEvents().length > 10 && (
                    <div className="p-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setActiveTab('events')}
                        className="w-full justify-center"
                      >
                        View All {getFilteredEvents().length} Events
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>


      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full w-full flex flex-col">
        {/* Header with New Event Button */}
        <div className="border-b border-border px-6 py-4 bg-card">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Work Conversations</h1>
            
          </div>
          
          <TabsList className="grid w-full grid-cols-9 max-w-6xl">
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
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
              <Info className="h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="invoice" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Invoice
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="user" className="flex items-center gap-2">
              <Users2 className="h-4 w-4" />
              User
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          {/* Events Tab - Primary Tab for Event Listings */}
          <TabsContent value="events" className="h-full m-0">
            <div className="h-full flex flex-col">
              {/* Event Filters and Search */}
              <div className="p-6 border-b border-border bg-card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold">Event Listings</h2>
                    <Badge variant="secondary">{getFilteredEvents().length} Events</Badge>
                  </div>
                  <Button onClick={() => setShowCreateEventDialog(true)} className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </div>
                
                {/* Search and Filters */}
                <div className="flex gap-4 items-center">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search events, clients, or event types..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter events" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="created-by-me">Created by Me</SelectItem>
                      <SelectItem value="user-initiated">User Initiated</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by priority" />
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
              
              {/* Event Listings Grid */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="grid gap-6">
                  {getFilteredEvents().map((event) => (
                    <Card key={event.id} className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedEvent?.id === event.id ? 'ring-2 ring-primary' : ''
                    }`} onClick={() => setSelectedEvent(event)}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            {/* Event Owner Avatar */}
                            <div className="relative">
                              <img
                                src={event.eventOwnerAvatar}
                                alt={event.eventOwner}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-xs ${
                                event.createdBy === 'photographer' ? 'bg-blue-500' : 'bg-green-500'
                              }`}>
                                {event.createdBy === 'photographer' ? <Camera className="h-2 w-2 text-white" /> : <Users className="h-2 w-2 text-white" />}
                              </div>
                            </div>
                            
                            {/* Event Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-foreground">{event.eventName}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <p className="text-muted-foreground">{event.eventOwner}</p>
                                    <Badge variant="outline" className="text-xs">{event.eventOwnerRole}</Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {event.createdBy === 'photographer' ? 'Created by Me' : 'User Initiated'}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(event.priority)}`}></div>
                                  <Badge className={`${getStatusColor(event.status)}`}>
                                    {event.status}
                                  </Badge>
                                </div>
                              </div>
                              
                              {/* Event Info */}
                              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span>{event.eventDate} • {event.eventTime}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span className="truncate">{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                                  <span>{event.budget} • {event.packageType}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>Last activity: {event.lastActivity}</span>
                                </div>
                              </div>
                              
                              {/* Quick Stats */}
                              <div className="flex items-center gap-6 mt-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Images className="h-4 w-4 text-muted-foreground" />
                                  <span>{event.galleryPhotos} Photos</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                  <span>Chat {event.hasChat ? 'Active' : 'Inactive'}</span>
                                  {event.unreadMessages > 0 && (
                                    <Badge variant="destructive" className="text-xs">
                                      {event.unreadMessages}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span>{event.assignedTeamMembers.length} Team Members</span>
                                </div>
                              </div>
                              
                              {/* Team Members Preview */}
                              {event.assignedTeamMembers.length > 0 && (
                                <div className="flex items-center gap-2 mt-3">
                                  <span className="text-sm text-muted-foreground">Team:</span>
                                  <div className="flex -space-x-2">
                                    {event.assignedTeamMembers.slice(0, 3).map((memberId) => {
                                      const creator = availableCreators.find(c => c.id === memberId);
                                      return creator ? (
                                        <img
                                          key={memberId}
                                          src={creator.avatar}
                                          alt={creator.name}
                                          className="w-6 h-6 rounded-full border-2 border-white"
                                          title={creator.name}
                                        />
                                      ) : null;
                                    })}
                                    {event.assignedTeamMembers.length > 3 && (
                                      <div className="w-6 h-6 rounded-full bg-muted border-2 border-white flex items-center justify-center text-xs font-medium">
                                        +{event.assignedTeamMembers.length - 3}
                                      </div>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedEvent(event);
                                      setShowAddTeamMemberDialog(true);
                                    }}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                              
                              {/* Action Buttons */}
                              <div className="flex items-center gap-2 mt-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTab('messages');
                                    const conversation = conversations.find(c => c.id === event.conversationId);
                                    if (conversation) setSelectedConversation(conversation);
                                  }}
                                >
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  Chat
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTab('gallery');
                                  }}
                                >
                                  <Images className="h-4 w-4 mr-1" />
                                  Gallery
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEvent(event);
                                    setShowAddTeamMemberDialog(true);
                                  }}
                                >
                                  <Users className="h-4 w-4 mr-1" />
                                  Team
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className='bg-white dark:bg-secondary' align="end">
                                    <DropdownMenuItem onClick={() => {
                                      setSelectedEvent(event);
                                      setShowEventDetailsDialog(true);
                                    }}>
                                      <Calendar className="h-4 w-4 mr-2" />
                                      Event Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setActiveTab('invoice')}>
                                      <Receipt className="h-4 w-4 mr-2" />
                                      Invoice
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Event
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {getFilteredEvents().length === 0 && (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
                        <p className="text-muted-foreground mb-4">
                          {searchQuery || eventFilter !== 'all' || filterStatus !== 'all' || filterPriority !== 'all'
                            ? 'No events match your current filters. Try adjusting your search criteria.'
                            : 'You haven\'t created any events yet. Start by creating your first event.'
                          }
                        </p>
                        <Button onClick={() => setShowCreateEventDialog(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Your First Event
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="h-full m-0">
            <div className="flex h-full">
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
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowInviteUserDialog(true)}
                            title="Invite user to platform"
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
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
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // Generate shareable link
                      const shareUrl = `${window.location.origin}/gallery/shared`;
                      navigator.clipboard.writeText(shareUrl).then(() => {
                        toast({
                          title: "Gallery Link Copied!",
                          description: "Share link has been copied to clipboard."
                        });
                      }).catch(() => {
                        toast({
                          title: "Share Gallery",
                          description: "Gallery link: " + shareUrl,
                          variant: "default"
                        });
                      });
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Gallery
                  </Button>
                  <Button onClick={() => setShowUploadDialog(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photos
                  </Button>
                </div>
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
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {event.photos.map((photo, index) => (
                          <div key={photo.id} className="relative group cursor-pointer">
                            <img
                              src={photo.url}
                              alt="Event photo"
                              className="w-full h-32 object-cover rounded-lg transition-transform group-hover:scale-105"
                              onClick={() => {
                                setCurrentEventPhotos(event.photos);
                                setCurrentPhotoIndex(index);
                                setShowLightbox(true);
                              }}
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <div className="text-white text-center">
                                <Eye className="h-6 w-6 mx-auto mb-2" />
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
                      
                      {/* Show more photos button if there are many photos */}
                      {event.photos.length > 12 && (
                        <div className="text-center mt-4">
                          <Button variant="outline">
                            <Images className="h-4 w-4 mr-2" />
                            View All {event.photos.length} Photos
                          </Button>
                        </div>
                      )}
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
                {/* <Card>
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
                </Card> */}

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

          {/* User Tab - Analytics Dashboard */}
          <TabsContent value="user" className="h-full m-0 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    Last updated: {new Date().toLocaleDateString()}
                  </Badge>
                </div>
              </div>

              {/* Event Selection for Detailed Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Analytics</CardTitle>
                  <CardDescription>
                    Select an event to view detailed analytics and user data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedEventForAnalytics} onValueChange={setSelectedEventForAnalytics}>
                    <SelectTrigger className="w-full md:w-96">
                      <SelectValue placeholder="Select an event to analyze" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventListings.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.eventName} - {event.eventDate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{eventListings.length}</div>
                    <p className="text-xs text-muted-foreground">
                      +{eventListings.filter(e => e.status === 'active').length} active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Event Registrations</CardTitle>
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {eventListings.reduce((sum, e) => sum + (e.createdBy === 'user' ? 1 : 0), 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      User-initiated events
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {new Set(eventListings.map(e => e.eventOwner)).size}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Unique clients served
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Photos Managed</CardTitle>
                    <Images className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {eventListings.reduce((sum, e) => sum + e.galleryPhotos, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {eventListings.reduce((sum, e) => sum + e.approvedPhotos, 0)} approved
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Photo Status</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round((eventListings.reduce((sum, e) => sum + e.approvedPhotos, 0) / 
                        Math.max(eventListings.reduce((sum, e) => sum + e.galleryPhotos, 0), 1)) * 100)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Approval rate
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${eventListings.reduce((sum, e) => sum + parseInt(e.budget.replace('$', '').replace(',', '')), 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total project value
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Face Search Users</CardTitle>
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {eventListings.filter(e => e.eventType.toLowerCase().includes('face') || e.eventType.toLowerCase().includes('search')).length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Users registered for face search
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Event Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Status Distribution</CardTitle>
                    <CardDescription>Current status of all events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['active', 'pending', 'completed'].map(status => {
                        const count = eventListings.filter(e => e.status === status).length;
                        const percentage = (count / eventListings.length) * 100;
                        return (
                          <div key={status} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${
                                status === 'active' ? 'bg-green-500' :
                                status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                              }`}></div>
                              <span className="text-sm capitalize">{status}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-muted rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    status === 'active' ? 'bg-green-500' :
                                    status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium w-8">{count}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Priority Distribution</CardTitle>
                    <CardDescription>Events by priority level</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['high', 'medium', 'low'].map(priority => {
                        const count = eventListings.filter(e => e.priority === priority).length;
                        const percentage = (count / eventListings.length) * 100;
                        return (
                          <div key={priority} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${
                                priority === 'high' ? 'bg-red-500' :
                                priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}></div>
                              <span className="text-sm capitalize">{priority}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-muted rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    priority === 'high' ? 'bg-red-500' :
                                    priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium w-8">{count}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Photo Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Photo Status Distribution</CardTitle>
                  <CardDescription>Detailed breakdown of photo statuses across all events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Uploaded Photos */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Uploaded Photos</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {eventListings.reduce((sum, e) => sum + e.galleryPhotos, 0)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Total photos uploaded by clients
                      </p>
                    </div>

                    {/* Approved Photos */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Approved Photos</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {eventListings.reduce((sum, e) => sum + e.approvedPhotos, 0)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Photos approved for delivery
                      </p>
                    </div>

                    {/* Pending Photos */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">Pending Review</span>
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {eventListings.reduce((sum, e) => sum + e.galleryPhotos - e.approvedPhotos, 0)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Photos awaiting approval
                      </p>
                    </div>
                  </div>

                  {/* Approval Progress Bar */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Approval Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round((eventListings.reduce((sum, e) => sum + e.approvedPhotos, 0) / 
                          Math.max(eventListings.reduce((sum, e) => sum + e.galleryPhotos, 0), 1)) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.round((eventListings.reduce((sum, e) => sum + e.approvedPhotos, 0) / 
                            Math.max(eventListings.reduce((sum, e) => sum + e.galleryPhotos, 0), 1)) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Registration & Photo Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Registration Trends</CardTitle>
                    <CardDescription>Event registrations by source</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <div>
                            <p className="font-medium">User-Initiated Events</p>
                            <p className="text-sm text-muted-foreground">Client registrations</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {eventListings.filter(e => e.createdBy === 'user').length}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round((eventListings.filter(e => e.createdBy === 'user').length / eventListings.length) * 100)}% of total
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <div>
                            <p className="font-medium">Photographer-Created</p>
                            <p className="text-sm text-muted-foreground">Direct bookings</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {eventListings.filter(e => e.createdBy === 'photographer').length}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round((eventListings.filter(e => e.createdBy === 'photographer').length / eventListings.length) * 100)}% of total
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Conversion Rate</span>
                          <span className="font-medium">
                            {eventListings.length > 0 ? 
                              Math.round((eventListings.filter(e => e.status === 'completed').length / eventListings.length) * 100) : 0
                            }%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Photo Upload Patterns</CardTitle>
                    <CardDescription>Photo statistics by event type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(
                        eventListings.reduce((acc, event) => {
                          if (!acc[event.eventType]) {
                            acc[event.eventType] = { photos: 0, approved: 0, events: 0 };
                          }
                          acc[event.eventType].photos += event.galleryPhotos;
                          acc[event.eventType].approved += event.approvedPhotos;
                          acc[event.eventType].events += 1;
                          return acc;
                        }, {} as Record<string, { photos: number; approved: number; events: number }>)
                      ).map(([type, stats]) => (
                        <div key={type} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{type}</span>
                            <Badge variant="outline">{stats.events} events</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Photos</p>
                              <p className="font-semibold">{stats.photos}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Approved</p>
                              <p className="font-semibold text-green-600">
                                {stats.approved} ({stats.photos > 0 ? Math.round((stats.approved / stats.photos) * 100) : 0}%)
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Event Analytics - Only show when event is selected */}
              {selectedEventForAnalytics && eventAnalytics && (
                <>
                  {/* Event-Specific Analytics Header */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Detailed Analytics for {eventListings.find(e => e.id === selectedEventForAnalytics)?.eventName}
                      </CardTitle>
                      <CardDescription>
                        Comprehensive analytics for the selected event
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  {/* Event-Specific Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Event Registrations</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{eventAnalytics.totalRegistrations}</div>
                        <p className="text-xs text-muted-foreground">
                          Users registered for this event
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Photos Uploaded</CardTitle>
                        <Images className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{eventAnalytics.totalPhotosUploaded}</div>
                        <p className="text-xs text-muted-foreground">
                          Photos uploaded by users
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Matches Found</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{eventAnalytics.totalMatchesFound}</div>
                        <p className="text-xs text-muted-foreground">
                          Face matches identified
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Match Confidence</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{eventAnalytics.averageMatchConfidence}%</div>
                        <p className="text-xs text-muted-foreground">
                          Average confidence score
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Demographics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Age Distribution</CardTitle>
                        <CardDescription>User demographics by age group</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(eventAnalytics.userDemographics.ageGroups).map(([age, count]: [string, any]) => (
                            <div key={age} className="flex items-center justify-between">
                              <span className="text-sm">{age} years</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-muted rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{
                                      width: `${(count / eventAnalytics.totalRegistrations) * 100}%`
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-medium w-8">{count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Gender Distribution</CardTitle>
                        <CardDescription>User demographics by gender</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(eventAnalytics.userDemographics.genderDistribution).map(([gender, count]: [string, any]) => (
                            <div key={gender} className="flex items-center justify-between">
                              <span className="text-sm capitalize">{gender}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-muted rounded-full h-2">
                                  <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{
                                      width: `${(count / eventAnalytics.totalRegistrations) * 100}%`
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-medium w-8">{count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Popular Tags */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Popular Tags</CardTitle>
                      <CardDescription>Most used tags in event photos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {eventAnalytics.popularTags.map((tagData: any) => (
                          <Badge key={tagData.tag} variant="secondary" className="px-3 py-1">
                            {tagData.tag} ({tagData.count})
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Engagement Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Photos Downloaded</CardTitle>
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{eventAnalytics.engagementMetrics.photosDownloaded}</div>
                        <p className="text-xs text-muted-foreground">
                          Photos downloaded by users
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Photos Shared</CardTitle>
                        <Share2 className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{eventAnalytics.engagementMetrics.photosShared}</div>
                        <p className="text-xs text-muted-foreground">
                          Photos shared on social media
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Favorites Marked</CardTitle>
                        <Heart className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{eventAnalytics.engagementMetrics.favoritesMarked}</div>
                        <p className="text-xs text-muted-foreground">
                          Photos marked as favorite
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Session Time</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{eventAnalytics.engagementMetrics.averageSessionTime}</div>
                        <p className="text-xs text-muted-foreground">
                          Average time spent per user
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Registration Trends */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Registration Trends</CardTitle>
                      <CardDescription>Daily registration count over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {eventAnalytics.registrationTrends.map((trend: any, index: number) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">
                              {new Date(trend.date).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{
                                    width: `${(trend.count / Math.max(...eventAnalytics.registrationTrends.map((t: any) => t.count))) * 100}%`
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium w-8">{trend.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Registered Users List */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Registered Users</CardTitle>
                      <CardDescription>
                        {eventUsers.length} users registered for this event
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {eventUsers.map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-1">
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {user.whatsappNumber} • {user.phoneNumber}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Registered: {new Date(user.registrationDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right space-y-1">
                              <Badge variant={user.status === 'completed' ? 'default' : 'secondary'}>
                                {user.status}
                              </Badge>
                              <p className="text-sm">
                                {user.photosUploaded} photos • {user.matchesFound} matches
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Last active: {new Date(user.lastActivity).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Team Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Team Performance</CardTitle>
                  <CardDescription>Overview of team member assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Status:</span>
                            <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                              {member.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Rate:</span>
                            <span className="font-medium">{member.hourlyRate}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Availability:</span>
                            <span className={`font-medium ${
                              member.availability === 'full-time' ? 'text-green-600' :
                              member.availability === 'part-time' ? 'text-yellow-600' : 'text-blue-600'
                            }`}>
                              {member.availability}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Event Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Types</CardTitle>
                  <CardDescription>Distribution of event types handled</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      eventListings.reduce((acc, event) => {
                        acc[event.eventType] = (acc[event.eventType] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([type, count]) => {
                      const percentage = (count / eventListings.length) * 100;
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <span className="text-sm">{type}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-8">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
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
                  {/* <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span className="font-semibold">$0.00</span>
                  </div> */}
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

      {/* Create Event Dialog */}
      <Dialog open={showCreateEventDialog} onOpenChange={setShowCreateEventDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Create New Event
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Event Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Event Name *</Label>
                <Input 
                  placeholder="e.g., Sarah & John Wedding" 
                  value={createEventForm.eventName}
                  onChange={(e) => setCreateEventForm(prev => ({ ...prev, eventName: e.target.value }))}
                />
              </div>
              <div>
                <Label>Event Type *</Label>
                <Select 
                  value={createEventForm.eventType} 
                  onValueChange={(value) => setCreateEventForm(prev => ({ ...prev, eventType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wedding">Wedding Photography</SelectItem>
                    <SelectItem value="engagement">Engagement Session</SelectItem>
                    <SelectItem value="portrait">Portrait Session</SelectItem>
                    <SelectItem value="corporate">Corporate Event</SelectItem>
                    <SelectItem value="family">Family Photography</SelectItem>
                    <SelectItem value="birthday">Birthday Party</SelectItem>
                    <SelectItem value="graduation">Graduation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Client Name *</Label>
                <Input 
                  placeholder="Enter client name" 
                  value={createEventForm.clientName}
                  onChange={(e) => setCreateEventForm(prev => ({ ...prev, clientName: e.target.value }))}
                />
              </div>
              <div>
                <Label>Client Email *</Label>
                <Input 
                  type="email" 
                  placeholder="client@example.com" 
                  value={createEventForm.clientEmail}
                  onChange={(e) => setCreateEventForm(prev => ({ ...prev, clientEmail: e.target.value }))}
                />
              </div>
              <div>
                <Label>Event Date *</Label>
                <Input 
                  type="date" 
                  value={createEventForm.eventDate}
                  onChange={(e) => setCreateEventForm(prev => ({ ...prev, eventDate: e.target.value }))}
                />
              </div>
              <div>
                <Label>Event Time *</Label>
                <Input 
                  type="time" 
                  value={createEventForm.eventTime}
                  onChange={(e) => setCreateEventForm(prev => ({ ...prev, eventTime: e.target.value }))}
                />
              </div>
            </div>

            {/* Location & Venue Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location & Venue</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Event Location *</Label>
                  <Input 
                    placeholder="e.g., Central Park Conservatory Garden, NYC" 
                    value={createEventForm.location}
                    onChange={(e) => setCreateEventForm(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Venue Name</Label>
                  <Input placeholder="e.g., Conservatory Garden" />
                </div>
                <div>
                  <Label>Venue Contact</Label>
                  <Input placeholder="e.g., +1 (212) 310-6600" />
                </div>
                <div className="md:col-span-2">
                  <Label>Venue Address</Label>
                  <Input 
                    placeholder="Full venue address" 
                    value={createEventForm.venueAddress}
                    onChange={(e) => setCreateEventForm(prev => ({ ...prev, venueAddress: e.target.value }))}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Venue Notes</Label>
                  <Textarea placeholder="Any special notes about the venue (permits, restrictions, etc.)" rows={2} />
                </div>
              </div>
            </div>

            {/* Budget & Package */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Budget & Package</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Total Budget *</Label>
                  <Input 
                    type="number" 
                    placeholder="2500" 
                    value={createEventForm.budget}
                    onChange={(e) => setCreateEventForm(prev => ({ ...prev, budget: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Package Type</Label>
                  <Select 
                    value={createEventForm.packageType} 
                    onValueChange={(value) => setCreateEventForm(prev => ({ ...prev, packageType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select package" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Package</SelectItem>
                      <SelectItem value="standard">Standard Package</SelectItem>
                      <SelectItem value="premium">Premium Package</SelectItem>
                      <SelectItem value="custom">Custom Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Payment Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="deposit-paid">Deposit Paid</SelectItem>
                      <SelectItem value="paid">Fully Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Team Member Assignment */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Assign Team Members</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                    <div className="flex items-center space-x-3 mb-3">
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary"
                        checked={createEventForm.assignedMembers.includes(member.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCreateEventForm(prev => ({
                              ...prev,
                              assignedMembers: [...prev.assignedMembers, member.id]
                            }));
                          } else {
                            setCreateEventForm(prev => ({
                              ...prev,
                              assignedMembers: prev.assignedMembers.filter(id => id !== member.id)
                            }));
                          }
                        }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>Specialties: {member.specialties.join(', ')}</p>
                      <p>Availability: {member.availability}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements & Deliverables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Requirements</Label>
                <Textarea 
                  placeholder="List event requirements (one per line)&#10;e.g.,&#10;2 photographers required&#10;No flash during ceremony&#10;Backup equipment needed"
                  rows={4}
                />
              </div>
              <div>
                <Label>Deliverables</Label>
                <Textarea 
                  placeholder="List deliverables (one per line)&#10;e.g.,&#10;500+ edited photos&#10;Online gallery&#10;USB with full resolution&#10;Wedding album"
                  rows={4}
                />
              </div>
            </div>

            {/* Special Notes */}
            <div>
              <Label>Special Notes</Label>
              <Textarea 
                placeholder="Any special instructions, client preferences, or important notes for the event..."
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowCreateEventDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Validate required fields
                if (!createEventForm.eventName.trim()) {
                  toast({
                    title: "Validation Error",
                    description: "Event name is required.",
                    variant: "destructive"
                  });
                  return;
                }
                
                if (!createEventForm.clientName.trim()) {
                  toast({
                    title: "Validation Error",
                    description: "Client name is required.",
                    variant: "destructive"
                  });
                  return;
                }
                
                if (!createEventForm.clientEmail.trim()) {
                  toast({
                    title: "Validation Error",
                    description: "Client email is required.",
                    variant: "destructive"
                  });
                  return;
                }
                
                if (!createEventForm.eventDate.trim()) {
                  toast({
                    title: "Validation Error",
                    description: "Event date is required.",
                    variant: "destructive"
                  });
                  return;
                }
                
                // Use actual form data from createEventForm state
                const eventData = {
                  eventName: createEventForm.eventName.trim(),
                  eventType: createEventForm.eventType || "Other",
                  clientName: createEventForm.clientName.trim(),
                  clientEmail: createEventForm.clientEmail.trim(),
                  eventDate: createEventForm.eventDate,
                  eventTime: createEventForm.eventTime || "TBD",
                  location: createEventForm.location.trim() || "TBD",
                  budget: createEventForm.budget || "0",
                  packageType: createEventForm.packageType || "Custom Package",
                  assignedMembers: createEventForm.assignedMembers
                };
                
                createNewEvent(eventData);
                setActiveTab('events'); // Switch to events tab to show the new event
                toast({
                  title: "Event Created",
                  description: `Event "${eventData.eventName}" has been created successfully for ${eventData.clientName}.`
                });
                
                // Reset form and close dialog
                setCreateEventForm({
                  eventName: "",
                  eventType: "",
                  clientName: "",
                  clientEmail: "",
                  eventDate: "",
                  eventTime: "",
                  location: "",
                  venueAddress: "",
                  budget: "",
                  packageType: "",
                  assignedMembers: []
                });
                setShowCreateEventDialog(false);
              }}>
                Create Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Details Dialog */}
      <Dialog open={showEventDetailsDialog} onOpenChange={setShowEventDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Event Details: {selectedEvent?.eventName}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-6">
              {/* Event Header */}
              <div className="flex items-start justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-4">
                  <img
                    src={selectedEvent.eventOwnerAvatar}
                    alt={selectedEvent.eventOwner}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedEvent.eventName}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{selectedEvent.eventType}</Badge>
                      <Badge className={getStatusColor(selectedEvent.status)}>{selectedEvent.status}</Badge>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(selectedEvent.priority)}`}></div>
                      <span className="text-sm capitalize">{selectedEvent.priority} priority</span>
                    </div>
                    <p className="text-muted-foreground mt-1">
                      {selectedEvent.eventOwner} ({selectedEvent.eventOwnerRole}) • {selectedEvent.eventOwnerEmail}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-sm">
                  {selectedEvent.createdBy === 'photographer' ? 'Created by Me' : 'User Initiated'}
                </Badge>
              </div>
              
              {/* Key Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Date & Time</span>
                    </div>
                    <p className="text-sm">{selectedEvent.eventDate}</p>
                    <p className="text-sm text-muted-foreground">{selectedEvent.eventTime}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Location</span>
                    </div>
                    <p className="text-sm">{selectedEvent.location}</p>
                  </CardContent>
                </Card>
                
                {/* <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Budget</span>
                    </div>
                    <p className="text-sm font-semibold">{selectedEvent.budget}</p>
                    <p className="text-sm text-muted-foreground">{selectedEvent.packageType}</p>
                  </CardContent>
                </Card> */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Images className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Gallery Progress</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Photos Uploaded:</span>
                        <span className="font-medium">{selectedEvent.galleryPhotos}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Approved Photos:</span>
                        <span className="font-medium">{selectedEvent.approvedPhotos}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Images className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Gallery Progress</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Photos Uploaded:</span>
                        <span className="font-medium">{selectedEvent.galleryPhotos}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Approved Photos:</span>
                        <span className="font-medium">{selectedEvent.approvedPhotos}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Communication</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Chat Status:</span>
                        <span className={`font-medium ${selectedEvent.hasChat ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedEvent.hasChat ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Unread Messages:</span>
                        <span className="font-medium">{selectedEvent.unreadMessages}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Team</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Assigned Members:</span>
                        <span className="font-medium">{selectedEvent.assignedTeamMembers.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Last Activity:</span>
                        <span className="font-medium">{selectedEvent.lastActivity}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Team Members */}
              {selectedEvent.assignedTeamMembers.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Assigned Team Members</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedEvent.assignedTeamMembers.map((memberId) => {
                      const creator = availableCreators.find(c => c.id === memberId);
                      return creator ? (
                        <div key={memberId} className="flex items-center gap-3 p-3 border rounded-lg">
                          <img
                            src={creator.avatar}
                            alt={creator.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{creator.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {creator.type} • {creator.hourlyRate} • {creator.availability}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-sm">{creator.rating}</span>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <Button
                  onClick={() => {
                    setActiveTab('messages');
                    const conversation = conversations.find(c => c.id === selectedEvent.conversationId);
                    if (conversation) setSelectedConversation(conversation);
                    setShowEventDetailsDialog(false);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Open Chat
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveTab('gallery');
                    setShowEventDetailsDialog(false);
                  }}
                >
                  <Images className="h-4 w-4 mr-2" />
                  View Gallery
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddTeamMemberDialog(true);
                    setShowEventDetailsDialog(false);
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Team
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveTab('invoice');
                    setShowEventDetailsDialog(false);
                  }}
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  View Invoice
                </Button>
              </div>
              
              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setShowEventDetailsDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Team Member to Event Dialog */}
      <Dialog open={showAddTeamMemberDialog} onOpenChange={setShowAddTeamMemberDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Add Team Members to {selectedEvent?.eventName}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-6">
              {/* Selected Event Info */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedEvent.eventOwnerAvatar}
                    alt={selectedEvent.eventOwner}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{selectedEvent.eventName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedEvent.eventOwner} • {selectedEvent.eventDate} • {selectedEvent.location}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Current Team Members */}
              {selectedEvent.assignedTeamMembers.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Current Team Members</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedEvent.assignedTeamMembers.map((memberId) => {
                      const creator = availableCreators.find(c => c.id === memberId);
                      return creator ? (
                        <div key={memberId} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <img
                              src={creator.avatar}
                              alt={creator.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="font-medium">{creator.name}</p>
                              <p className="text-sm text-muted-foreground">{creator.type} • {creator.hourlyRate}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTeamMemberFromEvent(selectedEvent.id, memberId)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
              
              {/* Available Team Members */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Available Photographers & Videographers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableCreators
                    .filter(creator => !selectedEvent.assignedTeamMembers.includes(creator.id))
                    .map((creator) => (
                    <div key={creator.id} className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold">{creator.name}</h4>
                              <p className="text-sm text-muted-foreground capitalize">{creator.type}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                creator.availability === 'available' ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                              <span className="text-xs text-muted-foreground capitalize">{creator.availability}</span>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span>{creator.rating}</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-muted-foreground">{creator.location}</span>
                            </div>
                            <p className="text-sm font-medium text-primary mt-1">{creator.hourlyRate}</p>
                          </div>
                          
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">Specialties:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {creator.specialties.map((specialty, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <Button
                            onClick={() => {
                              addTeamMemberToEvent(selectedEvent.id, creator.id);
                            }}
                            disabled={creator.availability === 'busy'}
                            className="w-full mt-3"
                            size="sm"
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            {creator.availability === 'busy' ? 'Currently Busy' : 'Add to Team'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {availableCreators.filter(creator => !selectedEvent.assignedTeamMembers.includes(creator.id)).length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">All Available Members Added</h3>
                    <p className="text-muted-foreground">
                      All available photographers and videographers have been added to this event.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowAddTeamMemberDialog(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  toast({
                    title: "Team Updated",
                    description: "Team member assignments have been updated for this event."
                  });
                  setShowAddTeamMemberDialog(false);
                }}>
                  <Settings className="h-4 w-4 mr-2" />
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Invite User Dialog */}
      <Dialog open={showInviteUserDialog} onOpenChange={setShowInviteUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Invite User to Platform
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>User Name *</Label>
              <Input placeholder="Enter user's full name" />
            </div>
            <div>
              <Label>Email Address *</Label>
              <Input type="email" placeholder="user@example.com" />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input type="tel" placeholder="+1 (555) 123-4567" />
            </div>
            <div>
              <Label>User Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="photographer">Photographer</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Invitation Message</Label>
              <Textarea 
                placeholder="Hi! I'd like to invite you to join our photography platform to collaborate on upcoming projects."
                rows={3}
              />
            </div>
            
            {/* Information Box */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">What happens next?</p>
                  <p className="text-blue-700 mt-1">
                    The user will receive an email invitation to join the platform. Once they register, 
                    a chat conversation will be automatically created and you'll be notified.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowInviteUserDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Invitation Sent!",
                  description: "The user has been invited to join the platform. They'll receive an email with instructions."
                });
                setShowInviteUserDialog(false);
              }}>
                Send Invitation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Photo Lightbox Dialog */}
      <Dialog open={showLightbox} onOpenChange={setShowLightbox}>
        <DialogContent className="max-w-6xl max-h-[95vh] p-0 bg-black/95">
          <div className="relative h-full">
            {currentEventPhotos.length > 0 && (
              <>
                {/* Main Photo */}
                <div className="flex items-center justify-center p-4 h-[80vh]">
                  <img
                    src={currentEventPhotos[currentPhotoIndex]?.fullUrl || currentEventPhotos[currentPhotoIndex]?.url}
                    alt="Event photo"
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>
                
                {/* Navigation Controls */}
                <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white"
                    onClick={() => {
                      const prevIndex = currentPhotoIndex > 0 ? currentPhotoIndex - 1 : currentEventPhotos.length - 1;
                      setCurrentPhotoIndex(prevIndex);
                    }}
                    disabled={currentEventPhotos.length <= 1}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                </div>
                
                <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white"
                    onClick={() => {
                      const nextIndex = currentPhotoIndex < currentEventPhotos.length - 1 ? currentPhotoIndex + 1 : 0;
                      setCurrentPhotoIndex(nextIndex);
                    }}
                    disabled={currentEventPhotos.length <= 1}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
                
                {/* Top Controls */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentPhotoIndex + 1} of {currentEventPhotos.length}
                    </div>
                    {currentEventPhotos[currentPhotoIndex]?.approved && (
                      <Badge className="bg-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approved
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-black/50 hover:bg-black/70 text-white"
                      onClick={() => {
                        const photo = currentEventPhotos[currentPhotoIndex];
                        const shareUrl = photo.fullUrl || photo.url;
                        
                        if (navigator.share) {
                          navigator.share({
                            title: 'Event Photo',
                            text: 'Check out this amazing photo!',
                            url: shareUrl
                          }).catch(console.error);
                        } else {
                          navigator.clipboard.writeText(shareUrl).then(() => {
                            toast({
                              title: "Photo Link Copied!",
                              description: "Photo link has been copied to clipboard."
                            });
                          }).catch(() => {
                            toast({
                              title: "Share Photo",
                              description: "Photo URL: " + shareUrl,
                              variant: "default"
                            });
                          });
                        }
                      }}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-black/50 hover:bg-black/70 text-white"
                      onClick={() => {
                        const photo = currentEventPhotos[currentPhotoIndex];
                        const link = document.createElement('a');
                        link.href = photo.fullUrl || photo.url;
                        link.download = `event-photo-${photo.id}.jpg`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        toast({
                          title: "Photo Downloaded",
                          description: "Photo has been downloaded to your device."
                        });
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-black/50 hover:bg-black/70 text-white"
                      onClick={() => setShowLightbox(false)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Bottom Info */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/50 text-white p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < (currentEventPhotos[currentPhotoIndex]?.rating || 0) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-400'
                              }`}
                            />
                          ))}
                          <span className="text-sm ml-2">
                            {currentEventPhotos[currentPhotoIndex]?.rating || 0}/5
                          </span>
                        </div>
                        <p className="text-sm">{currentEventPhotos[currentPhotoIndex]?.userFeedback}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Keyboard Navigation Helper */}
                <div className="absolute bottom-4 right-4">
                  <div className="bg-black/30 text-white text-xs px-2 py-1 rounded">
                    Use ← → arrow keys to navigate
                  </div>
                </div>
              </>
            )}
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