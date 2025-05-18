"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  MessageSquare,
  Search,
  XCircle,
  AlertTriangle,
  ArrowUpCircle,
} from "lucide-react"
import { ComplaintTable } from "@/components/dashboard/complaint-table"
import { AdminComplaintDialog} from "@/components/dashboard/admin-complaint-dialog"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { Sidebar } from "../../sidebar"
import { IComplaint } from "@/lib/types/complaints"
import { API_URL } from "@/lib/api"

export default function SectorAdminComplaintsPage() {

  const [complaints,setComplaints] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null)
  const [activeTab, setActiveTab] = useState("all")
 const {toast}=useToast()
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const openComplaintDetails = (complaint: any) => {
    setSelectedComplaint(complaint)
  }

  const closeComplaintDetails = () => {
    setSelectedComplaint(null)
  }

  // Filter complaints based on status and search query
  const filterComplaints = () => {
    let filtered = [...complaints]

    // Filter by status
    if (activeTab !== "all") {
      filtered = filtered.filter((complaint) => complaint.status === activeTab)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (complaint) =>
          complaint.title.toLowerCase().includes(query) ||
          complaint.organization.name.toLowerCase().includes(query) ||
          complaint._id.toLowerCase().includes(query) ||
          complaint.service.toLowerCase().includes(query) ||
          complaint.service.toLowerCase().includes(query) ||
          complaint.citizen.firstName.toLowerCase().includes(query)||
          complaint.citizen.lastName.toLowerCase().includes(query),
      )
    }

    return filtered
  }

  // Count complaints by status
  const complaintCounts = {
    all: complaints.length,
    received: complaints.filter((c) => c.status === "received").length,
    in_progress: complaints.filter((c) => c.status === "in_progress").length,
    needs_info: complaints.filter((c) => c.status === "needs_info").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    rejected: complaints.filter((c) => c.status === "rejected").length,
    escalated: complaints.filter((c) => c.status === "escalated").length,
  }

  // Get appropriate icon based on complaint status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "received":
        return <Clock className="h-4 w-4" />
      case "in_progress":
        return <Loader2 className="h-4 w-4" />
      case "needs_info":
        return <AlertCircle className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "escalated":
        return <ArrowUpCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // Get appropriate color based on complaint status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "received":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "needs_info":
        return "bg-purple-100 text-purple-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "escalated":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        // setLoading(true)
        const response = await axios.get(`${API_URL}/complaints/sector`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        const data = response.data
        setComplaints(data)

        // Calculate stats
        const stats = {
          totalComplaints: data.length,
          pendingComplaints: data.filter((c: IComplaint) => c.status === 'received').length,
          inProgressComplaints: data.filter((c: IComplaint) => c.status === 'in_progress').length,
          resolvedComplaints: data.filter((c: IComplaint) => c.status === 'resolved').length
        }
        // setStats(stats)
        // setError(null)
      } catch (err) {
        console.error("Error fetching complaints:", err)
        toast({
          title: "Error",
          description: "Failed to load complaints. Please try again.",
          variant: "destructive",
        })
      } finally {
      }
    }

    fetchComplaints()
  }, [])

  return (
    <div className="flex">
    <Sidebar userType={"sectoradmin"} />
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sector Complaints</h2>
        <p className="text-muted-foreground">Manage and respond to citizen complaints in your sector</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-50 pb-3">
            <CardTitle className="flex items-center text-base">
              <Clock className="mr-2 h-5 w-5 text-blue-500" /> New Complaints
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold">{complaintCounts.received}</div>
            <p className="text-sm text-muted-foreground">Complaints awaiting action</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-yellow-50 pb-3">
            <CardTitle className="flex items-center text-base">
              <Loader2 className="mr-2 h-5 w-5 text-yellow-500" /> In Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold">{complaintCounts.in_progress}</div>
            <p className="text-sm text-muted-foreground">Complaints being processed</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-red-50 pb-3">
            <CardTitle className="flex items-center text-base">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" /> Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold">{complaintCounts.needs_info + complaintCounts.escalated}</div>
            <p className="text-sm text-muted-foreground">Complaints needing attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          placeholder="Search complaints by title, ID, citizen name..."
          className="pl-10"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full overflow-x-auto">
          <TabsTrigger value="all" className="gap-2">
            <FileText className="h-4 w-4" />
            All <Badge variant="outline">{complaintCounts.all}</Badge>
          </TabsTrigger>
          <TabsTrigger value="received" className="gap-2">
            <Clock className="h-4 w-4" />
            Received <Badge variant="outline">{complaintCounts.received}</Badge>
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="gap-2">
            <Loader2 className="h-4 w-4" />
            In Progress <Badge variant="outline">{complaintCounts.in_progress}</Badge>
          </TabsTrigger>
          <TabsTrigger value="needs_info" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Needs Info <Badge variant="outline">{complaintCounts.needs_info}</Badge>
          </TabsTrigger>
          <TabsTrigger value="resolved" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Resolved <Badge variant="outline">{complaintCounts.resolved}</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <XCircle className="h-4 w-4" />
            Rejected <Badge variant="outline">{complaintCounts.rejected}</Badge>
          </TabsTrigger>
          <TabsTrigger value="escalated" className="gap-2">
            <ArrowUpCircle className="h-4 w-4" />
            Escalated <Badge variant="outline">{complaintCounts.escalated}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <ComplaintTable
            complaints={filterComplaints()}
            onViewDetails={openComplaintDetails}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
            //@ts-expect-error unmaaatching types
            showCitizen={true}
          />
        </TabsContent>

        <TabsContent value="received" className="mt-0">
          <ComplaintTable
            complaints={filterComplaints()}
            onViewDetails={openComplaintDetails}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
            //@ts-expect-error unmaaatching types
            showCitizen={true}
          />
        </TabsContent>

        <TabsContent value="in_progress" className="mt-0">
          <ComplaintTable
            complaints={filterComplaints()}
            onViewDetails={openComplaintDetails}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
            //@ts-expect-error unmaaatching types
            showCitizen={true}
          />
        </TabsContent>

        <TabsContent value="needs_info" className="mt-0">
          <ComplaintTable
            complaints={filterComplaints()}
            onViewDetails={openComplaintDetails}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
            //@ts-expect-error unmaaatching types
            showCitizen={true}
          />
        </TabsContent>

        <TabsContent value="resolved" className="mt-0">
          <ComplaintTable
            complaints={filterComplaints()}
            onViewDetails={openComplaintDetails}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
            //@ts-expect-error unmaaatching types
            showCitizen={true}
          />
        </TabsContent>

        <TabsContent value="rejected" className="mt-0">
          <ComplaintTable
            complaints={filterComplaints()}
            onViewDetails={openComplaintDetails}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
            //@ts-expect-error unmaaatching types
            showCitizen={true}
          />
        </TabsContent>

        <TabsContent value="escalated" className="mt-0">
          <ComplaintTable
            complaints={filterComplaints()}
            onViewDetails={openComplaintDetails}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
            //@ts-expect-error unmaaatching types
            showCitizen={true}
          />
        </TabsContent>
      </Tabs>

      {/* Complaint Details Dialog */}
      {selectedComplaint && (
        <AdminComplaintDialog
          complaint={selectedComplaint}
          isOpen={!!selectedComplaint}
          onClose={closeComplaintDetails}
        />
      )}
    </div>
    </div>
  )
}
