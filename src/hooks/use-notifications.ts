import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Tables } from '@/integrations/supabase/types'
import { useEffect, useState } from 'react'

type Notification = Tables<'notifications'>
type NotificationPreferences = Tables<'notification_preferences'>

export const useNotifications = (userId: string, limit = 50) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const query = useQuery({
    queryKey: ['notifications', userId, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })

  useEffect(() => {
    if (query.data) {
      setNotifications(query.data)
    }
  }, [query.data])

  useEffect(() => {
    if (!userId) return

    // Set up real-time subscription
    const subscription = supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const newNotification = payload.new as Notification
          setNotifications(prev => [newNotification, ...prev].slice(0, limit))
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const updatedNotification = payload.new as Notification
          setNotifications(prev =>
            prev.map(notification =>
              notification.id === updatedNotification.id
                ? updatedNotification
                : notification
            )
          )
        }
      )
      .on('postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const deletedNotification = payload.old as Notification
          setNotifications(prev =>
            prev.filter(notification => notification.id !== deletedNotification.id)
          )
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId, limit])

  return {
    ...query,
    notifications: notifications,
  }
}

export const useUnreadNotifications = (userId: string) => {
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([])

  const query = useQuery({
    queryKey: ['unread-notifications', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })

  useEffect(() => {
    if (query.data) {
      setUnreadNotifications(query.data)
    }
  }, [query.data])

  useEffect(() => {
    if (!userId) return

    // Set up real-time subscription for unread notifications
    const subscription = supabase
      .channel(`unread-notifications:${userId}`)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const newNotification = payload.new as Notification
          if (!newNotification.is_read) {
            setUnreadNotifications(prev => [newNotification, ...prev])
          }
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          const updatedNotification = payload.new as Notification
          if (updatedNotification.is_read) {
            // Remove from unread list
            setUnreadNotifications(prev =>
              prev.filter(notification => notification.id !== updatedNotification.id)
            )
          } else {
            // Add to unread list if not already there
            setUnreadNotifications(prev => {
              const exists = prev.find(n => n.id === updatedNotification.id)
              if (exists) {
                return prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
              } else {
                return [updatedNotification, ...prev]
              }
            })
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  return {
    ...query,
    unreadNotifications: unreadNotifications,
  }
}

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] })
    },
  })
}

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('is_read', false)

      if (error) throw error
      return true
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] })
      queryClient.invalidateQueries({ queryKey: ['unread-notifications', userId] })
    },
  })
}

export const useDeleteNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error
      return true
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] })
    },
  })
}

export const useCreateNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (notification: {
      user_id: string
      type: string
      title: string
      message: string
      data?: Record<string, any>
      action_url?: string
      priority?: string
      expires_at?: string
    }) => {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notification,
          is_read: false
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notifications', data.user_id] })
      queryClient.invalidateQueries({ queryKey: ['unread-notifications', data.user_id] })
    },
  })
}

// Notification creation helpers for common scenarios
export const useNotificationHelpers = (userId: string) => {
  const createNotification = useCreateNotification()

  const createBookingNotification = (bookingData: {
    customerId: string
    photographerId: string
    eventType: string
    eventDate: string
    action: 'created' | 'confirmed' | 'cancelled' | 'completed'
  }) => {
    const { customerId, photographerId, eventType, eventDate, action } = bookingData

    const notifications = []

    // Notify customer
    if (action === 'created') {
      notifications.push({
        user_id: customerId,
        type: 'booking',
        title: 'Booking Request Sent',
        message: `Your booking request for ${eventType} on ${eventDate} has been sent to the photographer.`,
        data: { booking_action: action, event_type: eventType, event_date: eventDate },
        action_url: `/bookings`,
        priority: 'normal'
      })
    } else if (action === 'confirmed') {
      notifications.push({
        user_id: customerId,
        type: 'booking',
        title: 'Booking Confirmed',
        message: `Your ${eventType} booking for ${eventDate} has been confirmed!`,
        data: { booking_action: action, event_type: eventType, event_date: eventDate },
        action_url: `/bookings`,
        priority: 'high'
      })
    }

    // Notify photographer
    if (action === 'created') {
      notifications.push({
        user_id: photographerId,
        type: 'booking',
        title: 'New Booking Request',
        message: `You have a new booking request for ${eventType} on ${eventDate}.`,
        data: { booking_action: action, event_type: eventType, event_date: eventDate },
        action_url: `/bookings`,
        priority: 'high'
      })
    }

    // Create all notifications
    notifications.forEach(notification => {
      createNotification.mutate(notification)
    })
  }

  const createMessageNotification = (chatData: {
    recipientId: string
    senderName: string
    chatId: string
    messagePreview: string
  }) => {
    const { recipientId, senderName, chatId, messagePreview } = chatData

    createNotification.mutate({
      user_id: recipientId,
      type: 'message',
      title: `New message from ${senderName}`,
      message: messagePreview,
      data: { chat_id: chatId, sender_name: senderName },
      action_url: `/chat/${chatId}`,
      priority: 'normal'
    })
  }

  const createPhotoMatchNotification = (matchData: {
    userId: string
    photoId: string
    confidence: number
    eventName: string
  }) => {
    const { userId, photoId, confidence, eventName } = matchData

    createNotification.mutate({
      user_id: userId,
      type: 'photo_match',
      title: 'Photo Match Found!',
      message: `A photo from ${eventName} has been matched with your profile (${confidence}% confidence).`,
      data: { photo_id: photoId, confidence, event_name: eventName },
      action_url: `/gallery`,
      priority: 'normal'
    })
  }

  const createEventUpdateNotification = (eventData: {
    userId: string
    eventName: string
    updateType: 'new_photos' | 'event_completed' | 'deadline_reminder'
    message: string
  }) => {
    const { userId, eventName, updateType, message } = eventData

    createNotification.mutate({
      user_id: userId,
      type: 'event_update',
      title: `Event Update: ${eventName}`,
      message,
      data: { event_name: eventName, update_type: updateType },
      action_url: `/events`,
      priority: 'normal'
    })
  }

  return {
    createBookingNotification,
    createMessageNotification,
    createPhotoMatchNotification,
    createEventUpdateNotification,
  }
}