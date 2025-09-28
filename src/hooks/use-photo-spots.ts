import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types'

type PhotoSpot = Tables<'rentals'> & {
  // Extend with photo spot specific fields
  spot_type?: string
  max_people?: number
  amenities?: string[]
  best_time?: string
  difficulty_level?: string
  is_featured?: boolean
}

type PhotoSpotInsert = TablesInsert<'rentals'> & {
  spot_type?: string
  max_people?: number
  amenities?: string[]
  best_time?: string
  difficulty_level?: string
  is_featured?: boolean
}

type PhotoSpotUpdate = TablesUpdate<'rentals'> & {
  spot_type?: string
  max_people?: number
  amenities?: string[]
  best_time?: string
  difficulty_level?: string
  is_featured?: boolean
}

export const usePhotoSpots = (filters?: {
  location?: string
  category?: string
  minRating?: number
  maxPrice?: string
  available?: boolean
  spotType?: string
  difficultyLevel?: string
  maxPeople?: number
}) => {
  return useQuery({
    queryKey: ['photo-spots', filters],
    queryFn: async () => {
      let query = supabase
        .from('rentals')
        .select('*')
        .eq('category', 'Photo Spots')
        .order('rating', { ascending: false })

      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      if (filters?.category) {
        query = query.eq('category', filters.category)
      }

      if (filters?.minRating) {
        query = query.gte('rating', filters.minRating)
      }

      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice)
      }

      if (filters?.available !== undefined) {
        query = query.eq('available', filters.available)
      }

      // Additional photo spot filters would go here
      // These would require additional columns in the rentals table

      const { data, error } = await query

      if (error) throw error
      return data as PhotoSpot[]
    },
  })
}

export const usePhotoSpot = (id: number) => {
  return useQuery({
    queryKey: ['photo-spot', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rentals')
        .select('*')
        .eq('id', id)
        .eq('category', 'Photo Spots')
        .single()

      if (error) throw error
      return data as PhotoSpot
    },
    enabled: !!id,
  })
}

export const useCreatePhotoSpot = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (photoSpot: PhotoSpotInsert) => {
      const { data, error } = await supabase
        .from('rentals')
        .insert({
          ...photoSpot,
          category: 'Photo Spots'
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photo-spots'] })
    },
  })
}

export const useUpdatePhotoSpot = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: PhotoSpotUpdate }) => {
      const { data, error } = await supabase
        .from('rentals')
        .update(updates)
        .eq('id', id)
        .eq('category', 'Photo Spots')
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['photo-spots'] })
      queryClient.invalidateQueries({ queryKey: ['photo-spot', data.id] })
    },
  })
}

export const useDeletePhotoSpot = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('rentals')
        .delete()
        .eq('id', id)
        .eq('category', 'Photo Spots')

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photo-spots'] })
    },
  })
}

// Photo spot booking functionality
export const useBookPhotoSpot = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      spotId,
      customerId,
      bookingDate,
      duration,
      specialRequests
    }: {
      spotId: number
      customerId: string
      bookingDate: string
      duration: number
      specialRequests?: string
    }) => {
      // First check availability
      const { data: spot, error: spotError } = await supabase
        .from('rentals')
        .select('*')
        .eq('id', spotId)
        .single()

      if (spotError) throw spotError
      if (!spot.available) throw new Error('Photo spot is not available')

      // Create booking
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          customer_id: customerId,
          photographer_id: spot.owner_id || '', // Photo spot owner
          event_date: bookingDate,
          location: spot.location,
          event_type: 'photo_spot_booking',
          total_amount: calculateSpotPrice(spot.price, duration),
          duration_hours: duration,
          special_requests: specialRequests,
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photo-spots'] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

// Helper function to calculate photo spot price
const calculateSpotPrice = (basePrice: string, hours: number): number => {
  const priceMatch = basePrice.match(/\$?(\d+(?:\.\d+)?)/)
  const hourlyRate = priceMatch ? parseFloat(priceMatch[1]) : 50
  return hourlyRate * hours
}

// Get photo spot categories/types
export const usePhotoSpotCategories = () => {
  return useQuery({
    queryKey: ['photo-spot-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rentals')
        .select('category')
        .eq('category', 'Photo Spots')
        .not('category', 'is', null)

      if (error) throw error

      const categories = [...new Set(data.map(item => item.category))]
      return categories.sort()
    },
  })
}

// Get featured photo spots
export const useFeaturedPhotoSpots = (limit = 6) => {
  return useQuery({
    queryKey: ['featured-photo-spots', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rentals')
        .select('*')
        .eq('category', 'Photo Spots')
        .eq('available', true)
        .order('rating', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data as PhotoSpot[]
    },
  })
}

// Get photo spots by location
export const usePhotoSpotsByLocation = (location: string) => {
  return useQuery({
    queryKey: ['photo-spots-location', location],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rentals')
        .select('*')
        .eq('category', 'Photo Spots')
        .ilike('location', `%${location}%`)
        .eq('available', true)
        .order('rating', { ascending: false })

      if (error) throw error
      return data as PhotoSpot[]
    },
    enabled: !!location,
  })
}

// Search photo spots
export const useSearchPhotoSpots = (query: string) => {
  return useQuery({
    queryKey: ['search-photo-spots', query],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rentals')
        .select('*')
        .eq('category', 'Photo Spots')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
        .eq('available', true)
        .order('rating', { ascending: false })

      if (error) throw error
      return data as PhotoSpot[]
    },
    enabled: !!query && query.length > 2,
  })
}