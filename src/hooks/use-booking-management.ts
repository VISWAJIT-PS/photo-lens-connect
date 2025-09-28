import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

export interface Booking {
  id: string
  customer_id: string
  photographer_id: string
  event_type: string
  event_date: string
  event_time?: string
  duration_hours?: number
  location: string
  budget_min?: number
  budget_max?: number
  currency: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded'
  requirements?: string
  special_requests?: string
  contract_url?: string
  invoice_url?: string
  total_amount?: number
  deposit_amount?: number
  deposit_paid: boolean
  final_payment_due?: string
  cancellation_reason?: string
  cancellation_date?: string
  created_by?: string
  assigned_team?: string[]
  created_at: string
  updated_at: string
  customer?: {
    id: string
    name: string
    email?: string
  }
  photographer?: {
    id: string
    name: string
    email?: string
  }
}

export interface BookingFormData {
  photographerId: string
  eventType: string
  eventDate: string
  eventTime: string
  durationHours: number
  location: string
  budgetMin?: number
  budgetMax?: number
  requirements?: string
  specialRequests?: string
}

// Get bookings for the current user (customer or photographer)
export const useBookings = (userType?: 'customer' | 'photographer') => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['bookings', user?.id, userType],
    queryFn: async () => {
      if (!user?.id) return []

      let query = supabase
        .from('bookings')
        .select(`
          *,
          customer:event_users!bookings_customer_id_fkey(
            id,
            name,
            email
          ),
          photographer:event_users!bookings_photographer_id_fkey(
            id,
            name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (userType === 'customer') {
        query = query.eq('customer_id', user.id)
      } else if (userType === 'photographer') {
        query = query.eq('photographer_id', user.id)
      } else {
        // Get both customer and photographer bookings
        query = query.or(`customer_id.eq.${user.id},photographer_id.eq.${user.id}`)
      }

      const { data, error } = await query
      if (error) throw error
      return data as Booking[]
    },
    enabled: !!user?.id,
  })
}

// Get booking by ID
export const useBooking = (bookingId: string) => {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      if (!bookingId) return null

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:event_users!bookings_customer_id_fkey(
            id,
            name,
            email
          ),
          photographer:event_users!bookings_photographer_id_fkey(
            id,
            name,
            email
          )
        `)
        .eq('id', bookingId)
        .single()

      if (error) throw error
      return data as Booking
    },
    enabled: !!bookingId,
  })
}

// Create a new booking
export const useCreateBooking = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (bookingData: BookingFormData) => {
      if (!user?.id) throw new Error('User must be authenticated')

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          customer_id: user.id,
          photographer_id: bookingData.photographerId,
          event_type: bookingData.eventType,
          event_date: bookingData.eventDate,
          event_time: bookingData.eventTime,
          duration_hours: bookingData.durationHours,
          location: bookingData.location,
          budget_min: bookingData.budgetMin,
          budget_max: bookingData.budgetMax,
          requirements: bookingData.requirements,
          special_requests: bookingData.specialRequests,
          status: 'pending',
          created_by: user.id
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      toast({
        title: 'Booking Request Sent',
        description: 'Your booking request has been sent to the photographer'
      })
    },
    onError: (error) => {
      toast({
        title: 'Booking Failed',
        description: error instanceof Error ? error.message : 'Failed to create booking',
        variant: 'destructive'
      })
    },
  })
}

// Update booking status
export const useUpdateBookingStatus = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      bookingId,
      status,
      cancellationReason
    }: {
      bookingId: string
      status: Booking['status']
      cancellationReason?: string
    }) => {
      if (!user?.id) throw new Error('User must be authenticated')

      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      }

      if (status === 'cancelled') {
        updateData.cancellation_reason = cancellationReason
        updateData.cancellation_date = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['booking', data.id] })

      toast({
        title: 'Booking Updated',
        description: `Booking status changed to ${data.status}`
      })
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update booking',
        variant: 'destructive'
      })
    },
  })
}

