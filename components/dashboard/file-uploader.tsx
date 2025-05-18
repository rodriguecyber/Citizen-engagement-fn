"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Upload, File, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FileUploaderProps {
  onFilesChange: (files: File[]) => void
  maxFiles?: number
  maxSizeInMB?: number
  allowedTypes?: string[]
}

export function FileUploader({
  onFilesChange,
  maxFiles = 3,
  maxSizeInMB = 5,
  allowedTypes = ["image/*", "application/pdf", ".doc", ".docx", ".xls", ".xlsx"],
}: FileUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file: File) => {
    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024)
    if (fileSizeInMB > maxSizeInMB) {
      setError(`File "${file.name}" exceeds the maximum size of ${maxSizeInMB}MB`)
      return false
    }

    // Check file type
    let isValidType = false
    for (const type of allowedTypes) {
      if (
        (type.endsWith("/*") && file.type.startsWith(type.replace("/*", ""))) ||
        type === file.type ||
        file.name.endsWith(type)
      ) {
        isValidType = true
        break
      }
    }

    if (!isValidType) {
      setError(`File "${file.name}" has an unsupported format`)
      return false
    }

    return true
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    setError(null)

    const fileArray = Array.from(files)
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    const validFiles = fileArray.filter(validateFile)
    if (validFiles.length === 0) return

    const newFileList = [...uploadedFiles, ...validFiles]
    setUploadedFiles(newFileList)
    onFilesChange(newFileList)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles]
    newFiles.splice(index, 1)
    setUploadedFiles(newFiles)
    onFilesChange(newFiles)
    setError(null)
  }

  const getFileIcon = (fileName: string) => {
    if (fileName.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
      return <div className="h-8 w-8 rounded-md bg-blue-100 text-blue-600">IMG</div>
    } else if (fileName.match(/\.(pdf)$/i)) {
      return <div className="h-8 w-8 rounded-md bg-red-100 text-red-600">PDF</div>
    } else if (fileName.match(/\.(doc|docx)$/i)) {
      return <div className="h-8 w-8 rounded-md bg-blue-100 text-blue-600">DOC</div>
    } else if (fileName.match(/\.(xls|xlsx)$/i)) {
      return <div className="h-8 w-8 rounded-md bg-green-100 text-green-600">XLS</div>
    } else {
      return <File className="h-8 w-8 text-gray-400" />
    }
  }

  return (
    <div className="w-full space-y-4">
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-colors",
          dragActive ? "border-primary bg-primary/10" : "",
          "hover:bg-gray-100",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={uploadedFiles.length >= maxFiles ? undefined : handleClick}
        role={uploadedFiles.length >= maxFiles ? undefined : "button"}
        tabIndex={uploadedFiles.length >= maxFiles ? undefined : 0}
        style={{ cursor: uploadedFiles.length >= maxFiles ? "default" : "pointer" }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleChange}
          accept={allowedTypes.join(",")}
          disabled={uploadedFiles.length >= maxFiles}
        />
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className={cn("mb-4 h-10 w-10", dragActive ? "text-primary" : "text-gray-400")} />
          {uploadedFiles.length >= maxFiles ? (
            <p className="text-sm text-gray-500">Maximum {maxFiles} files reached. Remove files to add more.</p>
          ) : (
            <>
              <p className="mb-2 text-sm font-semibold text-gray-500">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">
                {allowedTypes.includes("image/*") ? "PNG, JPG, PDF, " : ""}
                DOC, DOCX, PDF up to {maxSizeInMB}MB
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {uploadedFiles.length} of {maxFiles} files uploaded
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between rounded-md border p-2">
              <div className="flex items-center gap-2">
                {getFileIcon(file.name)}
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500" onClick={() => removeFile(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
