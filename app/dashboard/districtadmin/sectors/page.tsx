"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Check, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
import axios from "axios"
import districts from "@/lib/districts"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { API_URL } from "@/lib/api"

interface Sector {
    _id: string
    name: string
    district: { name: string, _id: string }
    userCount: number
    complaintCount: number
    admin?: {
        _id: string
        firstName: string
        lastName: string
        email: string
    }
   
}

export default function SectorsPage() {
    const [sectors, setSectors] = useState<Sector[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddSectorDialogOpen, setIsAddSectorDialogOpen] = useState(false)
    const [isAddAdminDialogOpen, setIsAddAdminDialogOpen] = useState(false)
    const [isEditSectorDialogOpen, setIsEditSectorDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedSector, setSelectedSector] = useState<Sector | null>(null)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalSectors, setTotalSectors] = useState(0)
    const [userDistrict, setUserDistrict] = useState<{ _id: string, name: string }>()

    const [newSector, setNewSector] = useState({
        name: "",
        district: "",
    })

    const [newAdmin, setNewAdmin] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    })

    // Fetch user's district and sectors data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true)
                // Fetch user's district
                const userResponse = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                const userData = userResponse.data
                setUserDistrict(userData.district)
                setNewSector(prev => ({ ...prev, district: userData.district._id }))

                // Fetch sectors for the district
                const sectorsResponse = await axios.get(`http://localhost:5000/api/sectors?district=${userData.district._id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                setSectors(sectorsResponse.data.sectors)
                setTotalSectors(sectorsResponse.data.sectors.length)
                setTotalPages(Math.ceil(sectorsResponse.data.sectors.length / 10))
                setError(null)
            } catch (err) {
                console.error("Error fetching data:", err)
                setError("Failed to load data. Please try again.")
                toast({
                    title: "Error",
                    description: "Failed to load data. Please try again.",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
        setPage(1)
    }

    const handleSectorChange = (field: string, value: string) => {
        setNewSector((prev) => ({ ...prev, [field]: value }))
    }

   

    const handleAdminChange = (field: string, value: string) => {
        setNewAdmin((prev) => ({ ...prev, [field]: value }))
    }

    const handleAddSector = async () => {
        try {
            setLoading(true)
            const response = await axios.post(`${API_URL}/sectors`, newSector, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },

            })
            const data = await response.data

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Add new sector to the list (in a real app, we would use the returned data)
            //@ts-ignore error
            setSectors((prev) => [newSector, ...prev])
            setTotalSectors((prev) => prev + 1)

            // Reset form and close dialog
            setNewSector({
                name: "",
                district: "",
            })
            setIsAddSectorDialogOpen(false)

            toast({
                title: "Success",
                description: `Sector "${newSector.name}" has been created successfully.`,
            })
        } catch (err) {
            console.error("Error adding sector:", err)
            toast({
                title: "Error",
                description: "Failed to create sector. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteSector = async () => {
        if (!selectedSector) return

        try {
            setLoading(true)
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Remove sector from the list
            setSectors((prev) => prev.filter((sector) => sector._id !== selectedSector._id))
            setTotalSectors((prev) => prev - 1)

            // Close dialog
            setIsDeleteDialogOpen(false)
            setSelectedSector(null)

            toast({
                title: "Success",
                description: `Sector "${selectedSector.name}" has been deleted successfully.`,
            })
        } catch (err) {
            console.error("Error deleting sector:", err)
            toast({
                title: "Error",
                description: "Failed to delete sector. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleAssignAdmin = async () => {
        if (!selectedSector) return

        try {
            setLoading(true)
            // In a real app, this would be an API call
            const response = await axios.post(`${API_URL}/sectors/${selectedSector._id}/assign-admin`,newAdmin, {
              headers: {
                 'Content-Type': 'application/json' ,
                'Authorization':`Bearer ${localStorage.getItem('token')}`
                },


            })
            const data = await response.data

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Update sector in the list with new admin
            setSectors((prev) =>
                prev.map((sector) => {
                    if (sector._id === selectedSector._id) {
                        return {
                            ...sector,
                            admin:data.admin
                        }
                    }
                    return sector
                }),
            )

            // Reset form and close dialog
            setNewAdmin({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
            })
            setIsAddAdminDialogOpen(false)
            setSelectedSector(null)

            toast({
                title: "Success",
                description: `Admin has been assigned to sector successfully.`,
            })
        } catch (err) {
            console.error("Error assigning admin:", err)
            toast({
                title: "Error",
                description: "Failed to assign admin. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const openEditDialog = (sector: Sector) => {
        setSelectedSector(sector)
        setIsEditSectorDialogOpen(true)
    }

    const openDeleteDialog = (sector: Sector) => {
        setSelectedSector(sector)
        setIsDeleteDialogOpen(true)
    }

    const openAssignAdminDialog = (sector: Sector) => {
        setSelectedSector(sector)
        setIsAddAdminDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Sectors</h2>
                    <p className="text-muted-foreground">Manage sectors and their administrators in {userDistrict?.name} district</p>
                </div>
                <Dialog open={isAddSectorDialogOpen} onOpenChange={setIsAddSectorDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary text-white">
                            <Plus className="mr-2 h-4 w-4" /> Add Sector
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add New Sector</DialogTitle>
                            <DialogDescription>Create a new sector in {userDistrict?.name} district</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Sector Name</Label>
                                <Select
                                    value={newSector.name}
                                    onValueChange={(value) => handleSectorChange("name", value)}
                                >
                                    <SelectTrigger id="name">
                                        <SelectValue placeholder="Select Sector" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {userDistrict &&
                                            districts[userDistrict?.name as keyof typeof districts]?.map((sector) => (
                                                <SelectItem key={sector} value={sector}>
                                                    {sector}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>



                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddSectorDialogOpen(false)} disabled={loading}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAddSector}
                                className="bg-primary text-white"
                                disabled={loading || !newSector.name || !newSector.district}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                                    </>
                                ) : (
                                    "Add Sector"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search sectors by name, description or admin..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Sectors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSectors}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Sectors with Admin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {sectors.filter((sector) => sector.admin).length}/{totalSectors}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Citizens</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sectors.reduce((sum, sector) => sum + sector.userCount, 0)}</div>
                    </CardContent>
                </Card>
            </div>

            {loading && sectors.length === 0 ? (
                <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 p-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                    <p className="text-center text-red-600">{error}</p>
                    {/* <Button onClick={fetchSectors} variant="outline" size="sm">
                        Try Again
                    </Button> */}
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sector Name</TableHead>
                                <TableHead>Admin Status</TableHead>
                                {/* <TableHead className="hidden lg:table-cell">Citizens</TableHead> */}
                                <TableHead className="hidden lg:table-cell">Complaints</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sectors.length > 0 ? (
                                sectors.map((sector) => (
                                    <TableRow key={sector._id}>
                                        <TableCell className="font-medium">{sector.name}</TableCell>
                                        
                                        <TableCell>
                                            {sector.admin ? (
                                                <Badge className="bg-green-500 hover:bg-green-600">
                                                    <Check className="mr-1 h-3 w-3" /> Active
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="border-orange-500 text-orange-500">
                                                    <AlertCircle className="mr-1 h-3 w-3" /> Needs Admin
                                                </Badge>
                                            )}
                                        </TableCell>
                                        {/* <TableCell className="hidden lg:table-cell">{sector.admin?.firstName}</TableCell> */}
                                        <TableCell className="hidden lg:table-cell">{sector.complaintCount}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button variant="ghost" size="sm" onClick={() => openEditDialog(sector)}>
                                                    <Edit className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Button>
                                                {!sector.admin && (
                                                    <Button variant="ghost" size="sm" onClick={() => openAssignAdminDialog(sector)}>
                                                        <Plus className="h-4 w-4 text-green-500" />
                                                        <span className="sr-only">Assign Admin</span>
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(sector)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No sectors found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

            {totalPages > 1 && (
                //@ts-ignore error
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="flex justify-center" />
            )}

            {/* Edit Sector Dialog */}


            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Sector</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the sector "{selectedSector?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteSector}
                            variant="destructive"
                            className="bg-red-500 text-white hover:bg-red-600"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                                </>
                            ) : (
                                "Delete Sector"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Sector Admin Dialog */}
            <Dialog open={isAddAdminDialogOpen} onOpenChange={setIsAddAdminDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Sector Administrator</DialogTitle>
                        <DialogDescription>
                            {selectedSector ? `Assign an administrator for ${selectedSector.name} sector` : "Assign an administrator"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="adminFirstName">First Name</Label>
                            <Input
                                id="adminFirstName"
                                value={newAdmin.firstName}
                                onChange={(e) => handleAdminChange("firstName", e.target.value)}
                                placeholder="e.g. John"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="adminLastName">Last Name</Label>
                            <Input
                                id="adminLastName"
                                value={newAdmin.lastName}
                                onChange={(e) => handleAdminChange("lastName", e.target.value)}
                                placeholder="e.g. Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="adminEmail">Email</Label>
                            <Input
                                id="adminEmail"
                                type="email"
                                value={newAdmin.email}
                                onChange={(e) => handleAdminChange("email", e.target.value)}
                                placeholder="e.g. john.doe@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="adminPhone">Phone Number</Label>
                            <Input
                                id="adminPhone"
                                value={newAdmin.phone}
                                onChange={(e) => handleAdminChange("phone", e.target.value)}
                                placeholder="e.g. +250 788 123 456"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddAdminDialogOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAssignAdmin}
                            className="bg-primary text-white"
                            disabled={loading || !newAdmin.firstName || !newAdmin.lastName || !newAdmin.email || !newAdmin.phone}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Assigning...
                                </>
                            ) : (
                                "Assign Administrator"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
