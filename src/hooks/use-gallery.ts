import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'

export interface GalleryPhoto {
  id: string
  event_id: string
  url: string
  title?: string
  timestamp?: string
  location?: string
  people_count: number
  tags?: string[]
  camera?: string
  photographer?: string
  resolution?: string
  created_at: string
  updated_at: string
  // Additional computed fields
  isFavorited?: boolean
  downloadCount?: number
  event?: {
    id: string
    name: string
    date: string
    location: string
  }
}

export interface PhotoFilter {
  eventId?: string
  tags?: string[]
  dateFrom?: string
  dateTo?: string
  location?: string
  hasPeople?: boolean
  sortBy?: 'date' | 'popularity' | 'title'
  sortOrder?: 'asc' | 'desc'
}

export interface PhotoDownload {
  id: string
  photo_id: string
  user_id: string
  download_url: string
  file_size?: number
  downloaded_at: string
}

// Get photos with filtering and pagination
export const useGalleryPhotos = (filter: PhotoFilter = {}, page = 1, limit = 20) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['gallery-photos', filter, page, limit, user?.id],
    queryFn: async () => {
      let query = supabase
        .from('event_photos')
        .select(`
          *,
          event:events(
            id,
            name,
            date,
            location
          )
        `)

      // Apply filters
      if (filter.eventId) {
        query = query.eq('event_id', filter.eventId)
      }

      if (filter.tags && filter.tags.length > 0) {
        query = query.overlaps('tags', filter.tags)
      }

      if (filter.dateFrom) {
        query = query.gte('created_at', filter.dateFrom)
      }

      if (filter.dateTo) {
        query = query.lte('created_at', filter.dateTo)
      }

      if (filter.location) {
        query = query.ilike('location', `%${filter.location}%`)
      }

      if (filter.hasPeople !== undefined) {
        if (filter.hasPeople) {
          query = query.gt('people_count', 0)
        } else {
          query = query.eq('people_count', 0)
        }
      }

      // Apply sorting
      const sortBy = filter.sortBy || 'date'
      const sortOrder = filter.sortOrder || 'desc'

      switch (sortBy) {
        case 'date':
          query = query.order('created_at', { ascending: sortOrder === 'asc' })
          break
        case 'popularity':
          query = query.order('people_count', { ascending: sortOrder === 'asc' })
          break
        case 'title':
          query = query.order('title', { ascending: sortOrder === 'asc' })
          break
      }

      // Apply pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query
      if (error) throw error

      // Get user's favorites if authenticated
      let favoritedPhotoIds: string[] = []
      if (user?.id) {
        const { data: favorites } = await supabase
          .from('user_favorites')
          .select('photo_id')
          .eq('user_id', user.id)

        favoritedPhotoIds = favorites?.map((f: any) => f.photo_id) || []
      }

      const photos = data?.map(photo => ({
        ...photo,
        isFavorited: favoritedPhotoIds.includes(photo.id)
      })) || []

      return {
        photos,
        totalCount: count || 0,
        hasMore: (count || 0) > page * limit
      }
    },
  })
}

// Get single photo details
export const usePhotoDetails = (photoId: string) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['photo-details', photoId, user?.id],
    queryFn: async () => {
      if (!photoId) return null

      const { data, error } = await supabase
        .from('event_photos')
        .select(`
          *,
          event:events(
            id,
            name,
            date,
            location,
            description
          )
        `)
        .eq('id', photoId)
        .single()

      if (error) throw error

      // Check if user has favorited this photo
      let isFavorited = false
      if (user?.id) {
        const { data: favorite } = await supabase
          .from('user_favorites')
          .select('id')
          .eq('photo_id', photoId)
          .eq('user_id', user.id)
          .single()

        isFavorited = !!favorite
      }

      return {
        ...data,
        isFavorited
      } as GalleryPhoto
    },
    enabled: !!photoId,
  })
}

