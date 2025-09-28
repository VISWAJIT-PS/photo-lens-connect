import { useCallback, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useSupabaseUpload } from './use-supabase-upload'

interface AvatarUploadOptions {
  userId?: string
  maxFileSize?: number
}

export const useAvatarUpload = (options: AvatarUploadOptions = {}) => {
  const {
    userId,
    maxFileSize = 5 * 1024 * 1024, // 5MB
  } = options

  const [uploadProgress, setUploadProgress] = useState<number>(0)

  const uploadHook = useSupabaseUpload({
    bucketName: 'avatars',
    path: userId ? `users/${userId}` : 'general',
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxFileSize,
    maxFiles: 1,
    cacheControl: 3600,
  })

  const uploadAvatar = useCallback(async () => {
    setUploadProgress(0)

    await uploadHook.onUpload()

    if (uploadHook.isSuccess && uploadHook.successes.length > 0 && userId) {
      try {
        const fileName = uploadHook.successes[0]
        const file = uploadHook.files.find(f => f.name === fileName)

        if (file) {
          const avatarUrl = `/storage/v1/object/public/avatars/${userId ? `users/${userId}/` : 'general/'}${file.name}`

          // Update user profile with new avatar URL
          const { error } = await supabase
            .from('event_users')
            .update({ profile_photo_url: avatarUrl })
            .eq('id', userId)

          if (error) {
            console.error('Error updating avatar URL:', error)
            return false
          }

          setUploadProgress(100)
          return true
        }
      } catch (error) {
        console.error('Error in avatar upload:', error)
        return false
      }
    }

    return uploadHook.isSuccess
  }, [uploadHook, userId])

  const deleteAvatar = useCallback(async () => {
    if (!userId) return false

    try {
      // Get current avatar URL
      const { data: user, error: fetchError } = await supabase
        .from('event_users')
        .select('profile_photo_url')
        .eq('id', userId)
        .single()

      if (fetchError) throw fetchError

      if (user.profile_photo_url) {
        // Extract file path from URL
        const url = new URL(user.profile_photo_url)
        const filePath = url.pathname.split('/storage/v1/object/public/avatars/')[1]

        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('avatars')
          .remove([filePath])

        if (storageError) throw storageError

        // Update user profile to remove avatar URL
        const { error: dbError } = await supabase
          .from('event_users')
          .update({ profile_photo_url: null })
          .eq('id', userId)

        if (dbError) throw dbError
      }

      return true
    } catch (error) {
      console.error('Error deleting avatar:', error)
      return false
    }
  }, [userId])

  return {
    ...uploadHook,
    uploadAvatar,
    deleteAvatar,
    uploadProgress,
  }
}