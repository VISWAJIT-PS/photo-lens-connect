import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Tables } from '@/integrations/supabase/types'

type Booking = Tables<'bookings'>

export const useBookings = (userId: string, userType: 'customer' | 'photographer') => {
  return useQuery({
    queryKey: ['bookings', userId, userType],
    queryFn: async () => {
      let query = supabase.from('bookings').select('*')

      if (userType === 'customer') {
        query = query.eq('customer_id', userId)
      } else {
        query = query.eq('photographer_id', userId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })
}

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (booking: {
      customer_id: string
      photographer_id: string
      event_type: string
      event_date: string
      event_time?: string
      duration_hours?: number
      location: string
      budget_min?: number
      budget_max?: number
      requirements?: string
      special_requests?: string
    }) => {
      const newBooking = {
        customer_id: booking.customer_id,
        photographer_id: booking.photographer_id,
        event_type: booking.event_type,
        event_date: booking.event_date,
        event_time: booking.event_time || null,
        duration_hours: booking.duration_hours || null,
        location: booking.location,
        budget_min: booking.budget_min || null,
        budget_max: booking.budget_max || null,
        requirements: booking.requirements || null,
        special_requests: booking.special_requests || null,
        status: 'pending'
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert(newBooking)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings', data.customer_id] })
      queryClient.invalidateQueries({ queryKey: ['bookings', data.photographer_id] })
    },
  })
}

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status, updatedBy }: { id: string; status: string; updatedBy: string }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Create notifications for both parties
      if (updatedBy !== data.customer_id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: data.customer_id,
            type: 'booking',
            title: 'Booking Status Updated',
            message: `Your booking status has been updated to: ${status}`,
            data: {
              booking_id: id,
              new_status: status
            },
            action_url: `/bookings/${id}`,
            priority: 'normal'
          })
      }

      if (updatedBy !== data.photographer_id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: data.photographer_id,
            type: 'booking',
            title: 'Booking Status Updated',
            message: `Booking status has been updated to: ${status}`,
            data: {
              booking_id: id,
              new_status: status
            },
            action_url: `/bookings/${id}`,
            priority: 'normal'
          })
      }

      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['booking', data.id] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export const useCancelBooking = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, reason, cancelledBy }: { id: string; reason?: string; cancelledBy: string }) => {
      // First get the booking details to create notifications
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      // Update booking status to cancelled
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancellation_reason: reason,
          cancellation_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      // Create notifications for both parties
      if (cancelledBy !== booking.customer_id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: booking.customer_id,
            type: 'booking',
            title: 'Booking Cancelled',
            message: `Your booking has been cancelled${reason ? `: ${reason}` : ''}`,
            data: {
              booking_id: id,
              reason: reason
            },
            action_url: `/bookings/${id}`,
            priority: 'normal'
          })
      }

      if (cancelledBy !== booking.photographer_id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: booking.photographer_id,
            type: 'booking',
            title: 'Booking Cancelled',
            message: `Booking has been cancelled${reason ? `: ${reason}` : ''}`,
            data: {
              booking_id: id,
              reason: reason
            },
            action_url: `/bookings/${id}`,
            priority: 'normal'
          })
      }

      return id
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

// Booking requests for photographers
export const useBookingRequests = (photographerId: string) => {
  return useQuery({
    queryKey: ['booking-requests', photographerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('photographer_id', photographerId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!photographerId,
  })
}

// Customer's active bookings
export const useCustomerBookings = (customerId: string) => {
  return useQuery({
    queryKey: ['customer-bookings', customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('customer_id', customerId)
        .in('status', ['confirmed', 'completed'])
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!customerId,
  })
}