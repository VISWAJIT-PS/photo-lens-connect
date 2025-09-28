import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types'

type Event = Tables<'events'>
type EventInsert = TablesInsert<'events'>
type EventUpdate = TablesUpdate<'events'>

export const useEvents = (filters?: {
  status?: string
  location?: string
  dateFrom?: string
  dateTo?: string
}) => {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select(`
          *,
          event_summary (
            actual_photo_count,
            actual_user_count,
            avg_confidence,
            total_downloads
          )
        `)
        .order('date', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      if (filters?.dateFrom) {
        query = query.gte('date', filters.dateFrom)
      }

      if (filters?.dateTo) {
        query = query.lte('date', filters.dateTo)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    },
  })
}

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          event_summary (
            actual_photo_count,
            actual_user_count,
            avg_confidence,
            total_downloads
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export const useCreateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (event: EventInsert) => {
      const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

export const useUpdateEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: EventUpdate }) => {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['event', data.id] })
    },
  })
}

export const useDeleteEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

// Event photos hooks
export const useEventPhotos = (eventId: string) => {
  return useQuery({
    queryKey: ['event-photos', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_photos')
        .select(`
          *,
          photo_details (
            match_count,
            avg_match_confidence,
            favorite_count,
            actual_download_count
          )
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!eventId,
  })
}

// Event users hooks
export const useEventUsers = (eventId: string) => {
  return useQuery({
    queryKey: ['event-users', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_users')
        .select('*')
        .eq('event_id', eventId)
        .order('registration_date', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!eventId,
  })
}