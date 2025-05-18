"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2, CheckCircle } from "lucide-react"
import { NotificationItem } from "@/components/dashboard/notification-item"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Notification {
  _id: string
  title: string
  message: string
  type: "complaint_update" | "status_change" | "comment" | "escalation" | "resolution" | "system"
  read: boolean
  relatedComplaint?: {
    _id: string
    complaintId: string
    title: string
  }
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalNotifications, setTotalNotifications] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)
  const { toast } = useToast()

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setIsLoading(true)

      // For demo purposes, simulate API response with mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate a large set of mock notifications
      const mockNotifications: Notification[] = []

      for (let i = 1; i <= 20; i++) {
        // Alternate between read and unread
        const isRead = i % 2 === 0

        // Create notification types based on index
        let type: Notification["type"] = "system"
        if (i % 5 === 0) type = "status_change"
        else if (i % 5 === 1) type = "comment"
        else if (i % 5 === 2) type = "escalation"
        else if (i % 5 === 3) type = "resolution"
        else type = "complaint_update"

        // Create different time periods
        const daysAgo = Math.floor(i / 3)

        mockNotifications.push({
          _id: `n${i}`,
          title: `Notification ${i}`,
          message: `This is the message content for notification ${i}. It contains relevant information about ${type === "comment" ? "system updates" : "your complaint"}.`,
          type,
          read: isRead,
          ...(type !== "comment"
            ? {
                relatedComplaint: {
                  _id: `c${(i % 5) + 1}`,
                  complaintId: `CM-2023-00${(i % 5) + 1}`,
                  title: `Sample Complaint ${(i % 5) + 1}`,
                },
              }
            : {}),
          createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
        })
      }

      // Filter based on activeTab
      let filteredNotifications = [...mockNotifications]
      if (activeTab === "unread") {
        filteredNotifications = filteredNotifications.filter((n) => !n.read)
      }

      // Paginate
      const limit = 10
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex)

      setTotalNotifications(filteredNotifications.length)
      setTotalPages(Math.ceil(filteredNotifications.length / limit))
      setUnreadCount(mockNotifications.filter((n) => !n.read).length)
      setNotifications(paginatedNotifications)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      // In a real app, this would be an actual API call
      // await fetch(`/api/notifications/${notificationId}/read`, { method: 'PATCH' })

      // For demo purposes, update state directly
      const updatedNotifications = notifications.map((notification) =>
        notification._id === notificationId ? { ...notification, read: true } : notification,
      )

      setNotifications(updatedNotifications)
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // In a real app, this would be an actual API call
      // await fetch('/api/notifications/read-all', { method: 'PATCH' })

      // For demo purposes, update state directly
      const updatedNotifications = notifications.map((notification) => ({ ...notification, read: true }))

      setNotifications(updatedNotifications)
      setUnreadCount(0)

      toast({
        title: "Success",
        description: "All notifications marked as read",
      })
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive",
      })
    }
  }

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      // In a real app, this would be an actual API call
      // await fetch(`/api/notifications/${notificationId}`, { method: 'DELETE' })

      // For demo purposes, update state directly
      const updatedNotifications = notifications.filter((notification) => notification._id !== notificationId)

      setNotifications(updatedNotifications)
      setTotalNotifications((prev) => prev - 1)

      toast({
        title: "Success",
        description: "Notification deleted",
      })
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      })
    }
  }

  // Reset page when tab changes
  useEffect(() => {
    setPage(1)
  }, [activeTab])

  // Fetch notifications when page or tab changes
  useEffect(() => {
    fetchNotifications()
  }, [page, activeTab])

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null

    return (
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * 10 + 1}-{Math.min(page * 10, totalNotifications)} of {totalNotifications}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </Button>

          <span className="text-sm">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">View and manage your notifications</p>
        </div>

        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-500" disabled={unreadCount === 0}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All Read
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Read Notifications</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete all read notifications? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Notifications</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-1 rounded-md border">
                {notifications.map((notification) => (
                  <div key={notification._id} className="flex items-center justify-between border-b last:border-b-0">
                    <div className="flex-1">
                      <NotificationItem notification={notification} onMarkAsRead={markAsRead} />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => deleteNotification(notification._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-md border bg-muted/10">
                <p className="text-muted-foreground">
                  {activeTab === "unread" ? "No unread notifications" : "No notifications found"}
                </p>
              </div>
            )}

            {renderPagination()}
          </div>
        </Tabs>
      </div>
    </div>
  )
}
