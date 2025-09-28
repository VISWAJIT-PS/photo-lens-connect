import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Tables } from '@/integrations/supabase/types'
import { useEffect, useState } from 'react'

type FaceRecognitionResult = Tables<'face_recognition_results'>
type PhotoMatchingQueue = Tables<'photo_matching_queue'>

export const useFaceRecognitionResults = (photoId: string) => {
  return useQuery({
    queryKey: ['face-recognition-results', photoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('face_recognition_results')
        .select(`
          *,
          event_users!face_recognition_results_user_id_fkey (
            id,
            name,
            email
          )
        `)
        .eq('photo_id', photoId)
        .order('confidence_score', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!photoId,
  })
}

export const useUserPhotoMatches = (userId: string) => {
  return useQuery({
    queryKey: ['user-photo-matches', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('face_recognition_results')
        .select(`
          *,
          event_photos!face_recognition_results_photo_id_fkey (
            id,
            url,
            title,
            event_id,
            events!event_photos_event_id_fkey (
              id,
              name,
              location
            )
          )
        `)
        .eq('user_id', userId)
        .eq('is_verified', true)
        .order('confidence_score', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })
}

export const usePhotoMatchingQueue = () => {
  return useQuery({
    queryKey: ['photo-matching-queue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photo_matching_queue')
        .select(`
          *,
          event_photos!photo_matching_queue_photo_id_fkey (
            id,
            url,
            title,
            event_id,
            events!event_photos_event_id_fkey (
              id,
              name
            )
          )
        `)
        .in('status', ['pending', 'processing'])
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(100)

      if (error) throw error
      return data || []
    },
    refetchInterval: 5000, // Refetch every 5 seconds to check for new items
  })
}

export const useProcessFaceRecognition = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (photoId: string) => {
      // Call the database function to process face recognition
      const { data, error } = await supabase
        .from('photo_matching_queue')
        .insert({
          photo_id: photoId,
          priority: 5,
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photo-matching-queue'] })
    },
  })
}

export const useVerifyFaceMatch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      resultId,
      verifiedBy,
      isVerified
    }: {
      resultId: string
      verifiedBy: string
      isVerified: boolean
    }) => {
      const { data, error } = await supabase
        .from('face_recognition_results')
        .update({
          is_verified: isVerified,
          verified_by: verifiedBy,
          verified_at: new Date().toISOString()
        })
        .eq('id', resultId)
        .select()
        .single()

      if (error) throw error

      // Update user match count
      if (isVerified && data.user_id) {
        // First get current count
        const { data: userData } = await supabase
          .from('event_users')
          .select('matches_found')
          .eq('id', data.user_id)
          .single()

        const currentCount = userData?.matches_found || 0

        await supabase
          .from('event_users')
          .update({
            matches_found: currentCount + 1
          })
          .eq('id', data.user_id)
      }

      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['face-recognition-results', data.photo_id] })
      queryClient.invalidateQueries({ queryKey: ['user-photo-matches', data.user_id] })
    },
  })
}

export const useRejectFaceMatch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (resultId: string) => {
      const { error } = await supabase
        .from('face_recognition_results')
        .delete()
        .eq('id', resultId)

      if (error) throw error
      return resultId
    },
    onSuccess: (_, resultId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['face-recognition-results'] })
      queryClient.invalidateQueries({ queryKey: ['user-photo-matches'] })
    },
  })
}

// Real-time subscription for face recognition results
export const useRealtimeFaceRecognition = (photoId?: string) => {
  const [results, setResults] = useState<FaceRecognitionResult[]>([])
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!photoId) return

    const subscription = supabase
      .channel(`face-recognition:${photoId}`)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'face_recognition_results',
          filter: `photo_id=eq.${photoId}`
        },
        (payload) => {
          const newResult = payload.new as FaceRecognitionResult
          setResults(prev => [...prev, newResult])

          // Invalidate related queries
          queryClient.invalidateQueries({ queryKey: ['face-recognition-results', photoId] })
          queryClient.invalidateQueries({ queryKey: ['user-photo-matches', newResult.user_id] })
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'face_recognition_results',
          filter: `photo_id=eq.${photoId}`
        },
        (payload) => {
          const updatedResult = payload.new as FaceRecognitionResult
          setResults(prev =>
            prev.map(result =>
              result.id === updatedResult.id ? updatedResult : result
            )
          )

          // Invalidate related queries
          queryClient.invalidateQueries({ queryKey: ['face-recognition-results', photoId] })
          queryClient.invalidateQueries({ queryKey: ['user-photo-matches', updatedResult.user_id] })
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [photoId, queryClient])

  return { results }
}

// Real-time subscription for photo matching queue
export const useRealtimePhotoQueue = () => {
  const [queueItems, setQueueItems] = useState<PhotoMatchingQueue[]>([])
  const queryClient = useQueryClient()

  useEffect(() => {
    const subscription = supabase
      .channel('photo-matching-queue')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'photo_matching_queue'
        },
        (payload) => {
          const newItem = payload.new as PhotoMatchingQueue
          setQueueItems(prev => [...prev, newItem])
          queryClient.invalidateQueries({ queryKey: ['photo-matching-queue'] })
        }
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'photo_matching_queue'
        },
        (payload) => {
          const updatedItem = payload.new as PhotoMatchingQueue
          setQueueItems(prev =>
            prev.map(item =>
              item.id === updatedItem.id ? updatedItem : item
            )
          )
          queryClient.invalidateQueries({ queryKey: ['photo-matching-queue'] })
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient])

  return { queueItems }
}