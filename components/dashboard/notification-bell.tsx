"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell } from "lucide-react"
import { NotificationItem } from "./notification-item"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

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

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      // In a real app, this would be an actual API call
      // const response = await fetch('/api/notifications?limit=5')
      // const data = await response.json()

      // For demo purposes, simulate API response with mock data
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mockNotifications: Notification[] = [
        {
          _id: "n1",
          title: "Complaint status updated",
          message: "Your complaint about water supply has been marked as in progress.",
          type: "status_change",
          read: false,
          relatedComplaint: {
            _id: "c1",
            complaintId: "CM-2023-001",
            title: "Water supply interruption for 3 days",
          },
          createdAt: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
        },
        {
          _id: "n2",
          title: "New comment on your complaint",
          message: "Technical team: The issue has been identified as a broken main pipe. Repairs are underway.",
          type: "comment",
          read: false,
          relatedComplaint: {
            _id: "c1",
            complaintId: "CM-2023-001",
            title: "Water supply interruption for 3 days",
          },
          createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
        },
        {
          _id: "n3",
          title: "System maintenance",
          message: "The system will be undergoing maintenance tonight from 2 AM to 4 AM.",
          type: "system",
          read: true,
          createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
        },
      ]

      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter((n) => !n.read).length)
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

  // Mark a notification as read
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

  // Load notifications when popover opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  // Initial count fetch
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        // In a real app, this would be an actual API call
        // const response = await fetch('/api/notifications/count')
        // const data = await response.json()
        // setUnreadCount(data.unreadCount)

        // For demo purposes, set a random count between 0-5
        setUnreadCount(Math.floor(Math.random() * 3) + 1)
      } catch (error) {
        console.error("Error fetching notification count:", error)
      }
    }

    fetchNotificationCount()

    // Poll for new notifications every minute
    const interval = setInterval(fetchNotificationCount, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between bg-primary px-4 py-2 text-white">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="link"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto p-0 text-white hover:text-white/80"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-80">
          {isLoading ? (
            <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem key={notification._id} notification={notification} onMarkAsRead={markAsRead} />
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
              No notifications
            </div>
          )}
        </ScrollArea>
        <div className="border-t p-2 text-center">
          <Link
            href="/dashboard/notifications"
            className="text-xs text-primary hover:underline"
            onClick={() => setIsOpen(false)}
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}
