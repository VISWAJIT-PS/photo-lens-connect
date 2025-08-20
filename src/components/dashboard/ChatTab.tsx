import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Send, Paperclip, MapPin, Phone, Video, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock chat data
const conversations = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Wedding Photographer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    lastMessage: 'Perfect! I\'ll bring the backup camera as well.',
    timestamp: '2m ago',
    unread: 0,
    online: true,
    bookingId: 'WED-2024-001'
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Portrait Photographer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    lastMessage: 'The lighting setup looks great for tomorrow\'s shoot.',
    timestamp: '1h ago',
    unread: 2,
    online: false,
    bookingId: 'PORT-2024-002'
  },
  {
    id: '3',
    name: 'Camera Rental Co.',
    role: 'Equipment Rental',
    avatar: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100',
    lastMessage: 'Your equipment is ready for pickup.',
    timestamp: '3h ago',
    unread: 1,
    online: true,
    bookingId: 'RENT-2024-003'
  },
  {
    id: '4',
    name: 'Alex Rodriguez',
    role: 'Wedding Videographer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    lastMessage: 'I\'ve uploaded the highlight reel to your gallery.',
    timestamp: '1d ago',
    unread: 0,
    online: false,
    bookingId: 'VID-2024-004'
  }
];

const messages = [
  {
    id: '1',
    sender: 'Sarah Johnson',
    content: 'Hi! I wanted to confirm the details for your wedding shoot next weekend.',
    timestamp: '10:30 AM',
    isOwn: false
  },
  {
    id: '2',
    sender: 'You',
    content: 'Yes, absolutely! The ceremony starts at 2 PM at Central Park.',
    timestamp: '10:32 AM',
    isOwn: true
  },
  {
    id: '3',
    sender: 'Sarah Johnson',
    content: 'Perfect! I\'ll arrive at 1:30 PM to set up. Should I bring the backup camera as well?',
    timestamp: '10:33 AM',
    isOwn: false
  },
  {
    id: '4',
    sender: 'You',
    content: 'That would be great! Better to be prepared. Will you also capture the reception?',
    timestamp: '10:35 AM',
    isOwn: true
  },
  {
    id: '5',
    sender: 'Sarah Johnson',
    content: 'Absolutely! I\'ll stay until 9 PM as discussed. The golden hour shots will be beautiful.',
    timestamp: '10:36 AM',
    isOwn: false
  },
  {
    id: '6',
    sender: 'You',
    content: 'Amazing! Can\'t wait to see the photos. When should we expect the edited gallery?',
    timestamp: '10:38 AM',
    isOwn: true
  },
  {
    id: '7',
    sender: 'Sarah Johnson',
    content: 'I\'ll have the full gallery ready within 2 weeks. You\'ll get a preview within 48 hours!',
    timestamp: '10:40 AM',
    isOwn: false
  },
  {
    id: '8',
    sender: 'Sarah Johnson',
    content: 'Perfect! I\'ll bring the backup camera as well.',
    timestamp: '10:42 AM',
    isOwn: false
  }
];

export const ChatTab: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');

  const getFilteredConversations = () => {
    return conversations.filter(conv =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const sendMessage = () => {
    if (messageInput.trim()) {
      // Add message logic here
      setMessageInput('');
    }
  };

  const renderConversationList = () => (
    <div className="w-80 border-r border-border bg-card">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="h-full">
        <div className="space-y-1 p-2">
          {getFilteredConversations().map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={cn(
                "p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted",
                selectedConversation.id === conversation.id && "bg-primary/10 border border-primary/20"
              )}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback>{conversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  {conversation.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-success rounded-full border-2 border-card"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium truncate">{conversation.name}</h4>
                    <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-1">{conversation.role}</p>
                  
                  <p className="text-sm text-muted-foreground truncate mb-2">
                    {conversation.lastMessage}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {conversation.bookingId}
                    </Badge>
                    {conversation.unread > 0 && (
                      <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const renderChatArea = () => (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedConversation.avatar} />
                <AvatarFallback>
                  {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {selectedConversation.online && (
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-success rounded-full border-2 border-card"></div>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold">{selectedConversation.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedConversation.role}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline">{selectedConversation.bookingId}</Badge>
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
            <Button variant="outline" size="sm">
              <Video className="h-4 w-4 mr-1" />
              Video
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.isOwn ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                  message.isOwn
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <p className={cn(
                  "text-xs mt-1",
                  message.isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <MapPin className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={!messageInput.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex">
      {/* Mobile Layout */}
      <div className="lg:hidden w-full">
        {selectedConversation ? (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-border bg-card">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedConversation(null)}
                className="mb-2"
              >
                ← Back to Chats
              </Button>
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedConversation.avatar} />
                  <AvatarFallback>
                    {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm">{selectedConversation.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedConversation.role}</p>
                </div>
              </div>
            </div>
            {renderChatArea()}
          </div>
        ) : (
          <div>
            <div className="p-4 border-b border-border">
              <h2 className="text-xl font-bold mb-2">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-1 p-2">
              {getFilteredConversations().map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className="p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted"
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>{conversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium truncate">{conversation.name}</h4>
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{conversation.role}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex w-full">
        {renderConversationList()}
        {renderChatArea()}
      </div>
    </div>
  );
};