'use client'
import type { Metadata } from "next"
import Link from "next/link"
import { Bell, FileText, PlusCircle, User, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/dashboard/sidebar"
import { ComplaintStatusBadge } from "@/components/complaints/status-badge"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "@/components/ui/use-toast"
import { API_URL } from "@/lib/api"

interface Complaint {
  _id: string
  title: string
  description: string
  service: string
  organization: {
    _id: string
    name: string
  }
  sector: string
  citizen: string
  status: string
  escalateToDistrict: boolean
  escalateToOrg: boolean
  escalationLevel: string
  attachments: string[]
  comments: {
    text: string
    user: string
    role: string
    createdAt: string
    attachments: string[]
    _id: string
  }[]
  createdAt: string
  updatedAt: string
}

interface DashboardStats {
  totalComplaints: number
  pendingComplaints: number
  inProgressComplaints: number
  resolvedComplaints: number
}

export default function CitizenDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_URL}/complaints/citizen`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        const data = response.data
        setComplaints(data)

        // Calculate stats
        const stats = {
          totalComplaints: data.length,
          pendingComplaints: data.filter((c: Complaint) => c.status === 'received').length,
          inProgressComplaints: data.filter((c: Complaint) => c.status === 'in_progress').length,
          resolvedComplaints: data.filter((c: Complaint) => c.status === 'resolved').length
        }
        setStats(stats)
        setError(null)
      } catch (err) {
        console.error("Error fetching complaints:", err)
        setError("Failed to load complaints. Please try again.")
        toast({
          title: "Error",
          description: "Failed to load complaints. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchComplaints()
  }, [])

  return (
    <div className="flex min-h-screen flex-col md:flex-row ">
      <Sidebar userType="citizen" />

      <div className="flex-1 p-4 md:p-8 ">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome, Citizen</h1>
            <p className="text-muted-foreground">Track your complaints and engage with your community</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/dashboard/citizen/new-complaint">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Complaint
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/citizen/notifications">
                <Bell className="mr-2 h-4 w-4" />
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                </span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalComplaints}</div>
              <p className="text-xs text-muted-foreground">All time complaints</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingComplaints}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Loader2 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgressComplaints}</div>
              <p className="text-xs text-muted-foreground">Being addressed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolvedComplaints}</div>
              <p className="text-xs text-muted-foreground">Successfully completed</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="complaints" className="mt-6">
          <TabsList>
            <TabsTrigger value="complaints">Recent Complaints</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="complaints" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Complaints</CardTitle>
                <CardDescription>Your most recent complaints and their current status</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 p-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                    <p className="text-center text-red-600">{error}</p>
                  </div>
                ) : complaints.length > 0 ? (
                  <div className="space-y-4">
                    {complaints.map((complaint) => (
                      <div key={complaint._id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-1">
                          <h3 className="font-medium">{complaint.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{complaint.service}</span>
                            <span>•</span>
                            <span>{complaint.organization.name}</span>
                            <span>•</span>
                            <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ComplaintStatusBadge status={complaint.status} />
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/citizen/complaints/${complaint._id}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center text-muted-foreground">
                    No complaints found
                  </div>
                )}
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/citizen/complaints">View All Complaints</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Updates about your complaints and community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    complaint.comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="space-y-1">
                          <p className="text-sm">{comment.text}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()} at{" "}
                            {new Date(comment.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you might want to perform</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4" asChild>
                <Link href="/dashboard/citizen/new-complaint">
                  <PlusCircle className="h-5 w-5" />
                  <div className="text-left">
                    <h3 className="font-medium">New Complaint</h3>
                    <p className="text-xs text-muted-foreground">Submit a new issue</p>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex-col items-start gap-1 p-4" asChild>
                <Link href="/dashboard/citizen/profile">
                  <User className="h-5 w-5" />
                  <div className="text-left">
                    <h3 className="font-medium">Profile</h3>
                    <p className="text-xs text-muted-foreground">Update your information</p>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Community Updates</CardTitle>
              <CardDescription>Recent developments in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Road Maintenance Schedule</h3>
                  <p className="text-sm text-muted-foreground">
                    Main Street will be under maintenance from May 15-20. Please use alternate routes.
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium">Community Meeting</h3>
                  <p className="text-sm text-muted-foreground">
                    Join us for the monthly community meeting on May 25 at the Community Center.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
