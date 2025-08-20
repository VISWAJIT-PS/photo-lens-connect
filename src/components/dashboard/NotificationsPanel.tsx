import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Camera, Package, CreditCard, Calendar, CheckCircle, X, MessageCircle } from 'lucide-react';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock notifications data
const notifications = [
  {
    id: '1',
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Your wedding photography session with Sarah Johnson is confirmed for Aug 15, 2024.',
    timestamp: '2 minutes ago',
    unread: true,
    icon: Camera,
    color: 'success'
  },
  {
    id: '2',
    type: 'rental',
    title: 'Equipment Ready',
    message: 'Canon EOS R5 and Sony A7S III are ready for pickup at Camera Rental Co.',
    timestamp: '1 hour ago',
    unread: true,
    icon: Package,
    color: 'primary'
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Due',
    message: 'Payment of $2,500 for wedding photography is due in 3 days.',
    timestamp: '3 hours ago',
    unread: true,
    icon: CreditCard,
    color: 'warning'
  },
  {
    id: '4',
    type: 'message',
    title: 'New Message',
    message: 'Michael Chen sent you a message about the portrait session details.',
    timestamp: '5 hours ago',
    unread: false,
    icon: MessageCircle,
    color: 'primary'
  },
  {
    id: '5',
    type: 'reminder',
    title: 'Event Reminder',
    message: 'Your corporate event photoshoot is tomorrow at 2 PM.',
    timestamp: '1 day ago',
    unread: false,
    icon: Calendar,
    color: 'primary'
  },
  {
    id: '6',
    type: 'gallery',
    title: 'Gallery Updated',
    message: 'Alex Rodriguez uploaded new photos to your wedding gallery.',
    timestamp: '2 days ago',
    unread: false,
    icon: Camera,
    color: 'success'
  }
];

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const unreadCount = notifications.filter(n => n.unread).length;

  const getIconColor = (color: string) => {
    switch (color) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'primary': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getBgColor = (color: string) => {
    switch (color) {
      case 'success': return 'bg-success/10';
      case 'warning': return 'bg-warning/10';
      case 'primary': return 'bg-primary/10';
      default: return 'bg-muted';
    }
  };

  const markAsRead = (id: string) => {
    // Mark notification as read logic here
  };

  const markAllAsRead = () => {
    // Mark all notifications as read logic here
  };

  const deleteNotification = (id: string) => {
    // Delete notification logic here
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </SheetTitle>
          </div>
          
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead} className="self-start">
              <CheckCircle className="h-3 w-3 mr-1" />
              Mark All Read
            </Button>
          )}
        </SheetHeader>

        <ScrollArea className="h-full mt-6">
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              
              return (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    notification.unread 
                      ? 'bg-muted/50 border-primary/20' 
                      : 'bg-card border-border hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getBgColor(notification.color)}`}>
                      <Icon className={`h-4 w-4 ${getIconColor(notification.color)}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <div className="flex items-center space-x-1">
                          {notification.unread && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                        {notification.message}
                      </p>
                      
                      <p className="text-xs text-muted-foreground">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {notifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No notifications yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                You'll see updates about your bookings and rentals here
              </p>
            </div>
          )}
        </ScrollArea>

        {/* Quick Actions */}
        <div className="border-t border-border pt-4 mt-4">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="justify-start">
              <Calendar className="h-3 w-3 mr-2" />
              View Calendar
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <MessageCircle className="h-3 w-3 mr-2" />
              Open Chats
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};