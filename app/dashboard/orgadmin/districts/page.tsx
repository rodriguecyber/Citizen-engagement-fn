"use client"

import type React from "react"

import { useEffect, useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Check, AlertCircle } from "lucide-react"
import axios from "axios"
import { API_URL } from "@/lib/api"

// Sample district data
interface DistrictAdmin {
  firstName: string | null;
  email: string | null;
  phone: string | null;
}

interface IDistrict extends DistrictAdmin {
  id: number;
  name: string;
  province: string;
  sectors: number;
  active: boolean;
}

// Rwanda provinces data
const provinces = ["Kigali", "Northern", "Southern", "Eastern", "Western"]

// Rwanda districts data organized by province
const districtsByProvince = {
  Kigali: ["Gasabo", "Kicukiro", "Nyarugenge"],
  Northern: ["Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo"],
  Southern: ["Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango"],
  Eastern: ["Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana"],
  Western: ["Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rusizi", "Rutsiro"],
}

export default function DistrictsPage() {
  const [districts, setDistricts] = useState<IDistrict[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDistrictDialogOpen, setIsAddDistrictDialogOpen] = useState(false)
  const [isAddAdminDialogOpen, setIsAddAdminDialogOpen] = useState(false)
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null)

  const [newDistrict, setNewDistrict] = useState({
    province: "",
    district: "",
  })

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleDistrictChange = (field: string, value: string) => {
    setNewDistrict((prev) => ({ ...prev, [field]: value }))
  }

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAdmin((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddDistrict = async () => {
    const exists = districts.some((d) => d.name === newDistrict.district && d.province === newDistrict.province)

    if (!exists && newDistrict.district && newDistrict.province) {
      const newDistrictObj = {
        id: districts.length + 1,
        name: newDistrict.district,
        province: newDistrict.province,
        sectors: districtsByProvince[newDistrict.province as keyof typeof districtsByProvince].length || 0,
        active: false,
        firstName: null,
        email: null,
        phone: null,
      }
     await axios.post(`${API_URL}/districts/`, { name: newDistrict.district, province: newDistrict.province }, {

        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      })

      setDistricts([...districts, newDistrictObj])
      setNewDistrict({
        province: "",
        district: "",
      })
      setIsAddDistrictDialogOpen(false)
    }
  }

  useEffect(() => {
    const fetchDistrict = async () => {
      try {
        const response = await axios.get(`${API_URL}/districts/`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        })
        setDistricts(response.data.districts)
      } catch (error) {

      }
    }

    fetchDistrict()

  }, [])

  const handleAddAdmin = async () => {
    if (selectedDistrict && newAdmin.name && newAdmin.email && newAdmin.phone) {
      const updatedDistricts = districts.map((district) => {
        if (district.id === selectedDistrict.id) {
          return {
            ...district,
            active: true,
            name: newAdmin.name,
            email: newAdmin.email,
            phone: newAdmin.phone,
          }
        }
        return district
      })
   await axios.post(`${API_URL}/districts/${selectedDistrict._id}/assign-admin`, newAdmin, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      })
      setDistricts(updatedDistricts)
      setNewAdmin({
        name: "",
        email: "",
        phone: "",
      })
      setSelectedDistrict(null)
      setIsAddAdminDialogOpen(false)
    }
  }

  const handleAssignAdmin = (district: any) => {
    setSelectedDistrict(district)
    setIsAddAdminDialogOpen(true)
  }

  const filteredDistricts = districts.filter(
    (district) =>
      district.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      district.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (district.firstName && district.name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Districts</h2>
          <p className="text-muted-foreground">Manage districts and their administrators</p>
        </div>
        <Dialog open={isAddDistrictDialogOpen} onOpenChange={setIsAddDistrictDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white">
              <Plus className="mr-2 h-4 w-4" /> Add District
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New District</DialogTitle>
              <DialogDescription>Select a district to add to your organization</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Select value={newDistrict.province} onValueChange={(value) => handleDistrictChange("province", value)}>
                  <SelectTrigger id="province">
                    <SelectValue placeholder="Select Province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Select
                  value={newDistrict.district}
                  onValueChange={(value) => handleDistrictChange("district", value)}
                  disabled={!newDistrict.province}
                >
                  <SelectTrigger id="district">
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    {newDistrict.province &&
                      districtsByProvince[newDistrict.province as keyof typeof districtsByProvince]?.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDistrictDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddDistrict}
                className="bg-primary text-white"
                disabled={!newDistrict.province || !newDistrict.district}
              >
                Add District
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
            placeholder="Search districts..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>District</TableHead>
              <TableHead>Province</TableHead>
              <TableHead>Sectors</TableHead>
              <TableHead>Admin Status</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDistricts.length > 0 ? (
              filteredDistricts.map((district) => (
                <TableRow key={district.id}>
                  <TableCell className="font-medium">{district.name}</TableCell>
                  <TableCell>{district.province}</TableCell>
                  <TableCell>{district.sectors}</TableCell>
                  <TableCell>
                    {district.active ? (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        <Check className="mr-1 h-3 w-3" /> Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-orange-500 text-orange-500">
                        <AlertCircle className="mr-1 h-3 w-3" /> Needs Admin
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {district.active ? (
                      <div className="text-sm">
                        <div>{district.name}</div>
                        <div className="text-muted-foreground">{district.email}</div>
                        <div className="text-muted-foreground">{district.phone}</div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-primary"
                        onClick={() => handleAssignAdmin(district)}
                      >
                        Assign Admin
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="sm">
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
                  No districts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add District Admin Dialog */}
      <Dialog open={isAddAdminDialogOpen} onOpenChange={setIsAddAdminDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add District Administrator</DialogTitle>
            <DialogDescription>
              {selectedDistrict
                ? `Assign an administrator for ${selectedDistrict.name} district`
                : "Assign an administrator"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="adminName">Full Name</Label>
              <Input
                id="adminName"
                name="name"
                value={newAdmin.name}
                onChange={handleAdminChange}
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email</Label>
              <Input
                id="adminEmail"
                name="email"
                type="email"
                value={newAdmin.email}
                onChange={handleAdminChange}
                placeholder="e.g. john.doe@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminPhone">Phone Number</Label>
              <Input
                id="adminPhone"
                name="phone"
                type="tel"
                value={newAdmin.phone}
                onChange={handleAdminChange}
                placeholder="e.g. +250 788 123 456"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAdminDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddAdmin}
              className="bg-primary text-white"
              disabled={!newAdmin.name || !newAdmin.email || !newAdmin.phone}
            >
              Assign Administrator
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