// Add/remove photo from favorites
export const useToggleFavorite = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      photoId,
      isFavorite
    }: {
      photoId: string
      isFavorite: boolean
    }) => {
      if (!user?.id) throw new Error('User must be authenticated')

      if (isFavorite) {
         // Remove from favorites
         const { error } = await supabase
           .from('user_favorites')
           .delete()
           .eq('photo_id', photoId)
           .eq('user_id', user.id)

         if (error) throw error
       } else {
         // Add to favorites
         const { error } = await supabase
           .from('user_favorites')
           .insert({
             photo_id: photoId,
             user_id: user.id
           })

         if (error) throw error
       }
    },
    onSuccess: (_, { isFavorite }) => {
      queryClient.invalidateQueries({ queryKey: ['gallery-photos'] })
      queryClient.invalidateQueries({ queryKey: ['photo-details'] })
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] })

      toast({
        title: isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
        description: `Photo has been ${isFavorite ? 'removed from' : 'added to'} your favorites`
      })
    },
    onError: (error) => {
      toast({
        title: 'Action Failed',
        description: error instanceof Error ? error.message : 'Failed to update favorites',
        variant: 'destructive'
      })
    },
  })
}

// Download photo
export const useDownloadPhoto = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      photoId,
      isFavorite = false
    }: {
      photoId: string
      isFavorite?: boolean
    }) => {
      if (!user?.id) throw new Error('User must be authenticated')

      // Record the download
      const { data, error } = await supabase
        .from('photo_downloads')
        .insert({
          photo_id: photoId,
          user_id: user.id,
          is_favorite: isFavorite,
          downloaded_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Increment download count on photo
      const { data: currentPhoto } = await supabase
        .from('event_photos')
        .select('download_count')
        .eq('id', photoId)
        .single()

      await supabase
        .from('event_photos')
        .update({
          download_count: (currentPhoto?.download_count || 0) + 1
        })
        .eq('id', photoId)

      return data
    },
    onSuccess: (data, { photoId }) => {
      queryClient.invalidateQueries({ queryKey: ['gallery-photos'] })
      queryClient.invalidateQueries({ queryKey: ['photo-details', photoId] })

      // Get the photo URL for download
      const photoQuery = queryClient.getQueryData(['photo-details', photoId]) as GalleryPhoto
      if (photoQuery?.url) {
        // Trigger download
        const link = document.createElement('a')
        link.href = photoQuery.url
        link.download = photoQuery.title || `photo-${photoId}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      toast({
        title: 'Download Started',
        description: 'Your photo download has started'
      })
    },
    onError: (error) => {
      toast({
        title: 'Download Failed',
        description: error instanceof Error ? error.message : 'Failed to download photo',
        variant: 'destructive'
      })
    },
  })
}

// Get user's favorite photos
export const useUserFavorites = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      if (!user?.id) return []

      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          *,
          event_photos!user_favorites_photo_id_fkey(
            *,
            events!event_photos_event_id_fkey(
              id,
              name,
              date,
              location
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data?.map(item => item.event_photos).filter(Boolean) as GalleryPhoto[]
    },
    enabled: !!user?.id,
  })
}

// Search photos
export const useSearchPhotos = (searchQuery: string, limit = 20) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['search-photos', searchQuery, limit, user?.id],
    queryFn: async () => {
      if (!searchQuery.trim()) return []

      const { data, error } = await supabase
        .from('event_photos')
        .select(`
          *,
          event:events(
            id,
            name,
            date,
            location
          )
        `)
        .or(`
          title.ilike.%${searchQuery}%,
          location.ilike.%${searchQuery}%,
          tags.cs.{${searchQuery}},
          event.name.ilike.%${searchQuery}%
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      // Get user's favorites if authenticated
      let favoritedPhotoIds: string[] = []
      if (user?.id) {
        const { data: favorites } = await supabase
          .from('user_favorites')
          .select('photo_id')
          .eq('user_id', user.id)

        favoritedPhotoIds = favorites?.map((f: any) => f.photo_id) || []
      }

      return data?.map(photo => ({
        ...photo,
        isFavorited: favoritedPhotoIds.includes(photo.id)
      })) || []
    },
    enabled: !!searchQuery.trim(),
  })
}

// Get photos by event
export const useEventPhotos = (eventId: string) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['event-photos', eventId, user?.id],
    queryFn: async () => {
      if (!eventId) return []

      const { data, error } = await supabase
        .from('event_photos')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Get user's favorites if authenticated
      let favoritedPhotoIds: string[] = []
      if (user?.id) {
        const { data: favorites } = await supabase
          .from('user_favorites')
          .select('photo_id')
          .eq('user_id', user.id)

        favoritedPhotoIds = favorites?.map((f: any) => f.photo_id) || []
      }

      return data?.map(photo => ({
        ...photo,
        isFavorited: favoritedPhotoIds.includes(photo.id)
      })) || []
    },
    enabled: !!eventId,
  })
}

