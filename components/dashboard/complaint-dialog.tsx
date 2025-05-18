"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  AlertCircle,
  Info,
  File,
  ThumbsUp,
  ArrowUpCircle,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileUploader } from "./file-uploader"
import Link from "next/link"
import { IComplaint } from "@/lib/types/complaints"

interface Attachment {
  name: string
  type: string
  size: number
}

interface Comment {
  id: string
  user: string
  message: string
  timestamp: string
}

interface TimelineEvent {
  action: string
  timestamp: string
  by: string
}

interface Complaint {
  id: string
  title: string
  organization: string | { name: string }
  category: string
  status: string
  priority: string
  createdAt: string
  updatedAt: string
  dueDate: string
  description: string
  attachments: (string | Attachment)[]
  comments: Comment[]
  timeline: TimelineEvent[]
}

interface ComplaintDialogProps {
  complaint: IComplaint
  isOpen: boolean
  onClose: () => void
}

export function ComplaintDialog({ complaint, isOpen, onClose }: ComplaintDialogProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [newComment, setNewComment] = useState("")
  const [newAttachments, setNewAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Format the status for display
  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  }

  // Get appropriate icon based on complaint status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "received":
        return <Clock className="h-5 w-5" />
      case "in_progress":
        return <Info className="h-5 w-5" />
      case "needs_info":
        return <AlertCircle className="h-5 w-5" />
      case "resolved":
        return <CheckCircle className="h-5 w-5" />
      case "rejected":
        return <XCircle className="h-5 w-5" />
      case "escalated":
        return <ArrowUpCircle className="h-5 w-5" />
      default:
        return <File className="h-5 w-5" />
    }
  }

  // Get appropriate color based on complaint status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "received":
        return "text-blue-600"
      case "in_progress":
        return "text-yellow-600"
      case "needs_info":
        return "text-purple-600"
      case "resolved":
        return "text-green-600"
      case "rejected":
        return "text-red-600"
      case "escalated":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP p")
    } catch (e) {
      return "Unknown date"
    }
  }

  // Get file icon based on type
  const getFileIcon = (fileType: string) => {
    if (fileType?.includes("image")) {
      return <div className="h-8 w-8 rounded-md bg-blue-100 text-blue-600">IMG</div>
    } else if (fileType?.includes("pdf")) {
      return <div className="h-8 w-8 rounded-md bg-red-100 text-red-600">PDF</div>
    } else if (fileType?.includes("doc")) {
      return <div className="h-8 w-8 rounded-md bg-blue-100 text-blue-600">DOC</div>
    } else if (fileType?.includes("xls")) {
      return <div className="h-8 w-8 rounded-md bg-green-100 text-green-600">XLS</div>
    } else {
      return <File className="h-8 w-8 text-gray-400" />
    }
  }

  // Handle sending a new comment
  const handleSendComment = async () => {
    if (!newComment.trim() && newAttachments.length === 0) return

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to submit the comment and attachments
      // const formData = new FormData()
      // formData.append('complaintId', complaint.id)
      // formData.append('message', newComment)
      // newAttachments.forEach(file => formData.append('attachments', file))

      // const response = await fetch('/api/complaints/comments', {
      //   method: 'POST',
      //   body: formData
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Comment Submitted",
        description: "Your comment has been successfully submitted.",
      })

      // Clear form
      setNewComment("")
      setNewAttachments([])
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your comment. Please try again.",
        variant: "destructive",
      })
      console.error("Error submitting comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle escalating a complaint
  const handleEscalate = async () => {
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to escalate the complaint
      // const response = await fetch(`/api/complaints/${complaint.id}/escalate`, {
      //   method: 'POST'
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Complaint Escalated",
        description: "Your complaint has been escalated to the next level.",
      })

      onClose()
    } catch (error) {
      toast({
        title: "Escalation Failed",
        description: "There was an error escalating your complaint. Please try again.",
        variant: "destructive",
      })
      console.error("Error escalating complaint:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle confirming resolution
  const handleConfirmResolution = async () => {
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to confirm resolution
      // const response = await fetch(`/api/complaints/${complaint.id}/confirm-resolution`, {
      //   method: 'POST'
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Resolution Confirmed",
        description: "You have confirmed that this complaint has been resolved.",
      })

      onClose()
    } catch (error) {
      toast({
        title: "Confirmation Failed",
        description: "There was an error confirming the resolution. Please try again.",
        variant: "destructive",
      })
      console.error("Error confirming resolution:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle files change
  const handleFilesChange = (files: File[]) => {
    setNewAttachments(files)
  }

  // Determine what action buttons to show based on complaint status
  const getActionButtons = () => {
    switch (complaint.status) {
      case "resolved":
        return (
          <Button
            onClick={handleConfirmResolution}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            {isSubmitting ? "Processing..." : "Confirm Resolution"}
          </Button>
        )
      case "rejected":
        return (
          <Button onClick={handleEscalate} disabled={isSubmitting} variant="destructive">
            <ArrowUpCircle className="mr-2 h-4 w-4" />
            {isSubmitting ? "Processing..." : "Escalate Complaint"}
          </Button>
        )
      case "needs_info":
        return (
          <Button
            onClick={handleSendComment}
            disabled={isSubmitting || (!newComment.trim() && newAttachments.length === 0)}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            {isSubmitting ? "Sending..." : "Send Additional Information"}
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <span className={cn("mr-2", getStatusColor(complaint.status))}>{getStatusIcon(complaint.status)}</span>
            <span className="truncate">{complaint.title}</span>
          </DialogTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="bg-gray-100">
              {complaint._id}
            </Badge>
            <Badge className={cn("flex items-center gap-1", getStatusColor(complaint.status))}>
              {formatStatus(complaint.status)}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 ">
          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
            </TabsList>
<div className="h-56 overflow-y-scroll">
            <TabsContent value="details" className="space-y-4 mt-4  ">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Organization</p>
                  <p>{typeof complaint.organization === 'string' ? complaint.organization : complaint.organization.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p>{complaint.service}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Submitted On</p>
                  <p>{formatDate(complaint.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p>{formatDate(complaint.updatedAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Due Date</p>
                      {/* @ts-expect-error un handled dues dates */}
                  <p>{formatDate(complaint.dueDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Priority</p>
                      {/* @ts-expect-error un handled priority */}
                  <p className="capitalize">{complaint.priority}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                <div className="rounded-md border p-4 bg-gray-50 text-black">
                  <p className="whitespace-pre-wrap">{complaint.description}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4 mt-4">
              {/* Existing comments */}
              {complaint.comments.length > 0 ? (
                <div className="space-y-4">
                  {complaint.comments.map((comment) => (
                    <div
                      key={comment._id}
                      className={cn("p-4 rounded-lg text-black", comment.user.firstName === "You" ? "bg-blue-50 ml-8" : "bg-gray-50 mr-8")}
                    >
                      <div className="flex justify-between text-xs items-start mb-2">
                        <span className="font-medium">{`${comment.user.firstName}  ${comment.user.lastName}(${comment.user.role}) `}</span>
                        <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="mx-auto h-8 w-8 mb-2" />
                  <p>No comments yet</p>
                </div>
              )}

              {/* Add comment form for needs_info status */}
              {complaint.status === "needs_info" && (
                <div className="space-y-4 mt-6 border-t pt-4">
                  <h4 className="font-medium">Provide Additional Information</h4>
                  <Textarea
                    placeholder="Type your response here..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                  />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Add Attachments (Optional)</p>
                    <FileUploader onFilesChange={handleFilesChange} />
                  </div>
                </div>
              )}

              {/* Add comment for resolved complaints */}
              {complaint.status === "resolved" && (
                <div className="space-y-4 mt-6 border-t pt-4">
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      This complaint has been marked as resolved. Please confirm if your issue has been satisfactorily
                      addressed.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Rejected info */}
              {complaint.status === "rejected" && (
                <div className="space-y-4 mt-6 border-t pt-4">
                  <Alert className="bg-red-50 border-red-200">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      This complaint has been rejected. You can escalate it to the next level if you disagree with the
                      decision.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </TabsContent>

            <TabsContent value="attachments" className="space-y-4 mt-4">
              {complaint.attachments && complaint.attachments.length > 0 ? (
                <div className="space-y-3">
                  {complaint.attachments && complaint?.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center rounded-md border p-3">
                      <div className="flex-1 min-w-0">
                        <Link href={attachment as string} className="text-xs text-gray-500">View Document</Link>
                      </div>
                      
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <File className="mx-auto h-8 w-8 mb-2" />
                  <p>No attachments</p>
                </div>
              )}
            </TabsContent>

           
            </div>
          </Tabs>
        </ScrollArea>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {getActionButtons()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
