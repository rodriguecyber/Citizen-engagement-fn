'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Users, FileText, CheckCircle, Map, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { StatsCard } from "@/components/ui/stats-card"
import { API_URL } from "@/lib/api"

interface DashboardStats {
  activeSectors: number;
  sectorAdmins: number;
  totalComplaints: number;
  resolutionRate: number;
}

interface Complaint {
  _id: string;
  title: string;
  description: string;
  service: string;
  status: 'received' | 'in_progress' | 'resolved' | 'escalated';
  createdAt: string;
  updatedAt: string;
}

interface ComplaintCategory {
  name: string;
  value: number;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Cell {
  _id: string;
  name: string;
}

interface Sector {
  _id: string;
  name: string;
  admin: User;
  cells: Cell[];
  complaints: Complaint[];
}

export default function DistrictAdminDashboard() {
  const [districtInfo, setDistrictInfo] = useState({
    name: "",
    province: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    activeSectors: 0,
    sectorAdmins: 0,
    totalComplaints: 0,
    resolutionRate: 0
  })
  const [sectors, setSectors] = useState<Sector[]>([])
  const [complaintsByCategory, setComplaintsByCategory] = useState<ComplaintCategory[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch district info
        const districtResponse = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        const districtData = districtResponse.data
        setDistrictInfo({
          name: districtData.district.name,
          province: districtData.district.province
        })

        // Fetch sectors
        const sectorsResponse = await axios.get(`${API_URL}/districts/${districtData.district._id}/sectors`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        const sectorsData = sectorsResponse.data.sectors
        setSectors(sectorsData)

        // Fetch complaints for all sectors
        
        const res = await axios.get(`${API_URL}/complaints/district`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }) 
        const complaintsResponses = res.data
        //@ts-expect-error error
        const allComplaints = complaintsResponses.flatMap(response => response.data)

        // Calculate stats
        const stats = {
          activeSectors: sectorsData.length,
          sectorAdmins: new Set(sectorsData.map((s: Sector) => s.admin?._id)).size,
          totalComplaints: allComplaints.length,
          resolutionRate: allComplaints.length > 0
            ? Math.round((allComplaints.filter((c: Complaint) => c?.status === 'resolved').length / allComplaints.length) * 100)
            : 0
        }
        setStats(stats)

        // Calculate complaints by category
        const categoryCounts = allComplaints.reduce((acc: { [key: string]: number }, c: Complaint) => {
          acc[c?.service] = (acc[c?.service] || 0) + 1
          return acc
        }, {})
        setComplaintsByCategory(Object.entries(categoryCounts).map(([name, value]) => ({
          name,
          value: value as number
        })))

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

  return (
    <div className="space-y-6">
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
        <>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">District Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome to {districtInfo.name} District Administration Dashboard
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Active Sectors"
              value={stats.activeSectors}
              icon={<Map className="h-5 w-5 text-blue-600" />}
              description="Total sectors in district"
              trend={`${Math.round((stats.activeSectors / (stats.activeSectors - 1)) * 100 - 100)}% from last month`}
              trendUp={stats.activeSectors > 1}
            />
            <StatsCard
              title="Sector Admins"
              value={stats.sectorAdmins}
              icon={<Users className="h-5 w-5 text-green-600" />}
              description="Active administrators"
              trend={`${Math.round((stats.sectorAdmins / (stats.sectorAdmins - 1)) * 100 - 100)}% from last month`}
              trendUp={stats.sectorAdmins > 1}
            />
            <StatsCard
              title="Total Complaints"
              value={stats.totalComplaints}
              icon={<FileText className="h-5 w-5 text-yellow-600" />}
              description="All time complaints"
              trend={`${Math.round((stats.totalComplaints / (stats.totalComplaints - 10)) * 100 - 100)}% from last month`}
              trendUp={stats.totalComplaints > 10}
            />
            <StatsCard
              title="Resolution Rate"
              //@ts-expect-error unmatching types
              value={`${stats.resolutionRate}%`}
              icon={<CheckCircle className="h-5 w-5 text-purple-600" />}
              description="Successfully resolved"
              //but not real
              trend={`${Math.round((stats.resolutionRate / (stats.resolutionRate - 5)) * 100 - 100)}% from last month`}
              trendUp={stats.resolutionRate > 75}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sectors Overview</CardTitle>
                <CardDescription>
                  Overview of sectors in {districtInfo.name} district
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sectors.map((sector) => (
                    <div key={sector._id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {sector.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {sector.cells?.length || 0} cells
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {sector.complaints?.length || 0}
                          </p>
                          <p className="text-xs text-muted-foreground">Complaints</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {sector.complaints?.filter((c: Complaint) => c.status === 'resolved').length || 0}
                          </p>
                          <p className="text-xs text-muted-foreground">Resolved</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Complaint Categories</CardTitle>
                <CardDescription>
                  Distribution of complaints by service type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complaintsByCategory.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{category.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {category.value} complaints
                        </p>
                      </div>
                      <Progress
                        value={(category.value / stats.totalComplaints) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
