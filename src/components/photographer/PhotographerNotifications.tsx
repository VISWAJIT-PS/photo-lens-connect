import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bell, Check, Trash2, Settings, MessageSquare, Calendar, DollarSign, Star, Camera } from 'lucide-react';
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

export function PhotographerNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [settings, setSettings] = useState(notificationSettings);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline" onClick={handleDeleteAll}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Bell className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{notifications.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Badge className="h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-2">
              {unreadCount}
            </Badge>
            <p className="text-2xl font-bold">{unreadCount}</p>
            <p className="text-sm text-muted-foreground">Unread</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Badge variant="destructive" className="h-8 w-8 rounded-full flex items-center justify-center mx-auto mb-2">
              {actionRequiredCount}
            </Badge>
            <p className="text-2xl font-bold">{actionRequiredCount}</p>
            <p className="text-sm text-muted-foreground">Action Required</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        <Button
          variant={activeTab === 'all' ? 'default' : 'outline'}
          onClick={() => setActiveTab('all')}
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={activeTab === 'unread' ? 'default' : 'outline'}
          onClick={() => setActiveTab('unread')}
        >
          Unread ({unreadCount})
        </Button>
        <Button
          variant={activeTab === 'action' ? 'default' : 'outline'}
          onClick={() => setActiveTab('action')}
        >
          Action Required ({actionRequiredCount})
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {getFilteredNotifications().length > 0 ? (
          getFilteredNotifications().map(notification => (
            <Card key={notification.id} className={`${!notification.read ? 'ring-2 ring-primary/20' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getNotificationBadgeColor(notification.type)}>
                          {notification.type}
                        </Badge>
                        {notification.actionRequired && (
                          <Badge variant="destructive">Action Required</Badge>
                        )}
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                      <div className="flex space-x-2">
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                {activeTab === 'unread' ? 'No unread notifications' : 
                 activeTab === 'action' ? 'No actions required' : 
                 'All caught up!'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Booking Requests</p>
              <p className="text-sm text-muted-foreground">Get notified when clients request bookings</p>
            </div>
            <Switch
              checked={settings.bookingRequests}
              onCheckedChange={(checked) => setSettings({...settings, bookingRequests: checked})}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Messages</p>
              <p className="text-sm text-muted-foreground">Get notified about new messages from clients</p>
            </div>
            <Switch
              checked={settings.messages}
              onCheckedChange={(checked) => setSettings({...settings, messages: checked})}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Payments</p>
              <p className="text-sm text-muted-foreground">Get notified when payments are received</p>
            </div>
            <Switch
              checked={settings.payments}
              onCheckedChange={(checked) => setSettings({...settings, payments: checked})}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Reviews</p>
              <p className="text-sm text-muted-foreground">Get notified when clients leave reviews</p>
            </div>
            <Switch
              checked={settings.reviews}
              onCheckedChange={(checked) => setSettings({...settings, reviews: checked})}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Reminders</p>
              <p className="text-sm text-muted-foreground">Get reminders about equipment returns and deadlines</p>
            </div>
            <Switch
              checked={settings.reminders}
              onCheckedChange={(checked) => setSettings({...settings, reminders: checked})}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}