"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IComplaint } from "@/lib/types/complaints"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Eye } from "lucide-react"
import type { JSX } from "react"



interface ComplaintTableProps {
  complaints: IComplaint[]
  onViewDetails: (complaint: IComplaint) => void
  getStatusIcon: (status: string) => JSX.Element
  getStatusColor: (status: string) => string
}

export function ComplaintTable({ complaints, onViewDetails, getStatusIcon, getStatusColor }: ComplaintTableProps) {
  // Format the status for display
  const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  }

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Format date to relative time
  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (e) {
      return "Unknown date"
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Complaint ID</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Organization</TableHead>
            <TableHead className="hidden lg:table-cell">Category</TableHead>
            <TableHead className="hidden lg:table-cell">Priority</TableHead>
            <TableHead className="hidden lg:table-cell">Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {complaints.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-32 text-center">
                No complaints found
              </TableCell>
            </TableRow>
          ) : (
            complaints.map((complaint) => (
              <TableRow key={complaint._id}>
                <TableCell className="font-medium">{complaint.complaintId}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge
                    variant="outline"
                    className={cn("flex items-center gap-1 w-fit", getStatusColor(complaint.status))}
                  >
                    {getStatusIcon(complaint.status)}
                    {formatStatus(complaint.status)}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  <div className="truncate">{complaint.title}</div>
                  <div className="md:hidden mt-1">
                    <Badge
                      variant="outline"
                      className={cn("flex items-center gap-1 w-fit", getStatusColor(complaint.status))}
                    >
                      {getStatusIcon(complaint.status)}
                      {formatStatus(complaint.status)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{complaint.organization.name}</TableCell>
                <TableCell className="hidden lg:table-cell">{complaint.service}</TableCell>
                <TableCell className="hidden lg:table-cell">
                      {/* @ts-expect-error un handled priority */}
                  <Badge variant="outline" className={cn(getPriorityColor(complaint.priority))}>
                      {/* @ts-expect-error un handled priority */}
                    {complaint.priority?.charAt(0).toUpperCase() + complaint.priority?.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{formatRelativeTime(complaint.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(complaint)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">View</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
