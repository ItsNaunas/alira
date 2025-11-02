'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, File, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { conversionEvents } from '@/lib/analytics'

interface FileUploadProps {
  onExtractComplete: (extractedData: {
    business_idea?: string
    current_challenges?: string
    immediate_goals?: string
  }) => void
  onError?: (error: string) => void
  className?: string
  maxSizeMB?: number
  acceptedTypes?: string[]
}

export function FileUpload({
  onExtractComplete,
  onError,
  className,
  maxSizeMB = 10,
  acceptedTypes = ['.pdf', '.doc', '.docx']
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'extracting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const validateFile = (file: File): string | null => {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxSizeMB}MB limit`
    }

    // Check file type
    const fileName = file.name.toLowerCase()
    const isValidType = acceptedTypes.some(type => fileName.endsWith(type.toLowerCase()))
    if (!isValidType) {
      return `Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`
    }

    return null
  }

  const handleFile = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setErrorMessage(validationError)
      setUploadStatus('error')
      onError?.(validationError)
      return
    }

    setUploadedFile(file)
    setErrorMessage(null)
    setIsUploading(true)
    setUploadStatus('uploading')

    // Track file upload start
    const fileType = file.name.split('.').pop() || 'unknown'
    conversionEvents.fileUploadStarted(fileType, file.size)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)

      // Upload and extract text
      setUploadStatus('extracting')
      const response = await fetch('/api/form/extract-document', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }))
        throw new Error(errorData.error || 'Failed to extract document')
      }

      const result = await response.json()
      
      if (result.success && result.extractedData) {
        setUploadStatus('success')
        onExtractComplete(result.extractedData)
        
        // Auto-clear success message after 3 seconds
        setTimeout(() => {
          setUploadStatus('idle')
          setUploadedFile(null)
        }, 3000)
      } else {
        throw new Error(result.error || 'Failed to extract data from document')
      }
    } catch (error: any) {
      console.error('File upload error:', error)
      setErrorMessage(error.message || 'Failed to process document')
      setUploadStatus('error')
      onError?.(error.message || 'Failed to process document')
      setUploadedFile(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleRemove = () => {
    setUploadedFile(null)
    setUploadStatus('idle')
    setErrorMessage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {uploadStatus === 'idle' || uploadStatus === 'error' ? (
          <motion.div
            key="upload-area"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all",
              "bg-alira-primary/5 dark:bg-alira-primary/10",
              isDragging
                ? "border-alira-gold bg-alira-gold/10 dark:bg-alira-gold/20"
                : "border-alira-primary/20 dark:border-alira-white/20 hover:border-alira-gold/40 dark:hover:border-alira-gold/60",
              uploadStatus === 'error' && "border-red-500 dark:border-red-400"
            )}
          >
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className={cn(
                "p-3 rounded-full transition-colors",
                isDragging || uploadStatus === 'error'
                  ? "bg-alira-gold/20 dark:bg-alira-gold/30"
                  : "bg-alira-primary/10 dark:bg-alira-primary/20"
              )}>
                <Upload className={cn(
                  "w-6 h-6 transition-colors",
                  isDragging || uploadStatus === 'error'
                    ? "text-alira-gold"
                    : "text-alira-primary dark:text-alira-white"
                )} />
              </div>
              <div>
                <p className="text-sm font-medium text-alira-primary dark:text-alira-white">
                  {isDragging ? 'Drop file here' : 'Upload business document'}
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                  Drag and drop or click to browse
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                  Accepted: {acceptedTypes.join(', ')} (max {maxSizeMB}MB)
                </p>
              </div>
              {uploadStatus === 'error' && errorMessage && (
                <div className="mt-2 flex items-center gap-2 text-xs text-red-500 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          </motion.div>
        ) : uploadStatus === 'uploading' || uploadStatus === 'extracting' ? (
          <motion.div
            key="uploading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border-2 border-alira-gold/30 rounded-xl p-6 bg-alira-gold/10 dark:bg-alira-gold/20"
          >
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-alira-gold animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-medium text-alira-primary dark:text-alira-white">
                  {uploadStatus === 'uploading' ? 'Uploading...' : 'Extracting text...'}
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                  {uploadedFile?.name}
                </p>
              </div>
            </div>
          </motion.div>
        ) : uploadStatus === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="border-2 border-emerald-500/30 rounded-xl p-4 bg-emerald-500/10 dark:bg-emerald-500/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium text-alira-primary dark:text-alira-white">
                    Document processed successfully
                  </p>
                  <p className="text-xs text-text-tertiary mt-1">
                    Form fields have been pre-filled
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1 rounded hover:bg-alira-primary/10 dark:hover:bg-alira-primary/20 transition-colors"
                aria-label="Remove file"
              >
                <X className="w-4 h-4 text-text-tertiary" />
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

