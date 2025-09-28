import { supabase } from '@/integrations/supabase/client'

export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  EVENT_PHOTOS: 'event-photos',
  DOCUMENTS: 'documents',
  PORTFOLIO: 'portfolio',
} as const

export const setupStorageBuckets = async () => {
  const buckets = [
    {
      name: STORAGE_BUCKETS.AVATARS,
      public: false,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    },
    {
      name: STORAGE_BUCKETS.EVENT_PHOTOS,
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    },
    {
      name: STORAGE_BUCKETS.DOCUMENTS,
      public: false,
      fileSizeLimit: 26214400, // 25MB
      allowedMimeTypes: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
      ],
    },
    {
      name: STORAGE_BUCKETS.PORTFOLIO,
      public: true,
      fileSizeLimit: 10485760, // 10MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    },
  ]

  for (const bucket of buckets) {
    try {
      // Check if bucket exists
      const { data: existingBuckets } = await supabase.storage.listBuckets()
      const bucketExists = existingBuckets?.some(b => b.name === bucket.name)

      if (!bucketExists) {
        const { error } = await supabase.storage.createBucket(bucket.name, {
          public: bucket.public,
          fileSizeLimit: bucket.fileSizeLimit,
          allowedMimeTypes: bucket.allowedMimeTypes,
        })

        if (error) {
          console.error(`Error creating bucket ${bucket.name}:`, error)
        } else {
          console.log(`Created storage bucket: ${bucket.name}`)
        }
      } else {
        console.log(`Storage bucket already exists: ${bucket.name}`)
      }
    } catch (error) {
      console.error(`Error setting up bucket ${bucket.name}:`, error)
    }
  }
}

export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}

export const getSignedUrl = async (bucket: string, path: string, expiresIn = 3600) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn)

  if (error) {
    console.error('Error creating signed URL:', error)
    return null
  }

  return data.signedUrl
}

export const uploadFile = async (
  bucket: string,
  path: string,
  file: File,
  options?: {
    cacheControl?: string
    upsert?: boolean
  }
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, options)

  if (error) {
    throw error
  }

  return data
}

export const deleteFile = async (bucket: string, paths: string[]) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .remove(paths)

  if (error) {
    throw error
  }

  return data
}