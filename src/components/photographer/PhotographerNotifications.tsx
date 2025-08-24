import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Bell, Check, Trash2, Settings, MessageSquare, Calendar, DollarSign, Star, Camera, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock notifications data
const initialNotifications = [
  {
    id: 1,
    title: "New Booking Request",
    message: "Emma Thompson requested a portrait session for Feb 20th at 3:00 PM",
    type: "booking",
    read: false,
    timestamp: "5 minutes ago",
    actionRequired: true
  },
  {
    id: 2,
    title: "Payment Received",
    message: "Payment of $1,200 received from Mike & Lisa Johnson for engagement photos",
    type: "payment",
    read: false,
    timestamp: "2 hours ago",
    actionRequired: false
  },
  {
    id: 3,
    title: "New Message",
    message: "Sarah Williams sent you a message about the wedding photos",
    type: "message",
    read: true,
    timestamp: "4 hours ago",
    actionRequired: false
  },
  {
    id: 4,
    title: "Review Received",
    message: "John & Sarah gave you a 5-star review for your wedding photography",
    type: "review",
    read: true,
    timestamp: "1 day ago",
    actionRequired: false
  },
  {
    id: 5,
    title: "Equipment Reminder",
    message: "Equipment rental for Canon EOS R5 is due for return tomorrow",
    type: "reminder",
    read: false,
    timestamp: "1 day ago",
    actionRequired: true
  }
];

const notificationSettings = {
  bookingRequests: true,
  messages: true,
  payments: true,
  reviews: true,
  reminders: true,
  marketing: false
};

interface NotificationPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PhotographerNotifications({ isOpen, onOpenChange }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [settings, setSettings] = useState(notificationSettings);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  // Debug log to check if component is receiving props
  React.useEffect(() => {
    console.log('PhotographerNotifications - isOpen:', isOpen);
  }, [isOpen]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-5 w-5 text-blue-600" />;
      case 'payment':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-600" />;
      case 'review':
        return <Star className="h-5 w-5 text-yellow-600" />;
      case 'reminder':
        return <Bell className="h-5 w-5 text-orange-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'default';
      case 'payment':
        return 'default';
      case 'message':
        return 'secondary';
      case 'review':
        return 'default';
      case 'reminder':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
    
    toast({
      title: "Success",
      description: "Notification marked as read"
    });
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    
    toast({
      title: "Success",
      description: "Notification deleted"
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    
    toast({
      title: "Success",
      description: "All notifications marked as read"
    });
  };

  const handleDeleteAll = () => {
    setNotifications([]);
    
    toast({
      title: "Success",
      description: "All notifications cleared"
    });
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(notif => !notif.read);
      case 'action':
        return notifications.filter(notif => notif.actionRequired);
      default:
        return notifications;
    }
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;
  const actionRequiredCount = notifications.filter(notif => notif.actionRequired).length;

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:w-[600px] sm:max-w-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle className="text-xl font-bold flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2">{unreadCount}</Badge>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4 mt-4 pb-6">
          {/* Quick Actions */}
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline" size="sm" onClick={handleDeleteAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <Bell className="h-6 w-6 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold">{notifications.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <Badge className="h-6 w-6 rounded-full flex items-center justify-center mx-auto mb-1 text-xs">
                  {unreadCount}
                </Badge>
                <p className="text-lg font-bold">{unreadCount}</p>
                <p className="text-xs text-muted-foreground">Unread</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <Badge variant="destructive" className="h-6 w-6 rounded-full flex items-center justify-center mx-auto mb-1 text-xs">
                  {actionRequiredCount}
                </Badge>
                <p className="text-lg font-bold">{actionRequiredCount}</p>
                <p className="text-xs text-muted-foreground">Action</p>
              </CardContent>
            </Card>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 overflow-x-auto">
            <Button
              size="sm"
              variant={activeTab === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveTab('all')}
            >
              All ({notifications.length})
            </Button>
            <Button
              size="sm"
              variant={activeTab === 'unread' ? 'default' : 'outline'}
              onClick={() => setActiveTab('unread')}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              size="sm"
              variant={activeTab === 'action' ? 'default' : 'outline'}
              onClick={() => setActiveTab('action')}
            >
              Action ({actionRequiredCount})
            </Button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {getFilteredNotifications().length > 0 ? (
              getFilteredNotifications().map(notification => (
                <Card key={notification.id} className={`${!notification.read ? 'ring-2 ring-primary/20' : ''}`}>
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className={`text-sm font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant={getNotificationBadgeColor(notification.type)} className="text-xs">
                              {notification.type}
                            </Badge>
                            {notification.actionRequired && (
                              <Badge variant="destructive" className="text-xs">Action</Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                            {!notification.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                              onClick={() => handleDeleteNotification(notification.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-sm font-medium mb-1">No notifications</h3>
                  <p className="text-xs text-muted-foreground">
                    {activeTab === 'unread' ? 'No unread notifications' : 
                     activeTab === 'action' ? 'No actions required' : 
                     'All caught up!'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Notification Settings - Collapsible */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm">
                <Settings className="h-4 w-4 mr-2" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Booking Requests</p>
                  <p className="text-xs text-muted-foreground">New booking notifications</p>
                </div>
                <Switch
                  checked={settings.bookingRequests}
                  onCheckedChange={(checked) => setSettings({...settings, bookingRequests: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Messages</p>
                  <p className="text-xs text-muted-foreground">New message alerts</p>
                </div>
                <Switch
                  checked={settings.messages}
                  onCheckedChange={(checked) => setSettings({...settings, messages: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Payments</p>
                  <p className="text-xs text-muted-foreground">Payment confirmations</p>
                </div>
                <Switch
                  checked={settings.payments}
                  onCheckedChange={(checked) => setSettings({...settings, payments: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Reviews</p>
                  <p className="text-xs text-muted-foreground">Client review notifications</p>
                </div>
                <Switch
                  checked={settings.reviews}
                  onCheckedChange={(checked) => setSettings({...settings, reviews: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Reminders</p>
                  <p className="text-xs text-muted-foreground">Equipment & deadline reminders</p>
                </div>
                <Switch
                  checked={settings.reminders}
                  onCheckedChange={(checked) => setSettings({...settings, reminders: checked})}
                />
              </div>
            </CardContent>
          </Card>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

// Notification Trigger Component
interface NotificationTriggerProps {
  unreadCount?: number;
  onOpenPanel: () => void;
}

export function NotificationTrigger({ unreadCount = 0, onOpenPanel }: NotificationTriggerProps) {
  const handleClick = () => {
    console.log('NotificationTrigger clicked');
    onOpenPanel();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative"
      onClick={handleClick}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </Button>
  );
}