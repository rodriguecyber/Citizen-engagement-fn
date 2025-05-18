"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Clock, FileText, Loader2, MessageSquare, Users, Building, BarChart3, XCircle, ArrowUpCircle } from 'lucide-react'
import { DataTable } from "@/components/ui/data-table"
import { StatsCard } from "@/components/ui/stats-card"
import axios from "axios"
import { toast } from "@/components/ui/use-toast"
import { IComplaint } from "@/lib/types/complaints"
import { IUser } from "@/lib/types/user"
import { Sidebar } from "../sidebar"
import { API_URL } from "@/lib/api"

// Remove sample data and add interfaces




interface DashboardStats {
    totalComplaints: number
    resolvedComplaints: number
    pendingComplaints: number
    citizensCount: number
}

interface ComplaintTrend {
    name: string
    Received: number
    Resolved: number
}

interface ComplaintCategory {
    name: string
    value: number
}

export default function SectorAdminDashboard() {
    const [sectorInfo, setSectorInfo] = useState({
        name: "",
        district: "",
        province: "",
    })
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState<DashboardStats>({
        totalComplaints: 0,
        resolvedComplaints: 0,
        pendingComplaints: 0,
        citizensCount: 0
    })
    const [complaints, setComplaints] = useState<IComplaint[]>([])
    const [citizens, setCitizens] = useState<IUser[]>([])
    const [complaintTrend, setComplaintTrend] = useState<ComplaintTrend[]>([])
    const [complaintsByStatus, setComplaintsByStatus] = useState<ComplaintCategory[]>([])
    const [complaintsByCategory, setComplaintsByCategory] = useState<ComplaintCategory[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true)
                setError(null)

                // Fetch sector info
                const sectorResponse = await axios.get(`${API_URL}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                const sectorData = sectorResponse.data
                setSectorInfo({
                    name: sectorData.sector?.name,
                    district: sectorData.sector.district?.name,
                    province: sectorData.sector.district?.province
                })

                // Fetch complaints
                const complaintsResponse = await axios.get(`${API_URL}/complaints/sector/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                const complaintsData = complaintsResponse.data
                setComplaints(complaintsData)

                // Calculate stats
                const stats = {
                    totalComplaints: complaintsData.length,
                    resolvedComplaints: complaintsData.filter((c: IComplaint) => c.status === 'resolved').length,
                    pendingComplaints: complaintsData.filter((c: IComplaint) => c.status === 'received' || c.status === 'in_progress').length,
                    citizensCount: new Set(complaintsData.map((c: IComplaint) => c.citizen._id)).size
                }
                setStats(stats)

                // Calculate complaint trends (last 6 months)
                const sixMonthsAgo = new Date()
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
                const trendData = Array.from({ length: 6 }, (_, i) => {
                    const date = new Date()
                    date.setMonth(date.getMonth() - i)
                    const monthName = date.toLocaleString('default', { month: 'short' })
                    const monthComplaints = complaintsData.filter((c: IComplaint) => {
                        const complaintDate = new Date(c.createdAt)
                        return complaintDate.getMonth() === date.getMonth() &&
                            complaintDate.getFullYear() === date.getFullYear()
                    })
                    return {
                        name: monthName,
                        Received: monthComplaints.length,
                        Resolved: monthComplaints.filter((c: IComplaint) => c.status === 'resolved').length
                    }
                }).reverse()
                setComplaintTrend(trendData)

                // Calculate complaints by status
                const statusCounts = complaintsData.reduce((acc: { [key: string]: number }, c: IComplaint) => {
                    acc[c.status] = (acc[c.status] || 0) + 1
                    return acc
                }, {})
                setComplaintsByStatus(Object.entries(statusCounts).map(([name, value]) => ({
                    name,
                    value: value as number
                })))

                // Calculate complaints by category
                const categoryCounts = complaintsData.reduce((acc: { [key: string]: number }, c: IComplaint) => {
                    acc[c.service] = (acc[c.service] || 0) + 1
                    return acc
                }, {})
                setComplaintsByCategory(Object.entries(categoryCounts).map(([name, value]) => ({
                    name,
                    value: value as number
                })))

                // Fetch citizens
                const citizensResponse = await axios.get(`${API_URL}/sectors/${sectorData.sector._id}/citizens`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                setCitizens(citizensResponse.data.users)

            } catch (err) {
                console.error("Error fetching dashboard data:", err)
                setError("Failed to load dashboard data. Please try again.")
                toast({
                    title: "Error",
                    description: "Failed to load dashboard data. Please try again.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

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

    return (
        
        <div className="flex"><Sidebar userType="sectoradmin" /><div className="space-y-6">
            {isLoading ? (
                <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 p-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                    <p className="text-center text-red-600">{error}</p>
                </div>
            ) : (
                <div className="">

                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Sector Dashboard</h2>
                        <p className="text-muted-foreground">
                            Welcome to {sectorInfo.name} Sector Administration Dashboard
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatsCard
                            title="Total Complaints"
                            value={stats.totalComplaints}
                            icon={<FileText className="h-5 w-5 text-blue-600" />}
                            description="All time complaints"
                            trend={`${Math.round((stats.totalComplaints / (stats.totalComplaints - 10)) * 100 - 100)}% from last month`}
                            trendUp={stats.totalComplaints > 10} />
                        <StatsCard
                            title="Resolved"
                            value={stats.resolvedComplaints}
                            icon={<CheckCircle className="h-5 w-5 text-green-600" />}
                            description="Successfully resolved"
                            trend={`${Math.round((stats.resolvedComplaints / (stats.resolvedComplaints - 5)) * 100 - 100)}% from last month`}
                            trendUp={stats.resolvedComplaints > 5} />
                        <StatsCard
                            title="Pending"
                            value={stats.pendingComplaints}
                            icon={<Clock className="h-5 w-5 text-yellow-600" />}
                            description="Awaiting resolution"
                            trend={`${Math.round((stats.pendingComplaints / (stats.pendingComplaints - 3)) * 100 - 100)}% from last month`}
                            trendUp={false} />
                        <StatsCard
                            title="Citizens"
                            value={stats.citizensCount}
                            icon={<Users className="h-5 w-5 text-purple-600" />}
                            description="Registered in sector"
                            trend={`${Math.round((stats.citizensCount / (stats.citizensCount - 2)) * 100 - 100)}% from last month`}
                            trendUp={stats.citizensCount > 2} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Complaint Trends</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* AreaChart component would be populated here with actual data */}
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Complaints by Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* PieChart component would be populated here with actual data */}
                            </CardContent>
                        </Card>
                    </div>

                    <Tabs defaultValue="recent">
                        <TabsList>
                            <TabsTrigger value="recent" className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Recent Complaints
                            </TabsTrigger>
                            <TabsTrigger value="citizens" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Active Citizens
                            </TabsTrigger>
                            <TabsTrigger value="categories" className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                Categories
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="recent" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Complaints</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <DataTable
                                        data={complaints}
                                        columns={[
                                            { header: "ID", accessorKey: "_id" },
                                            { header: "Title", accessorKey: "title" },
                                            { header: "Category", accessorKey: "service" },
                                            {
                                                header: "Status",
                                                accessorKey: "status",
                                                cell: ({ row }) => {
                                                    const status = row.original.status
                                                    return (
                                                        <div className="flex items-center">
                                                            <span className={`mr-2 rounded-full p-1 ${getStatusColor(status)}`}>
                                                                {getStatusIcon(status)}
                                                            </span>
                                                            <span className="capitalize">{status.replace("_", " ")}</span>
                                                        </div>
                                                    )
                                                },
                                            },
                                            { header: "Priority", accessorKey: "priority", cell: ({ row }) => <span className="capitalize">{row.original.priority}</span> },
                                            { header: "Citizen", accessorKey: "citizen.firstName" },
                                            {
                                                header: "Date",
                                                accessorKey: "createdAt",
                                                cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
                                            },
                                        ]}
                                        searchable={true}
                                        pagination={true} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="citizens" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Active Citizens</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <DataTable
                                        data={citizens}
                                        columns={[
                                            { header: "ID", accessorKey: "_id" },
                                            { header: "Name", accessorKey: "firstName" },
                                            { header: "Complaints", accessorKey: "complaints" },
                                            {
                                                header: "Last Active",
                                                accessorKey: "lastActive",
                                                cell: ({ row }) => new Date(row.original.lastActive).toLocaleDateString(),
                                            },
                                        ]}
                                        searchable={true}
                                        pagination={true} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="categories" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Complaints by Category</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* PieChart component would be populated here with actual data */}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </div></div>
    )
}
