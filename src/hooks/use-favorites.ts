import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Tables, TablesInsert } from '@/integrations/supabase/types'

type UserFavorite = Tables<'user_favorites'>
type UserFavoriteInsert = TablesInsert<'user_favorites'>

export const useUserFavorites = (userId: string) => {
  return useQuery({
    queryKey: ['user-favorites', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          *,
          event_photos (
            id,
            title,
            url,
            timestamp,
            location,
            photographer,
            photo_details (
              match_count,
              favorite_count
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}

export const useAddToFavorites = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (favorite: UserFavoriteInsert) => {
      const { data, error } = await supabase
        .from('user_favorites')
        .insert(favorite)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites', data.user_id] })
      queryClient.invalidateQueries({ queryKey: ['photo-favorites', data.photo_id] })
    },
  })
}

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, photoId }: { userId: string; photoId: string }) => {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('photo_id', photoId)

      if (error) throw error
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['photo-favorites', variables.photoId] })
    },
  })
}

export const useIsFavorite = (userId: string, photoId: string) => {
  return useQuery({
    queryKey: ['is-favorite', userId, photoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('photo_id', photoId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return !!data
    },
    enabled: !!userId && !!photoId,
  })
}

export const usePhotoFavorites = (photoId: string) => {
  return useQuery({
    queryKey: ['photo-favorites', photoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          *,
          event_users (
            name,
            profile_photo_url
          )
        `)
        .eq('photo_id', photoId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!photoId,
  })
}

export const useToggleFavorite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, photoId }: { userId: string; photoId: string }) => {
      // Check if already favorited
      const { data: existing } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('photo_id', photoId)
        .single()

      if (existing) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', userId)
          .eq('photo_id', photoId)

        if (error) throw error
        return false // Not favorited
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: userId,
            photo_id: photoId,
          })

        if (error) throw error
        return true // Favorited
      }
    },
    onSuccess: (isFavorited, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['photo-favorites', variables.photoId] })
      queryClient.invalidateQueries({ queryKey: ['is-favorite', variables.userId, variables.photoId] })
    },
  })
}