// Update booking details
export const useUpdateBooking = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      bookingId,
      updates
    }: {
      bookingId: string
      updates: Partial<BookingFormData> & {
        requirements?: string
        specialRequests?: string
        budgetMin?: number
        budgetMax?: number
      }
    }) => {
      if (!user?.id) throw new Error('User must be authenticated')

      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      queryClient.invalidateQueries({ queryKey: ['booking', data.id] })

      toast({
        title: 'Booking Updated',
        description: 'Booking details have been updated'
      })
    },
    onError: (error) => {
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update booking',
        variant: 'destructive'
      })
    },
  })
}

// Get photographer availability
export const usePhotographerAvailability = (photographerId: string, date?: string) => {
  return useQuery({
    queryKey: ['photographer-availability', photographerId, date],
    queryFn: async () => {
      if (!photographerId) return []

      // This would typically check existing bookings for the photographer
      // For now, return mock availability
      const { data, error } = await supabase
        .from('bookings')
        .select('event_date, event_time, duration_hours')
        .eq('photographer_id', photographerId)
        .eq('status', 'confirmed')
        .gte('event_date', date || new Date().toISOString().split('T')[0])

      if (error) throw error

      // Process availability based on existing bookings
      return data
    },
    enabled: !!photographerId,
  })
}

// Get booking statistics
export const useBookingStats = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['booking-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null

      // Get customer bookings stats
      const { data: customerBookings, error: customerError } = await supabase
        .from('bookings')
        .select('status, total_amount')
        .eq('customer_id', user.id)

      if (customerError) throw customerError

      // Get photographer bookings stats
      const { data: photographerBookings, error: photographerError } = await supabase
        .from('bookings')
        .select('status, total_amount')
        .eq('photographer_id', user.id)

      if (photographerError) throw photographerError

      const customerStats = {
        total: customerBookings.length,
        pending: customerBookings.filter(b => b.status === 'pending').length,
        confirmed: customerBookings.filter(b => b.status === 'confirmed').length,
        completed: customerBookings.filter(b => b.status === 'completed').length,
        cancelled: customerBookings.filter(b => b.status === 'cancelled').length,
        totalSpent: customerBookings
          .filter(b => b.total_amount)
          .reduce((sum, b) => sum + (b.total_amount || 0), 0)
      }

      const photographerStats = {
        total: photographerBookings.length,
        pending: photographerBookings.filter(b => b.status === 'pending').length,
        confirmed: photographerBookings.filter(b => b.status === 'confirmed').length,
        completed: photographerBookings.filter(b => b.status === 'completed').length,
        cancelled: photographerBookings.filter(b => b.status === 'cancelled').length,
        totalEarned: photographerBookings
          .filter(b => b.total_amount)
          .reduce((sum, b) => sum + (b.total_amount || 0), 0)
      }

      return {
        customer: customerStats,
        photographer: photographerStats
      }
    },
    enabled: !!user?.id,
  })
}

