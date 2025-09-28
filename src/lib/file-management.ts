import { supabase } from '@/integrations/supabase/client'
import { STORAGE_BUCKETS } from './storage'

export interface FileMetadata {
  name: string
  size: number
  type: string
  lastModified: number
  url?: string
  path?: string
}

export interface FileOperationResult {
  success: boolean
  error?: string
  data?: any
}

export interface BulkFileOperationResult {
  successful: string[]
  failed: Array<{ name: string; error: string }>
  total: number
}

/**
 * Get all files from a storage bucket with optional prefix
 */
export const listFiles = async (
  bucketName: string,
  path?: string,
  limit = 100,
  offset = 0
): Promise<{ files: FileMetadata[]; error?: string }> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(path, {
        limit,
        offset,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (error) {
      return { files: [], error: error.message }
    }

    const files: FileMetadata[] = (data || []).map(file => ({
      name: file.name,
      size: 0, // Supabase doesn't provide size in list operation
      type: '', // Would need to be determined from file extension
      lastModified: new Date(file.created_at).getTime(),
      path: path ? `${path}/${file.name}` : file.name
    }))

    return { files }
  } catch (error) {
    return {
      files: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Delete files from storage bucket
 */
export const deleteFiles = async (
  bucketName: string,
  filePaths: string[]
): Promise<FileOperationResult> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove(filePaths)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Bulk delete files with error handling
 */
export const bulkDeleteFiles = async (
  bucketName: string,
  filePaths: string[]
): Promise<BulkFileOperationResult> => {
  const result: BulkFileOperationResult = {
    successful: [],
    failed: [],
    total: filePaths.length
  }

  // Process in batches to avoid overwhelming the API
  const batchSize = 10
  for (let i = 0; i < filePaths.length; i += batchSize) {
    const batch = filePaths.slice(i, i + batchSize)
    const batchResult = await deleteFiles(bucketName, batch)

    if (batchResult.success) {
      result.successful.push(...batch)
    } else {
      result.failed.push(...batch.map(name => ({ name, error: batchResult.error || 'Unknown error' })))
    }
  }

  return result
}

/**
 * Move or rename a file within the same bucket
 */
export const moveFile = async (
  bucketName: string,
  fromPath: string,
  toPath: string
): Promise<FileOperationResult> => {
  try {
    // First, copy the file to the new location
    const { data: copyData, error: copyError } = await supabase.storage
      .from(bucketName)
      .copy(fromPath, toPath)

    if (copyError) {
      return { success: false, error: copyError.message }
    }

    // Then delete the original file
    const deleteResult = await deleteFiles(bucketName, [fromPath])
    if (!deleteResult.success) {
      console.warn('Failed to delete original file after copy:', deleteResult.error)
      // Don't fail the operation if copy succeeded but delete failed
    }

    return { success: true, data: copyData }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Copy a file within the same bucket
 */
export const copyFile = async (
  bucketName: string,
  fromPath: string,
  toPath: string
): Promise<FileOperationResult> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .copy(fromPath, toPath)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Get public URL for a file
 */
export const getFilePublicUrl = (
  bucketName: string,
  filePath: string
): string => {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath)

  return data.publicUrl
}

/**
 * Get signed URL for private file access
 */
export const getFileSignedUrl = async (
  bucketName: string,
  filePath: string,
  expiresIn = 3600
): Promise<{ url?: string; error?: string }> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, expiresIn)

    if (error) {
      return { error: error.message }
    }

    return { url: data.signedUrl }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Upload file with progress tracking
 */
export const uploadFileWithProgress = async (
  bucketName: string,
  filePath: string,
  file: File,
  options?: {
    cacheControl?: string
    upsert?: boolean
    onProgress?: (progress: number) => void
  }
): Promise<FileOperationResult> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: options?.cacheControl,
        upsert: options?.upsert,
      })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Create a folder/directory in a bucket
 */
export const createFolder = async (
  bucketName: string,
  folderPath: string
): Promise<FileOperationResult> => {
  try {
    // Create a placeholder file to represent the folder
    const placeholderFile = new File([''], '.folder', { type: 'text/plain' })
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(`${folderPath}/.folder`, placeholderFile, {
        upsert: true
      })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Check if a file exists in a bucket
 */
export const fileExists = async (
  bucketName: string,
  filePath: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(filePath.split('/').slice(0, -1).join('/'), {
        limit: 1,
        search: filePath.split('/').pop()
      })

    return !error && (data || []).length > 0
  } catch {
    return false
  }
}

/**
 * Get file metadata and info
 */
export const getFileInfo = async (
  bucketName: string,
  filePath: string
): Promise<{ info?: FileMetadata; error?: string }> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(filePath.split('/').slice(0, -1).join('/'), {
        limit: 1,
        search: filePath.split('/').pop()
      })

    if (error) {
      return { error: error.message }
    }

    const file = data?.[0]
    if (!file) {
      return { error: 'File not found' }
    }

    const info: FileMetadata = {
      name: file.name,
      size: 0, // Not available from list API
      type: '', // Would need to be determined from extension
      lastModified: new Date(file.created_at).getTime(),
      path: filePath
    }

    return { info }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Clean up old files based on age
 */
export const cleanupOldFiles = async (
  bucketName: string,
  path: string,
  olderThanDays: number
): Promise<BulkFileOperationResult> => {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

    const { files, error } = await listFiles(bucketName, path)
    if (error) {
      return {
        successful: [],
        failed: [{ name: 'list-operation', error }],
        total: 0
      }
    }

    const oldFiles = files.filter(file =>
      new Date(file.lastModified) < cutoffDate
    )

    if (oldFiles.length === 0) {
      return { successful: [], failed: [], total: 0 }
    }

    const filePaths = oldFiles.map(file => file.path || file.name)
    return await bulkDeleteFiles(bucketName, filePaths)
  } catch (error) {
    return {
      successful: [],
      failed: [{ name: 'cleanup-operation', error: error instanceof Error ? error.message : 'Unknown error' }],
      total: 0
    }
  }
}

/**
 * Organize files by moving them to date-based folders
 */
export const organizeFilesByDate = async (
  bucketName: string,
  sourcePath: string,
  targetBasePath: string
): Promise<BulkFileOperationResult> => {
  try {
    const { files, error } = await listFiles(bucketName, sourcePath)
    if (error) {
      return {
        successful: [],
        failed: [{ name: 'list-operation', error }],
        total: 0
      }
    }

    const result: BulkFileOperationResult = {
      successful: [],
      failed: [],
      total: files.length
    }

    for (const file of files) {
      const fileDate = new Date(file.lastModified)
      const datePath = `${targetBasePath}/${fileDate.getFullYear()}/${String(fileDate.getMonth() + 1).padStart(2, '0')}/${String(fileDate.getDate()).padStart(2, '0')}`

      // Create date folder if it doesn't exist
      await createFolder(bucketName, datePath)

      // Move file to date folder
      const sourceFilePath = file.path || file.name
      const targetFilePath = `${datePath}/${file.name}`

      const moveResult = await moveFile(bucketName, sourceFilePath, targetFilePath)
      if (moveResult.success) {
        result.successful.push(file.name)
      } else {
        result.failed.push({ name: file.name, error: moveResult.error || 'Move failed' })
      }
    }

    return result
  } catch (error) {
    return {
      successful: [],
      failed: [{ name: 'organize-operation', error: error instanceof Error ? error.message : 'Unknown error' }],
      total: 0
    }
  }
}

/**
 * Batch operations for multiple files
 */
export const batchFileOperation = async <T>(
  files: Array<{ path: string; data?: any }>,
  operation: (filePath: string, data?: any) => Promise<FileOperationResult>,
  concurrency = 5
): Promise<BulkFileOperationResult> => {
  const result: BulkFileOperationResult = {
    successful: [],
    failed: [],
    total: files.length
  }

  // Process files in batches to control concurrency
  for (let i = 0; i < files.length; i += concurrency) {
    const batch = files.slice(i, i + concurrency)

    const batchPromises = batch.map(async (file) => {
      const operationResult = await operation(file.path, file.data)

      if (operationResult.success) {
        return { name: file.path, success: true }
      } else {
        return { name: file.path, success: false, error: operationResult.error || 'Operation failed' }
      }
    })

    const batchResults = await Promise.all(batchPromises)

    batchResults.forEach(batchResult => {
      if (batchResult.success) {
        result.successful.push(batchResult.name)
      } else {
        result.failed.push({ name: batchResult.name, error: batchResult.error || 'Unknown error' })
      }
    })
  }

  return result
}

/**
 * Utility to get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || ''
}

/**
 * Utility to get MIME type from file extension
 */
export const getMimeTypeFromExtension = (extension: string): string => {
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain',
    'json': 'application/json',
    'csv': 'text/csv',
    'mp4': 'video/mp4',
    'mp3': 'audio/mpeg',
    'zip': 'application/zip'
  }

  return mimeTypes[extension] || 'application/octet-stream'
}

/**
 * Validate file before upload
 */
export const validateFileForUpload = (
  file: File,
  options: {
    maxSize?: number
    allowedTypes?: string[]
    allowedExtensions?: string[]
  } = {}
): { isValid: boolean; error?: string } => {
  const { maxSize, allowedTypes = [], allowedExtensions = [] } = options

  // Check file size
  if (maxSize && file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${Math.round(maxSize / 1024 / 1024)}MB`
    }
  }

  // Check MIME type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed`
    }
  }

  // Check file extension
  if (allowedExtensions.length > 0) {
    const extension = getFileExtension(file.name)
    if (!allowedExtensions.includes(extension)) {
      return {
        isValid: false,
        error: `File extension .${extension} is not allowed`
      }
    }
  }

  return { isValid: true }
}