"use client"

import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Bell, CheckCircle, MessageSquare, ArrowUpCircle, Info, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface NotificationItemProps {
  notification: {
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
  onMarkAsRead: (id: string) => void
}

export function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  // Format relative time
  const getRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (e) {
      return "some time ago"
    }
  }

  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case "status_change":
        return <Info className="h-5 w-5 text-blue-500" />
      case "comment":
        return <MessageSquare className="h-5 w-5 text-purple-500" />
      case "escalation":
        return <ArrowUpCircle className="h-5 w-5 text-orange-500" />
      case "resolution":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "complaint_update":
        return <FileText className="h-5 w-5 text-yellow-500" />
      case "system":
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  // Get appropriate link for notification
  const getNotificationLink = () => {
    if (notification.relatedComplaint) {
      return `/dashboard/citizen/complaints?id=${notification.relatedComplaint._id}`
    }
    return "/dashboard/notifications"
  }

  // Handle notification click
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification._id)
    }
  }

  return (
    <Link
      href={getNotificationLink()}
      onClick={handleClick}
      className={cn("block transition-colors hover:bg-muted/50", notification.read ? "bg-white" : "bg-blue-50")}
    >
      <div className="flex gap-3 p-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted/20">{getIcon()}</div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>{notification.title}</p>
            <span className="text-[10px] text-muted-foreground">{getRelativeTime(notification.createdAt)}</span>
          </div>
          <p className="line-clamp-2 text-xs text-muted-foreground">{notification.message}</p>
          {notification.relatedComplaint && (
            <div className="mt-1 rounded bg-muted px-1 py-0.5 text-[10px] font-medium">
              {notification.relatedComplaint.complaintId}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
