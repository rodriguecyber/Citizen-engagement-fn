import { Badge } from "@/components/ui/badge"

type ComplaintStatus = "pending" | "in-progress" | "resolved" | "rejected" | "escalated"

interface ComplaintStatusBadgeProps {
  status: ComplaintStatus | string
}

export function ComplaintStatusBadge({ status }: ComplaintStatusBadgeProps) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Pending
        </Badge>
      )
    case "in-progress":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          In Progress
        </Badge>
      )
    case "resolved":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
          Resolved
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
          Rejected
        </Badge>
      )
    case "escalated":
      return (
        <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
          Escalated
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}
