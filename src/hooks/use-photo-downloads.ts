import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Tables, TablesInsert } from '@/integrations/supabase/types'

type PhotoDownload = Tables<'photo_downloads'>
type PhotoDownloadInsert = TablesInsert<'photo_downloads'>

export const usePhotoDownloads = (photoId: string) => {
  return useQuery({
    queryKey: ['photo-downloads', photoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photo_downloads')
        .select('*')
        .eq('photo_id', photoId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!photoId,
  })
}

export const useDownloadPhoto = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      photoId,
      userId,
      downloadType = 'full',
      userAgent,
      ipAddress
    }: {
      photoId: string
      userId?: string
      downloadType?: string
      userAgent?: string
      ipAddress?: string
    }) => {
      const { data, error } = await supabase
        .from('photo_downloads')
        .insert({
          photo_id: photoId,
          user_id: userId,
          download_type: downloadType,
          user_agent: userAgent,
          ip_address: ipAddress,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['photo-downloads', data.photo_id] })
      queryClient.invalidateQueries({ queryKey: ['photo-details', data.photo_id] })
    },
  })
}

export const usePhotoDownloadStats = (photoId: string) => {
  return useQuery({
    queryKey: ['photo-download-stats', photoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photo_downloads')
        .select('download_type, created_at')
        .eq('photo_id', photoId)

      if (error) throw error

      const stats = {
        total: data.length,
        full: data.filter(d => d.download_type === 'full').length,
        thumbnail: data.filter(d => d.download_type === 'thumbnail').length,
        medium: data.filter(d => d.download_type === 'medium').length,
        recent: data.filter(d => {
          const downloadDate = new Date(d.created_at)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return downloadDate > weekAgo
        }).length,
      }

      return stats
    },
    enabled: !!photoId,
  })
}

export const useEventDownloadStats = (eventId: string) => {
  return useQuery({
    queryKey: ['event-download-stats', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photo_downloads')
        .select(`
          download_type,
          created_at,
          event_photos!inner(event_id)
        `)
        .eq('event_photos.event_id', eventId)

      if (error) throw error

      const stats = {
        total: data.length,
        full: data.filter(d => d.download_type === 'full').length,
        thumbnail: data.filter(d => d.download_type === 'thumbnail').length,
        medium: data.filter(d => d.download_type === 'medium').length,
        recent: data.filter(d => {
          const downloadDate = new Date(d.created_at)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return downloadDate > weekAgo
        }).length,
      }

      return stats
    },
    enabled: !!eventId,
  })
}