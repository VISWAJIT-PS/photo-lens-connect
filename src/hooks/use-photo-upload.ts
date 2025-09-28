import { useCallback, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useSupabaseUpload } from './use-supabase-upload'
import { STORAGE_BUCKETS } from '@/lib/storage'

interface PhotoUploadOptions {
  eventId?: string
  userId?: string
  maxFileSize?: number
  enableFaceRecognition?: boolean
}

export const usePhotoUpload = (options: PhotoUploadOptions = {}) => {
  const {
    eventId,
    userId,
    maxFileSize = 10 * 1024 * 1024, // 10MB
    enableFaceRecognition = true,
  } = options

  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const uploadHook = useSupabaseUpload({
    bucketName: STORAGE_BUCKETS.EVENT_PHOTOS,
    path: eventId ? `events/${eventId}` : 'general',
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxFileSize,
    maxFiles: 10,
    cacheControl: 3600,
    enableImageOptimization: true,
    imageCompressionOptions: {
      maxSizeMB: 2,
      maxWidthOrHeight: 2048,
      useWebWorker: true,
      preserveExif: false,
    },
  })

  const uploadPhotos = useCallback(async () => {
    setUploadProgress(0)
    setIsProcessing(false)

    await uploadHook.onUpload()

    if (uploadHook.isSuccess && uploadHook.successes.length > 0) {
      setIsProcessing(true)
      try {
        const uploadedPhotos = []

        for (const fileName of uploadHook.successes) {
          const file = uploadHook.files.find(f => f.name === fileName)

          if (file && eventId && userId) {
            // Create photo record in database
            const photoUrl = `/storage/v1/object/public/${STORAGE_BUCKETS.EVENT_PHOTOS}/${eventId}/${file.name}`

            const { data: photoData, error: photoError } = await supabase
              .from('event_photos')
              .insert({
                id: crypto.randomUUID(),
                event_id: eventId,
                url: photoUrl,
                title: file.name,
                file_size: file.size,
                mime_type: file.type,
                is_public: false,
              })
              .select()
              .single()

            if (photoError) {
              console.error('Error creating photo record:', photoError)
              continue
            }

            uploadedPhotos.push(photoData)

            // Queue for face recognition if enabled
            if (enableFaceRecognition) {
              await supabase
                .from('photo_matching_queue')
                .insert({
                  photo_id: photoData.id,
                  priority: 5,
                })
            }
          }
        }

        setUploadProgress(100)
        setIsProcessing(false)
        return uploadedPhotos
      } catch (error) {
        console.error('Error in photo upload processing:', error)
        setIsProcessing(false)
        return false
      }
    }

    return uploadHook.isSuccess
  }, [uploadHook, eventId, userId, enableFaceRecognition])

  const deletePhoto = useCallback(async (photoId: string) => {
    if (!photoId) return false

    try {
      // Get photo details first
      const { data: photo, error: fetchError } = await supabase
        .from('event_photos')
        .select('url')
        .eq('id', photoId)
        .single()

      if (fetchError) throw fetchError

      if (photo.url) {
        // Extract file path from URL
        const url = new URL(photo.url)
        const filePath = url.pathname.split(`/storage/v1/object/public/${STORAGE_BUCKETS.EVENT_PHOTOS}/`)[1]

        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from(STORAGE_BUCKETS.EVENT_PHOTOS)
          .remove([filePath])

        if (storageError) throw storageError

        // Delete from database
        const { error: dbError } = await supabase
          .from('event_photos')
          .delete()
          .eq('id', photoId)

        if (dbError) throw dbError
      }

      return true
    } catch (error) {
      console.error('Error deleting photo:', error)
      return false
    }
  }, [])

  return {
    ...uploadHook,
    uploadPhotos,
    deletePhoto,
    uploadProgress,
    isProcessing,
  }
}