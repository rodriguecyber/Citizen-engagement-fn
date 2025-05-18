"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Clock, FileText, Loader2, MessageSquare, Search, XCircle, ArrowUpCircle } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { showErrorToast, showSuccessToast } from "@/lib/error-handler"
import axios from "axios"
import { AdminComplaintDialog } from "@/components/dashboard/admin-complaint-dialog"
import { API_URL } from "@/lib/api"

interface IUser {
    _id: string
    firstName: string
    lastName: string
    email: string
}

interface ISector {
    _id: string
    name: string
}

interface IComplaint {
    _id: string
    title: string
    description: string
    status: string
    service: string
    response?: string
    createdAt: string
    updatedAt: string
    citizen: IUser
    organization: {
        _id: string
        name: string
    }
    sector: ISector
}

interface Sector {
    _id: string
    name: string
}

// Predefined list of services
const SERVICES = [
    "Water Supply",
    "Electricity",
    "Road Maintenance",
    "Waste Management",
    "Health Services",
    "Education",
    "Security",
    "Housing",
    "Agriculture",
    "Transportation",
    "Social Services",
    "Environment",
    "Other"
]

export default function DistrictAdminComplaintsPage() {
    const [complaints, setComplaints] = useState<IComplaint[]>([])
    const [sectors, setSectors] = useState<Sector[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [sectorFilter, setSectorFilter] = useState<string>("all")
    const [serviceFilter, setServiceFilter] = useState<string>("all")
    const [selectedComplaint, setSelectedComplaint] = useState<IComplaint | null>(null)
    const [districtInfo, setDistrictInfo] = useState<{ _id: string; name: string } | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)

                // Fetch district info
                const userResponse = await axios.get(`${API_URL}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                const districtData = userResponse.data.district
                setDistrictInfo(districtData)

                // Fetch sectors for the district
                const sectorsResponse = await axios.get(`${API_URL}/sectors?district=${districtData._id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                setSectors(sectorsResponse.data.sectors)

                // Fetch complaints for the district
                const complaintsResponse = await axios.get(`${API_URL}/complaints/district/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                setComplaints(complaintsResponse.data)
            } catch (err) {
                console.error("Error fetching data:", err)
                setError("Failed to load data. Please try again.")
                showErrorToast(err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value)
    }

    const handleSectorFilterChange = (value: string) => {
        setSectorFilter(value)
    }

    const handleServiceFilterChange = (value: string) => {
        setServiceFilter(value)
    }

    const handleViewComplaint = (complaint: IComplaint) => {
        setSelectedComplaint(complaint)
    }

    const closeComplaintDetails = () => {
        setSelectedComplaint(null)
    }

    const handleComplaintUpdate = async (updatedComplaint: IComplaint) => {
        try {
            // Update the complaint in the list
            setComplaints(prev =>
                prev.map(complaint =>
                    complaint._id === updatedComplaint._id
                        ? updatedComplaint
                        : complaint
                )
            )
            showSuccessToast("Complaint updated successfully")
        } catch (err) {
            showErrorToast(err)
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "received":
                return <Clock className="h-4 w-4" />
            case "in_progress":
                return <Loader2 className="h-4 w-4 animate-spin" />
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

    const filteredComplaints = complaints.filter(complaint => {
        const matchesSearch =
            complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            complaint.citizen.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            complaint.citizen.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            complaint.organization.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            complaint.sector.name.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === "all" || complaint.status === statusFilter
        const matchesSector = sectorFilter === "all" || complaint.sector._id === sectorFilter
        const matchesService = serviceFilter === "all" || complaint.service === serviceFilter

        return matchesSearch && matchesStatus && matchesSector && matchesService
    })

    return (
        <div className="flex">
            <div className="flex-1 space-y-6 p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Complaints</h2>
                        <p className="text-muted-foreground">
                            Manage complaints in {districtInfo?.name} district
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search complaints..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="received">Received</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="needs_info">Needs Info</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="escalated">Escalated</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sectorFilter} onValueChange={handleSectorFilterChange}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Sector" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sectors</SelectItem>
                                {sectors.map((sector) => (
                                    <SelectItem key={sector._id} value={sector._id}>
                                        {sector.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={serviceFilter} onValueChange={handleServiceFilterChange}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Service" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Services</SelectItem>
                                {SERVICES.map((service) => (
                                    <SelectItem key={service} value={service}>
                                        {service}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {loading && complaints.length === 0 ? (
                    <div className="flex h-40 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 p-4">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                        <p className="text-center text-red-600">{error}</p>
                    </div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Citizen</TableHead>
                                    <TableHead>Organization</TableHead>
                                    <TableHead>Sector</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredComplaints.length > 0 ? (
                                    filteredComplaints.map((complaint) => (
                                        <TableRow key={complaint._id}>
                                            <TableCell className="font-medium">{complaint.title}</TableCell>
                                            <TableCell>
                                                {complaint.citizen.firstName} {complaint.citizen.lastName}
                                            </TableCell>
                                            <TableCell>{complaint.organization.name}</TableCell>
                                            <TableCell>{complaint.sector.name}</TableCell>
                                            <TableCell>{complaint.service}</TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(complaint.status)}>
                                                    <span className="flex items-center gap-1">
                                                        {getStatusIcon(complaint.status)}
                                                        {complaint.status.replace("_", " ")}
                                                    </span>
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(complaint.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewComplaint(complaint)}
                                                    >
                                                        <MessageSquare className="h-4 w-4" />
                                                        <span className="sr-only">View</span>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center">
                                            No complaints found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {selectedComplaint && (
                    <AdminComplaintDialog
                    //@ts-ignore unmatch types
                        complaint={selectedComplaint}
                        isOpen={!!selectedComplaint}
                        onClose={closeComplaintDetails}
                        onUpdate={handleComplaintUpdate}
                    />
                )}
            </div>
        </div>
    )
}