// Calendar view data for bookings
export const useBookingsCalendar = (startDate: Date, endDate: Date) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['bookings-calendar', user?.id, startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      if (!user?.id) return []

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:event_users!bookings_customer_id_fkey(
            id,
            name
          ),
          photographer:event_users!bookings_photographer_id_fkey(
            id,
            name
          )
        `)
        .or(`customer_id.eq.${user.id},photographer_id.eq.${user.id}`)
        .gte('event_date', startDate.toISOString().split('T')[0])
        .lte('event_date', endDate.toISOString().split('T')[0])
        .order('event_date')
        .order('event_time')

      if (error) throw error
      return data as Booking[]
    },
    enabled: !!user?.id,
  })
}

// Add booking note
export const useAddBookingNote = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      bookingId,
      note,
      noteType = 'internal',
      isPrivate = true
    }: {
      bookingId: string
      note: string
      noteType?: 'internal' | 'customer_communication' | 'reminder'
      isPrivate?: boolean
    }) => {
      if (!user?.id) throw new Error('User must be authenticated')

      const { data, error } = await supabase
        .from('booking_notes')
        .insert({
          booking_id: bookingId,
          author_id: user.id,
          note_type: noteType,
          content: note,
          is_private: isPrivate
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['booking-notes', data.booking_id] })
      toast({
        title: 'Note Added',
        description: 'Booking note has been added'
      })
    },
    onError: (error) => {
      toast({
        title: 'Failed to Add Note',
        description: error instanceof Error ? error.message : 'Failed to add note',
        variant: 'destructive'
      })
    },
  })
}

// Get booking notes
export const useBookingNotes = (bookingId: string) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['booking-notes', bookingId],
    queryFn: async () => {
      if (!bookingId) return []

      const { data, error } = await supabase
        .from('booking_notes')
        .select(`
          *,
          author:event_users!booking_notes_author_id_fkey(
            id,
            name
          )
        `)
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!bookingId,
  })
}

// Generate contract/invoice URLs (placeholder)
export const useGenerateBookingDocuments = () => {
  const { user } = useAuth()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (bookingId: string) => {
      if (!user?.id) throw new Error('User must be authenticated')

      // In a real implementation, this would generate PDFs and upload to storage
      // For now, return mock URLs
      const contractUrl = `/api/contracts/${bookingId}`
      const invoiceUrl = `/api/invoices/${bookingId}`

      // Update booking with document URLs
      const { data, error } = await supabase
        .from('bookings')
        .update({
          contract_url: contractUrl,
          invoice_url: invoiceUrl
        })
        .eq('id', bookingId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast({
        title: 'Documents Generated',
        description: 'Contract and invoice have been generated'
      })
    },
    onError: (error) => {
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate documents',
        variant: 'destructive'
      })
    },
  })
}

// Search bookings
export const useSearchBookings = (searchQuery: string, filters?: {
  status?: Booking['status']
  eventType?: string
  dateFrom?: string
  dateTo?: string
}) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['search-bookings', user?.id, searchQuery, filters],
    queryFn: async () => {
      if (!user?.id) return []

      let query = supabase
        .from('bookings')
        .select(`
          *,
          customer:event_users!bookings_customer_id_fkey(
            id,
            name
          ),
          photographer:event_users!bookings_photographer_id_fkey(
            id,
            name
          )
        `)
        .or(`customer_id.eq.${user.id},photographer_id.eq.${user.id}`)

      if (searchQuery) {
        query = query.or(`location.ilike.%${searchQuery}%,event_type.ilike.%${searchQuery}%`)
      }

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.eventType) {
        query = query.eq('event_type', filters.eventType)
      }

      if (filters?.dateFrom) {
        query = query.gte('event_date', filters.dateFrom)
      }

      if (filters?.dateTo) {
        query = query.lte('event_date', filters.dateTo)
      }

      const { data, error } = await query
        .order('event_date', { ascending: false })
        .limit(50)

      if (error) throw error
      return data as Booking[]
    },
    enabled: !!user?.id && !!searchQuery,
  })
}

// Get upcoming bookings (next 30 days)
export const useUpcomingBookings = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['upcoming-bookings', user?.id],
    queryFn: async () => {
      if (!user?.id) return []

      const today = new Date().toISOString().split('T')[0]
      const nextMonth = new Date()
      nextMonth.setDate(nextMonth.getDate() + 30)
      const nextMonthStr = nextMonth.toISOString().split('T')[0]

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:event_users!bookings_customer_id_fkey(
            id,
            name
          ),
          photographer:event_users!bookings_photographer_id_fkey(
            id,
            name
          )
        `)
        .or(`customer_id.eq.${user.id},photographer_id.eq.${user.id}`)
        .gte('event_date', today)
        .lte('event_date', nextMonthStr)
        .in('status', ['pending', 'confirmed', 'in_progress'])
        .order('event_date')
        .order('event_time')

      if (error) throw error
      return data as Booking[]
    },
    enabled: !!user?.id,
  })
}

// Bulk operations for bookings
export const useBulkUpdateBookings = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      bookingIds,
      updates
    }: {
      bookingIds: string[]
      updates: {
        status?: Booking['status']
        assigned_team?: string[]
      }
    }) => {
      if (!user?.id) throw new Error('User must be authenticated')

      const { data, error } = await supabase
        .from('bookings')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .in('id', bookingIds)
        .select()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      toast({
        title: 'Bookings Updated',
        description: `${data.length} bookings have been updated`
      })
    },
    onError: (error) => {
      toast({
        title: 'Bulk Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update bookings',
        variant: 'destructive'
      })
    },
  })
}