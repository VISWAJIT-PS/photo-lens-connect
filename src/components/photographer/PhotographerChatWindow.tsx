import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Search, Send, Paperclip, Phone, Video, MoreVertical, Smile, ArrowLeft, MessageSquare, Images, Receipt, Lock, Award, CheckCircle, XCircle, Eye, Camera, Star, Upload, Package, Plus, Edit, Trash2 } from 'lucide-react';
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
      role: "Customer", 
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      lastMessage: "Perfect! I'll bring the backup camera as well.",
      timestamp: "2m ago",
      unreadCount: 0,
      isOnline: true,
      bookingId: "WED-2024-001",
      eventType: "Wedding Photography"
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

  const [messageInput, setMessageInput] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showPackageDialog, setShowPackageDialog] = useState(false);
  const { toast } = useToast();

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    
    toast({
      title: "Message sent",
      description: "Your message has been sent to the customer.",
    });
    setMessageInput("");
  };

  return (
    <div className="h-full bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="border-b border-border px-6 py-4">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Images className="h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Portfolio
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          {/* Messages Tab */}
          <TabsContent value="messages" className="h-full m-0">
            <div className="flex h-full">
              {/* Conversation List */}
              <div className="w-80 border-r border-border bg-card">
                <div className="p-4 border-b border-border">
                  <h2 className="text-lg font-semibold">Conversations</h2>
                </div>
                <div className="overflow-y-auto">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 ${
                        selectedConversation?.id === conv.id ? "bg-muted" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={conv.avatar}
                          alt={conv.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{conv.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{conv.eventType}</p>
                          <p className="text-xs text-muted-foreground">{conv.timestamp}</p>
                        </div>
                        {conv.isOnline && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                {selectedConversation && (
                  <>
                    <div className="p-4 border-b border-border bg-card">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={selectedConversation.avatar}
                            alt={selectedConversation.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-medium">{selectedConversation.name}</p>
                            <p className="text-sm text-muted-foreground">{selectedConversation.eventType}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Video className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto">
                      <div className="space-y-4">
                        <div className="flex justify-start">
                          <div className="max-w-xs lg:max-w-md px-4 py-2 bg-muted rounded-lg">
                            <p className="text-sm">Hi! I wanted to confirm the details for your wedding shoot next weekend.</p>
                            <p className="text-xs text-muted-foreground mt-1">10:30 AM</p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="max-w-xs lg:max-w-md px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                            <p className="text-sm">Perfect! I'll bring the backup camera as well.</p>
                            <p className="text-xs opacity-70 mt-1">10:35 AM</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t border-border">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Input
                          placeholder="Type your message..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1"
                        />
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

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="h-full m-0 p-6">
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
          <TabsContent value="portfolio" className="h-full m-0 p-6">
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
                          <DropdownMenuContent>
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