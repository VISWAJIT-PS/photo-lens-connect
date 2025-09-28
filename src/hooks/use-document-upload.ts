import { useCallback, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useSupabaseUpload } from './use-supabase-upload'

interface DocumentUploadOptions {
  userId?: string
  category?: 'invoices' | 'contracts' | 'general' | 'portfolio'
  maxFiles?: number
  maxFileSize?: number
}

export const useDocumentUpload = (options: DocumentUploadOptions = {}) => {
  const {
    userId,
    category = 'general',
    maxFiles = 5,
    maxFileSize = 25 * 1024 * 1024, // 25MB
  } = options

  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  const uploadHook = useSupabaseUpload({
    bucketName: 'documents',
    path: userId ? `${category}/${userId}` : category,
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ],
    maxFileSize,
    maxFiles,
    cacheControl: 3600,
  })

  const uploadDocuments = useCallback(async () => {
    setUploadProgress({})

    // Set up real-time progress tracking
    const filesToUpload = uploadHook.files.filter(file =>
      !uploadHook.successes.includes(file.name)
    )

    for (const file of filesToUpload) {
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))
    }

    await uploadHook.onUpload()

    // If upload successful, save document metadata to database
    if (uploadHook.isSuccess && userId) {
      try {
        // For now, we'll just log the successful uploads
        // In a real implementation, you might want to create a documents table
        console.log('Documents uploaded successfully:', uploadHook.successes)

        // You could create a documents table to track uploaded files:
        /*
        const { data, error } = await supabase
          .from('documents')
          .insert(
            uploadHook.files
              .filter(file => uploadHook.successes.includes(file.name))
              .map(file => ({
                user_id: userId,
                category: category,
                file_name: file.name,
                file_size: file.size,
                mime_type: file.type,
                url: `/storage/v1/object/public/documents/${category}/${userId}/${file.name}`,
              }))
          )
        */

        return true
      } catch (error) {
        console.error('Error in document upload:', error)
        return false
      }
    }

    return uploadHook.isSuccess
  }, [uploadHook, userId, category])

  const deleteDocument = useCallback(async (fileName: string) => {
    if (!userId) return false

    try {
      const filePath = `${category}/${userId}/${fileName}`

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath])

      if (storageError) throw storageError

      return true
    } catch (error) {
      console.error('Error deleting document:', error)
      return false
    }
  }, [userId, category])

  const getDocumentUrl = useCallback((fileName: string) => {
    if (!userId) return null
    return `/storage/v1/object/public/documents/${category}/${userId}/${fileName}`
  }, [userId, category])

  return {
    ...uploadHook,
    uploadDocuments,
    deleteDocument,
    getDocumentUrl,
    uploadProgress,
  }
}