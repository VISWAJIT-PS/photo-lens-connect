import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types'

type Photographer = Tables<'photographers'>
type PhotographerInsert = TablesInsert<'photographers'>
type PhotographerUpdate = TablesUpdate<'photographers'>

export const usePhotographers = (filters?: {
  specialization?: string
  location?: string
  minRating?: number
  maxPrice?: string
}) => {
  return useQuery({
    queryKey: ['photographers', filters],
    queryFn: async () => {
      let query = supabase
        .from('photographers')
        .select('*')
        .order('rating', { ascending: false })

      if (filters?.specialization) {
        query = query.eq('specialization', filters.specialization)
      }

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      if (filters?.minRating) {
        query = query.gte('rating', filters.minRating)
      }

      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    },
  })
}

export const usePhotographer = (id: string) => {
  return useQuery({
    queryKey: ['photographer', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photographers')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export const useCreatePhotographer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (photographer: PhotographerInsert) => {
      const { data, error } = await supabase
        .from('photographers')
        .insert(photographer)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photographers'] })
    },
  })
}

export const useUpdatePhotographer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: PhotographerUpdate }) => {
      const { data, error } = await supabase
        .from('photographers')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['photographers'] })
      queryClient.invalidateQueries({ queryKey: ['photographer', data.id] })
    },
  })
}

export const useDeletePhotographer = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('photographers')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photographers'] })
    },
  })
}