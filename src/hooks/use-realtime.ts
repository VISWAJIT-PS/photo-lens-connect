import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export const useRealtimeSubscription = <T = any>(
  table: string,
  filter?: string,
  onInsert?: (payload: RealtimePostgresChangesPayload<T>) => void,
  onUpdate?: (payload: RealtimePostgresChangesPayload<T>) => void,
  onDelete?: (payload: RealtimePostgresChangesPayload<T>) => void
) => {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    const channelName = `realtime:${table}${filter ? `:${filter}` : ''}`

    const subscription = supabase
      .channel(channelName)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table,
          filter
        },
        onInsert || (() => {})
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table,
          filter
        },
        onUpdate || (() => {})
      )
      .on('postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table,
          filter
        },
        onDelete || (() => {})
      )
      .subscribe()

    setChannel(subscription)

    return () => {
      subscription.unsubscribe()
    }
  }, [table, filter, onInsert, onUpdate, onDelete])

  return channel
}

export const useChatRealtime = (chatId: string) => {
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    if (!chatId) return

    const fetchInitialMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching initial messages:', error)
        return
      }

      setMessages(data || [])
    }

    fetchInitialMessages()

    // Set up real-time subscription
    const subscription = supabase
      .channel(`chat:${chatId}`)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new])
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === payload.new.id ? payload.new : msg
            )
          )
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [chatId])

  return { messages }
}

export const useNotificationsRealtime = (userId: string) => {
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    if (!userId) return

    const fetchInitialNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching initial notifications:', error)
        return
      }

      setNotifications(data || [])
    }

    fetchInitialNotifications()

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
          setNotifications(prev => [payload.new, ...prev])
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
          setNotifications(prev =>
            prev.map(notif =>
              notif.id === payload.new.id ? payload.new : notif
            )
          )
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  return { notifications }
}

export const useBookingsRealtime = (userId: string, userType: 'customer' | 'photographer') => {
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    if (!userId) return

    const fetchInitialBookings = async () => {
      let query = supabase.from('bookings').select('*')

      if (userType === 'customer') {
        query = query.eq('customer_id', userId)
      } else {
        query = query.eq('photographer_id', userId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching initial bookings:', error)
        return
      }

      setBookings(data || [])
    }

    fetchInitialBookings()

    // Set up real-time subscription
    const filter = userType === 'customer'
      ? `customer_id=eq.${userId}`
      : `photographer_id=eq.${userId}`

    const subscription = supabase
      .channel(`bookings:${userId}:${userType}`)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
          filter
        },
        (payload) => {
          setBookings(prev => [payload.new, ...prev])
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'bookings',
          filter
        },
        (payload) => {
          setBookings(prev =>
            prev.map(booking =>
              booking.id === payload.new.id ? payload.new : booking
            )
          )
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId, userType])

  return { bookings }
}

export const useEventRealtime = (eventId: string) => {
  const [eventData, setEventData] = useState<any>(null)

  useEffect(() => {
    if (!eventId) return

    const fetchInitialEvent = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single()

      if (error) {
        console.error('Error fetching initial event:', error)
        return
      }

      setEventData(data)
    }

    fetchInitialEvent()

    // Set up real-time subscription
    const subscription = supabase
      .channel(`event:${eventId}`)
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'events',
          filter: `id=eq.${eventId}`
        },
        (payload) => {
          setEventData(payload.new)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [eventId])

  return { eventData }
}