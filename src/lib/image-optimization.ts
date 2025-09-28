import imageCompression from 'browser-image-compression'

export interface ImageCompressionOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
  preserveExif?: boolean
  onProgress?: (progress: number) => void
}

export const defaultCompressionOptions: ImageCompressionOptions = {
  maxSizeMB: 1, // Maximum file size in MB
  maxWidthOrHeight: 1920, // Maximum width or height
  useWebWorker: true,
  preserveExif: false,
}

export const compressImage = async (
  file: File,
  options: ImageCompressionOptions = {}
): Promise<File> => {
  const opts = { ...defaultCompressionOptions, ...options }

  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: opts.maxSizeMB,
      maxWidthOrHeight: opts.maxWidthOrHeight,
      useWebWorker: opts.useWebWorker,
      preserveExif: opts.preserveExif,
      onProgress: opts.onProgress,
    })

    return compressedFile
  } catch (error) {
    console.error('Error compressing image:', error)
    throw new Error('Failed to compress image')
  }
}

export const compressImages = async (
  files: File[],
  options: ImageCompressionOptions = {}
): Promise<File[]> => {
  const compressionPromises = files.map(file => compressImage(file, options))
  return Promise.all(compressionPromises)
}

export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    }
  }

  // Check file size (max 50MB)
  const maxSize = 50 * 1024 * 1024 // 50MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size too large. Maximum size is 50MB.',
    }
  }

  return { isValid: true }
}

export const generateThumbnail = async (
  file: File,
  size: { width: number; height: number } = { width: 300, height: 300 }
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Canvas context not available'))
      return
    }

    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      // Calculate dimensions to fit within size while maintaining aspect ratio
      const { width, height } = size
      let { naturalWidth, naturalHeight } = img

      if (naturalWidth > naturalHeight) {
        if (naturalWidth > width) {
          naturalHeight = (naturalHeight * width) / naturalWidth
          naturalWidth = width
        }
      } else {
        if (naturalHeight > height) {
          naturalWidth = (naturalWidth * height) / naturalHeight
          naturalHeight = height
        }
      }

      canvas.width = naturalWidth
      canvas.height = naturalHeight

      // Draw and compress
      ctx.drawImage(img, 0, 0, naturalWidth, naturalHeight)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to generate thumbnail'))
            return
          }

          const thumbnailFile = new File([blob], `thumb_${file.name}`, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          })

          resolve(thumbnailFile)
        },
        'image/jpeg',
        0.8
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image for thumbnail generation'))
    }

    img.src = url
  })
}

export const getImageMetadata = (file: File): Promise<{
  width: number
  height: number
  aspectRatio: number
  fileSize: number
  fileType: string
}> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight,
        fileSize: file.size,
        fileType: file.type,
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image metadata'))
    }

    img.src = url
  })
}