import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types'

type Rental = Tables<'rentals'>
type RentalInsert = TablesInsert<'rentals'>
type RentalUpdate = TablesUpdate<'rentals'>

export const useRentals = (filters?: {
  category?: string
  location?: string
  minRating?: number
  maxPrice?: string
  available?: boolean
}) => {
  return useQuery({
    queryKey: ['rentals', filters],
    queryFn: async () => {
      let query = supabase
        .from('rentals')
        .select('*')
        .order('rating', { ascending: false })

      if (filters?.category) {
        query = query.eq('category', filters.category)
      }

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      if (filters?.minRating) {
        query = query.gte('rating', filters.minRating)
      }

      if (filters?.available !== undefined) {
        query = query.eq('available', filters.available)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    },
  })
}

export const useRental = (id: number) => {
  return useQuery({
    queryKey: ['rental', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rentals')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export const useCreateRental = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (rental: RentalInsert) => {
      const { data, error } = await supabase
        .from('rentals')
        .insert(rental)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] })
    },
  })
}

export const useUpdateRental = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: RentalUpdate }) => {
      const { data, error } = await supabase
        .from('rentals')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] })
      queryClient.invalidateQueries({ queryKey: ['rental', data.id] })
    },
  })
}

export const useDeleteRental = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('rentals')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] })
    },
  })
}

// Rental categories for filtering
export const useRentalCategories = () => {
  return useQuery({
    queryKey: ['rental-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rentals')
        .select('category')
        .not('category', 'is', null)

      if (error) throw error

      const categories = [...new Set(data.map(item => item.category))]
      return categories.sort()
    },
  })
}

// User's rentals (for photographers to manage their listings)
export const useUserRentals = (userId: string) => {
  return useQuery({
    queryKey: ['user-rentals', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rentals')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}