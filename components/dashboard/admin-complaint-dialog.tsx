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
  ArrowUpCircle,
  User,
  Phone,
  Mail,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileUploader } from "./file-uploader"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import axios from "axios"
import { IComplaint } from "@/lib/types/complaints"
import { API_URL } from "@/lib/api"

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

interface Citizen {
  name: string
  email: string
  phone: string
}

interface Complaint {
  id: string
  title: string
  organization: string
  category: string
  status: string
  priority: string
  createdAt: string
  updatedAt: string
  dueDate: string
  description: string
  citizen: Citizen
  attachments: Attachment[]
  comments: Comment[]
  timeline: TimelineEvent[]
}

interface SectorComplaintDialogProps {
  complaint: IComplaint
  isOpen: boolean
  onClose: () => void
}

export function AdminComplaintDialog({ complaint, isOpen, onClose }: SectorComplaintDialogProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [newStatus, setNewStatus] = useState(complaint.status)
  const [newComment, setNewComment] = useState("")
  const [newAttachments, setNewAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEscalateDialogOpen, setIsEscalateDialogOpen] = useState(false)
  const [escalationReason, setEscalationReason] = useState("")

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

  // Handle updating complaint status
  const handleUpdateStatus = async () => {
    if (!newComment.trim() && (newStatus === "rejected" || newStatus === "needs_info")) {
      toast({
        title: "Comment Required",
        description: "Please provide a reason when rejecting or requesting more information.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
     await axios.patch(`${API_URL}/complaints/${complaint._id}/status`,{ status: newStatus, message: newComment }, {
      headers: { 'Content-Type': 'application/json',"Authorization":`Bearer ${localStorage.getItem('token')}` },
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Status Updated",
        description: `Complaint status has been updated to ${formatStatus(newStatus)}.`,
      })

      // Clear form
      setNewComment("")
      setNewAttachments([])
      onClose()
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating the complaint status. Please try again.",
        variant: "destructive",
      })
      console.error("Error updating status:", error)
    } finally {
      setIsSubmitting(false)
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
      onClose()
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
    if (!escalationReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for escalation.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await axios.post(`${API_URL}/complaints/${complaint._id}/escalate`, { reason: escalationReason }, {
        headers: { 'Content-Type': 'application/json',"Authorization":`Bearer ${localStorage.getItem('token')}` },

      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Complaint Escalated",
        description: "The complaint has been escalated to the district level.",
      })

      setIsEscalateDialogOpen(false)
      onClose()
    } catch (error) {
      toast({
        title: "Escalation Failed",
        description: "There was an error escalating the complaint. Please try again.",
        variant: "destructive",
      })
      console.error("Error escalating complaint:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle files change
  const handleFilesChange = (files: File[]) => {
    setNewAttachments(files)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex  flex-col">
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

          <ScrollArea className="flex-1 pr-4">
            <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="citizen">Citizen</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="overflow-y-scroll h-52 space-y-4 mt-4 ">
                <div className="over-flow-auto ">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Organization</p>
                      <p>{complaint.organization.name}</p>
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
                      {/* @ts-expect-error un handled due date */}
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

                  <div className="space-y-4 mt-6 border-t pt-4">
                    <h4 className="font-medium">Update Status</h4>
                    <div className="space-y-4">
            {/* @ts-expect-error unmaaatching types */}
            <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="received">Received</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="needs_info">Needs More Information</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>

                      <Textarea
                        placeholder="Add a comment about this status change..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={4}
                      />

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Add Attachments (Optional)</p>
                        <FileUploader onFilesChange={handleFilesChange} />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="citizen" className="space-y-4 mt-4">
                <div className="rounded-md border p-6">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">{complaint.citizen.firstName}</h3>
                      <p className="text-sm text-gray-500">Citizen</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      <a href={`mailto:${complaint.citizen.email}`} className="text-primary hover:underline">
                        {complaint.citizen.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-2" />
                      <a href={`tel:${complaint.citizen.phone}`} className="text-primary hover:underline">
                        {complaint.citizen.phone}
                      </a>
                    </div>
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
                        className={cn(
                          "p-4 rounded-lg",
                          comment.user.role === "citizen" ? "bg-blue-50 ml-8" : "bg-gray-50 mr-8",
                        )}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{comment.user.firstName}</span>
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

                {/* Add comment form */}
                <div className="space-y-4 mt-6 border-t pt-4">
                  <h4 className="font-medium">Add Comment</h4>
                  <Textarea
                    placeholder="Type your comment here..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                  />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Add Attachments (Optional)</p>
                    <FileUploader onFilesChange={handleFilesChange} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="attachments" className="space-y-4 mt-4">
                {complaint.attachments&& complaint.attachments.length > 0 ? (
                  <div className="space-y-3">
                    {complaint.attachments&&complaint.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center rounded-md border p-3">
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{attachment}</p>
                      
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
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

              {/* <TabsContent value="timeline" className="space-y-4 mt-4">
                <div className="relative pl-8 before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-gray-200">
                  {complaint?.timeline?.map((event, index) => (
                    <div key={index} className="mb-6 relative">
                      <div className="absolute left-[-24px] flex h-6 w-6 items-center justify-center rounded-full border bg-white">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{event.action}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{formatDate(event.timestamp)}</span>
                          <span>•</span>
                          <span>{event.by}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent> */}
            </Tabs>
          </ScrollArea>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>

            {activeTab === "details" && (
              <Button
                onClick={handleUpdateStatus}
                disabled={isSubmitting || newStatus === complaint.status}
                className="bg-primary text-white"
              >
                {isSubmitting ? "Updating..." : "Update Status"}
              </Button>
            )}

            {activeTab === "comments" && (
              <Button
                onClick={handleSendComment}
                disabled={isSubmitting || (!newComment.trim() && newAttachments.length === 0)}
                className="bg-primary text-white"
              >
                {isSubmitting ? "Sending..." : "Send Comment"}
              </Button>
            )}

            <Button
              onClick={() => setIsEscalateDialogOpen(true)}
              variant="outline"
              className="border-orange-500 text-orange-500 hover:bg-orange-50"
            >
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              Escalate
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Escalation Dialog */}
      <AlertDialog open={isEscalateDialogOpen} onOpenChange={setIsEscalateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Escalate Complaint</AlertDialogTitle>
            <AlertDialogDescription>
              This will escalate the complaint to the district level. Please provide a reason for escalation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Reason for escalation..."
              value={escalationReason}
              onChange={(e) => setEscalationReason(e.target.value)}
              rows={4}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEscalate}
              disabled={isSubmitting || !escalationReason.trim()}
              className="bg-orange-500 text-white hover:bg-orange-600"
            >
              {isSubmitting ? "Escalating..." : "Escalate Complaint"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
