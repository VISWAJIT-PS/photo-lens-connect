import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useToast, toast } from '@/hooks/use-toast'

export interface EventRegistrationData {
  eventId: string
  userName: string
  email: string
  phoneNumber?: string
  whatsappNumber?: string
  photos: File[]
  preferences?: {
    notificationsEnabled: boolean
    photoSharingEnabled: boolean
    marketingEmails: boolean
  }
}

export interface FaceRecognitionResult {
  success: boolean
  matches: Array<{
    photoId: string
    userId: string
    confidence: number
    boundingBox: {
      x: number
      y: number
      width: number
      height: number
    }
  }>
  processingTime: number
}

// Register user for an event
export const useEventRegistration = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (registrationData: EventRegistrationData) => {
      if (!user?.id) throw new Error('User must be authenticated to register for events')

      // First, register the user for the event
      const { data: eventUser, error: eventUserError } = await supabase
        .from('event_users')
        .insert({
          id: user.id,
          event_id: registrationData.eventId,
          name: registrationData.userName,
          phone_number: registrationData.phoneNumber,
          whatsapp_number: registrationData.whatsappNumber
        })
        .select()
        .single()

      if (eventUserError) throw eventUserError

      // Upload photos and process face recognition
      const faceRecognitionResults: FaceRecognitionResult[] = []

      for (const photo of registrationData.photos) {
        // Upload photo to storage
        const fileExt = photo.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `event-uploads/${registrationData.eventId}/${user.id}/${fileName}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('EVENT_PHOTOS')
          .upload(filePath, photo)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('EVENT_PHOTOS')
          .getPublicUrl(filePath)

        // Create photo record
        const { data: photoRecord, error: photoError } = await supabase
          .from('event_photos')
          .insert({
            id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
            event_id: registrationData.eventId,
            url: urlData.publicUrl,
            title: photo.name,
            timestamp: new Date().toISOString(),
            people_count: 0
          })
          .select()
          .single()

        if (photoError) throw photoError

        // Process face recognition
        try {
          const faceResult = await processFaceRecognition(photo, photoRecord.id)
          faceRecognitionResults.push(faceResult)

          // Update photo with face recognition results
          await supabase
            .from('event_photos')
            .update({
              people_count: faceResult.matches.length
            })
            .eq('id', photoRecord.id)
        } catch (faceError) {
          console.error('Face recognition failed:', faceError)
          // Continue with registration even if face recognition fails
        }
      }

      return {
        eventUser,
        faceRecognitionResults,
        uploadedPhotos: registrationData.photos.length
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['event-users'] })
      queryClient.invalidateQueries({ queryKey: ['event-photos'] })
      queryClient.invalidateQueries({ queryKey: ['photo-matches'] })

      toast({
        title: 'Registration Successful',
        description: `Successfully registered for the event with ${data.uploadedPhotos} photos uploaded.`
      })
    },
    onError: (error) => {
      toast({
        title: 'Registration Failed',
        description: error instanceof Error ? error.message : 'Failed to register for event',
        variant: 'destructive'
      })
    },
  })
}

// Process face recognition on uploaded photo
const processFaceRecognition = async (photo: File, photoId: string): Promise<FaceRecognitionResult> => {
  const startTime = Date.now()

  try {
    // Convert file to base64 for processing
    const base64 = await fileToBase64(photo)

    // Call face recognition API (placeholder - would integrate with AWS Rekognition, Google Vision, etc.)
    const matches = await detectFaces(base64, photoId)

    return {
      success: true,
      matches,
      processingTime: Date.now() - startTime
    }
  } catch (error) {
    console.error('Face recognition error:', error)
    return {
      success: false,
      matches: [],
      processingTime: Date.now() - startTime
    }
  }
}

// Convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

// Detect faces in image (placeholder implementation)
const detectFaces = async (base64Image: string, photoId: string) => {
  // This is a placeholder implementation
  // In production, you would integrate with:
  // - AWS Rekognition
  // - Google Cloud Vision
  // - Azure Face API
  // - Or other face recognition services

  // For now, return mock data
  const mockMatches = [
    {
      photoId,
      userId: 'user-123', // Would be matched against existing users
      confidence: 0.95,
      boundingBox: {
        x: 100,
        y: 100,
        width: 150,
        height: 150
      }
    }
  ]

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  return mockMatches
}

// Get event registration status
export const useEventRegistrationStatus = (eventId: string) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['event-registration-status', eventId, user?.id],
    queryFn: async () => {
      if (!user?.id || !eventId) return null

      const { data, error } = await supabase
        .from('event_users')
        .select('*')
        .eq('event_id', eventId)
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    },
    enabled: !!user?.id && !!eventId,
  })
}

// Get user's uploaded photos for an event
export const useUserEventPhotos = (eventId: string) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['user-event-photos', eventId, user?.id],
    queryFn: async () => {
      if (!user?.id || !eventId) return []

      // First get user's event registration
      const { data: eventUser, error: eventUserError } = await supabase
        .from('event_users')
        .select('id')
        .eq('event_id', eventId)
        .eq('id', user.id)
        .single()

      if (eventUserError) throw eventUserError

      // Get photos uploaded by this user for this event
      const { data, error } = await supabase
        .from('event_photos')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!user?.id && !!eventId,
  })
}

// Update event registration preferences
export const useUpdateEventPreferences = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async ({
      eventId,
      preferences
    }: {
      eventId: string
      preferences: {
        notificationsEnabled?: boolean
        photoSharingEnabled?: boolean
        marketingEmails?: boolean
      }
    }) => {
      if (!user?.id) throw new Error('User must be authenticated')

      const { data, error } = await supabase
        .from('event_users')
        .update({
          notifications_enabled: preferences.notificationsEnabled,
          preferences: preferences
        })
        .eq('event_id', eventId)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-registration-status'] })
      toast({
        title: 'Preferences Updated',
        description: 'Your event preferences have been updated'
      })
    },
  })
}

// Upload additional photos to existing event registration
export const useUploadEventPhotos = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      eventId,
      photos
    }: {
      eventId: string
      photos: File[]
    }) => {
      if (!user?.id) throw new Error('User must be authenticated')

      const uploadResults = []

      for (const photo of photos) {
        const fileExt = photo.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `event-uploads/${eventId}/${user.id}/${fileName}`

        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('EVENT_PHOTOS')
          .upload(filePath, photo)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('EVENT_PHOTOS')
          .getPublicUrl(filePath)

        // Create photo record
        const { data: photoRecord, error: photoError } = await supabase
          .from('event_photos')
          .insert({
            id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
            event_id: eventId,
            url: urlData.publicUrl,
            title: photo.name,
            timestamp: new Date().toISOString(),
            people_count: 0
          })
          .select()
          .single()

        if (photoError) throw photoError

        uploadResults.push(photoRecord)
      }

      return uploadResults
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-event-photos'] })
      queryClient.invalidateQueries({ queryKey: ['event-photos'] })

      toast({
        title: 'Photos Uploaded',
        description: `Successfully uploaded ${data.length} additional photos`
      })
    },
    onError: (error) => {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload photos',
        variant: 'destructive'
      })
    },
  })
}

// Get face recognition matches for user's photos
export const useUserPhotoMatches = () => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['user-photo-matches', user?.id],
    queryFn: async () => {
      if (!user?.id) return []

      const { data, error } = await supabase
        .from('photo_matches')
        .select(`
          *,
          event_photos!inner (
            id,
            url,
            title,
            events!inner (
              name,
              date,
              location
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!user?.id,
  })
}

// Batch upload photos with progress tracking
export const useBatchPhotoUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentFile, setCurrentFile] = useState('')
  const { user } = useAuth()

  const uploadMutation = useMutation({
    mutationFn: async ({
      eventId,
      photos
    }: {
      eventId: string
      photos: File[]
    }) => {
      if (!user?.id) throw new Error('User must be authenticated')

      setUploadProgress(0)
      const results = []

      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i]
        setCurrentFile(photo.name)
        setUploadProgress((i / photos.length) * 100)

        const fileExt = photo.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `event-uploads/${eventId}/${user.id}/${fileName}`

        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('EVENT_PHOTOS')
          .upload(filePath, photo)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('EVENT_PHOTOS')
          .getPublicUrl(filePath)

        // Create photo record
        const { data: photoRecord, error: photoError } = await supabase
          .from('event_photos')
          .insert({
            id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
            event_id: eventId,
            url: urlData.publicUrl,
            title: photo.name,
            timestamp: new Date().toISOString(),
            people_count: 0
          })
          .select()
          .single()

        if (photoError) throw photoError

        results.push(photoRecord)
      }

      setUploadProgress(100)
      return results
    },
  })

  return {
    ...uploadMutation,
    uploadProgress,
    currentFile
  }
}