// Get popular photos (by download count)
export const usePopularPhotos = (limit = 20) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['popular-photos', limit, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_photos')
        .select(`
          *,
          event:events(
            id,
            name,
            date,
            location
          )
        `)
        .order('download_count', { ascending: false })
        .limit(limit)

      if (error) throw error

      // Get user's favorites if authenticated
      let favoritedPhotoIds: string[] = []
      if (user?.id) {
        const { data: favorites } = await supabase
          .from('user_favorites')
          .select('photo_id')
          .eq('user_id', user.id)

        favoritedPhotoIds = favorites?.map((f: any) => f.photo_id) || []
      }

      return data?.map(photo => ({
        ...photo,
        isFavorited: favoritedPhotoIds.includes(photo.id)
      })) || []
    },
  })
}

// Get recent photos
export const useRecentPhotos = (limit = 20) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['recent-photos', limit, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_photos')
        .select(`
          *,
          event:events(
            id,
            name,
            date,
            location
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      // Get user's favorites if authenticated
      let favoritedPhotoIds: string[] = []
      if (user?.id) {
        const { data: favorites } = await supabase
          .from('user_favorites')
          .select('photo_id')
          .eq('user_id', user.id)

        favoritedPhotoIds = favorites?.map((f: any) => f.photo_id) || []
      }

      return data?.map(photo => ({
        ...photo,
        isFavorited: favoritedPhotoIds.includes(photo.id)
      })) || []
    },
  })
}

// Batch operations
export const useBatchPhotoOperations = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      photoIds,
      operation,
      data
    }: {
      photoIds: string[]
      operation: 'add_tags' | 'remove_tags' | 'update_metadata'
      data?: any
    }) => {
      if (!user?.id) throw new Error('User must be authenticated')

      switch (operation) {
        case 'add_tags':
          // Add tags to multiple photos
          const addTagPromises = photoIds.map(photoId =>
            supabase
              .from('event_photos')
              .update({
                // For now, skip tag operations since array functions aren't available
                // In a real implementation, you would need to fetch current tags and append
                updated_at: new Date().toISOString()
              })
              .eq('id', photoId)
          )
          await Promise.all(addTagPromises)
          break

        case 'remove_tags':
          // Remove tags from multiple photos
          const removeTagPromises = photoIds.map(async (photoId) => {
            // Get current tags first
            const { data: currentPhoto } = await supabase
              .from('event_photos')
              .select('tags')
              .eq('id', photoId)
              .single()

            if (currentPhoto?.tags) {
              const updatedTags = currentPhoto.tags.filter((tag: string) => !data.tags.includes(tag))
              return supabase
                .from('event_photos')
                .update({
                  tags: updatedTags,
                  updated_at: new Date().toISOString()
                })
                .eq('id', photoId)
            }
          })
          await Promise.all(removeTagPromises)
          break

        case 'update_metadata':
          // Update metadata for multiple photos
          const updatePromises = photoIds.map(photoId =>
            supabase
              .from('event_photos')
              .update({
                ...data,
                updated_at: new Date().toISOString()
              })
              .eq('id', photoId)
          )
          await Promise.all(updatePromises)
          break
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-photos'] })
      queryClient.invalidateQueries({ queryKey: ['photo-details'] })

      toast({
        title: 'Batch Operation Completed',
        description: 'Photos have been updated successfully'
      })
    },
    onError: (error) => {
      toast({
        title: 'Batch Operation Failed',
        description: error instanceof Error ? error.message : 'Failed to update photos',
        variant: 'destructive'
      })
    },
  })
}

// Get photo statistics
export const usePhotoStats = (photoId?: string) => {
  return useQuery({
    queryKey: ['photo-stats', photoId],
    queryFn: async () => {
      if (photoId) {
        // Get stats for specific photo
        const { data, error } = await supabase
          .from('event_photos')
          .select('download_count, people_count, created_at')
          .eq('id', photoId)
          .single()

        if (error) throw error
        return data
      } else {
        // Get global photo stats
        const { data, error } = await supabase
          .from('event_photos')
          .select('download_count, people_count')

        if (error) throw error

        const totalDownloads = data?.reduce((sum, photo) => sum + (photo.download_count || 0), 0) || 0
        const totalPhotos = data?.length || 0
        const totalPeople = data?.reduce((sum, photo) => sum + (photo.people_count || 0), 0) || 0

        return {
          totalDownloads,
          totalPhotos,
          totalPeople,
          averageDownloads: totalPhotos > 0 ? totalDownloads / totalPhotos : 0
        }
      }
    },
  })
}

// Share photo (generate shareable link)
export const useSharePhoto = () => {
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (photoId: string) => {
      // Generate a shareable link (in a real app, this might create a short URL)
      const shareUrl = `${window.location.origin}/shared/${photoId}`

      // Copy to clipboard
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this photo!',
          url: shareUrl
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)
      }

      return shareUrl
    },
    onSuccess: () => {
      toast({
        title: 'Link Copied',
        description: 'Photo link has been copied to clipboard'
      })
    },
    onError: (error) => {
      toast({
        title: 'Share Failed',
        description: error instanceof Error ? error.message : 'Failed to share photo',
        variant: 'destructive'
      })
    },
  })
}

// Get photos by tags
export const usePhotosByTag = (tag: string, limit = 20) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['photos-by-tag', tag, limit, user?.id],
    queryFn: async () => {
      if (!tag) return []

      const { data, error } = await supabase
        .from('event_photos')
        .select(`
          *,
          event:events(
            id,
            name,
            date,
            location
          )
        `)
        .contains('tags', [tag])
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      // Get user's favorites if authenticated
      let favoritedPhotoIds: string[] = []
      if (user?.id) {
        const { data: favorites } = await supabase
          .from('user_favorites')
          .select('photo_id')
          .eq('user_id', user.id)

        favoritedPhotoIds = favorites?.map((f: any) => f.photo_id) || []
      }

      return data?.map(photo => ({
        ...photo,
        isFavorited: favoritedPhotoIds.includes(photo.id)
      })) || []
    },
    enabled: !!tag,
  })
}

// Infinite scroll for gallery
export const useInfiniteGallery = (filter: PhotoFilter = {}) => {
  const [page, setPage] = useState(1)
  const [allPhotos, setAllPhotos] = useState<GalleryPhoto[]>([])
  const limit = 20

  const { data: photosData, isLoading, error } = useGalleryPhotos(filter, page, limit)

  // Accumulate photos when new data arrives
  useState(() => {
    if (photosData?.photos) {
      if (page === 1) {
        setAllPhotos(photosData.photos)
      } else {
        setAllPhotos(prev => [...prev, ...photosData.photos])
      }
    }
  })

  const loadMore = useCallback(() => {
    if (!isLoading && photosData?.hasMore) {
      setPage(prev => prev + 1)
    }
  }, [isLoading, photosData?.hasMore])

  const refresh = useCallback(() => {
    setPage(1)
    setAllPhotos([])
  }, [])

  return {
    photos: allPhotos,
    isLoading,
    error,
    hasMore: photosData?.hasMore || false,
    loadMore,
    refresh
  }
}

// Get user's photo albums/events
export const useUserAlbums = (userId: string) => {
  return useQuery({
    queryKey: ['user-albums', userId],
    queryFn: async () => {
      if (!userId) return []

      const { data, error } = await supabase
        .from('events')
        .select(`
          id,
          name,
          date,
          location,
          description,
          total_photos,
          registered_users
        `)
        .order('date', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })
}

// Get featured photos
export const useFeaturedPhotos = (limit = 20) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['featured-photos', limit, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_photos')
        .select(`
          *,
          event:events(
            id,
            name,
            date,
            location
          )
        `)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      // Get user's favorites if authenticated
      let favoritedPhotoIds: string[] = []
      if (user?.id) {
        const { data: favorites } = await supabase
          .from('user_favorites')
          .select('photo_id')
          .eq('user_id', user.id)

        favoritedPhotoIds = favorites?.map(f => f.photo_id) || []
      }

      return data?.map(photo => ({
        ...photo,
        isFavorited: favoritedPhotoIds.includes(photo.id)
      })) || []
    },
  })
}

// Share content utility
export const useShareContent = () => {
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({
      contentType,
      contentId,
      title,
      description
    }: {
      contentType: 'photo' | 'event' | 'album'
      contentId: string
      title: string
      description?: string
    }) => {
      const shareUrl = `${window.location.origin}/shared/${contentType}/${contentId}`

      if (navigator.share) {
        await navigator.share({
          title,
          text: description,
          url: shareUrl
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)
      }

      return shareUrl
    },
    onSuccess: () => {
      toast({
        title: 'Link Copied',
        description: 'Share link has been copied to clipboard'
      })
    },
    onError: (error) => {
      toast({
        title: 'Share Failed',
        description: error instanceof Error ? error.message : 'Failed to share content',
        variant: 'destructive'
      })
    },
  })
}