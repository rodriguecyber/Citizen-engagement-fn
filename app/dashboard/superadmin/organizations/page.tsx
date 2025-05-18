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
import { Label } from "@/components/ui/label"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import axios from "axios"
import { API_URL } from "@/lib/api"

interface IOrg {
  _id?:string,
  admin?:{firstName:string, email:string}|string
  name: string,
  services:string,
  location: string,
  email: string,
  tel: string,
}
export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<IOrg[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newOrg, setNewOrg] = useState({
    name: "",
    services: "",
    location: "",
    email: "",
    tel: "",
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewOrg((prev) => ({ ...prev, [name]: value }))
  }

  const fetchOrganization = async()=>{
    try {
    const response =   await axios.get(`${API_URL}/organizations/`,{
      headers:{
        "Authorization":`Bearer ${localStorage.getItem('token')}`
      }
    })
      setOrganizations(response.data)
    } catch (error) {
      
    }
  }
  const handleAddOrganization = async() => {
    try {
      const response =   await axios.post(`${API_URL}/organizations/`,newOrg,{
        headers:{
          "Authorization":`Bearer ${localStorage.getItem('token')}`
        }
      })
        setOrganizations(response.data)
      } catch (error) {
        
      }
    setOrganizations([...organizations, newOrg])
    setNewOrg({
      name: "",
      services: "",
      location: "",
      email: "",
      tel: "",
    })
    setIsAddDialogOpen(false)
  }

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )
  useEffect(()=>{
    fetchOrganization()
  },[])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Organizations</h2>
          <p className="text-muted-foreground">Manage organizations and their administrators</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Organization</DialogTitle>
              <DialogDescription>
                Create a new organization and automatically generate admin credentials
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newOrg.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Rwanda Energy Group"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="services">Services</Label>
                <Input
                  id="services"
                  name="services"
                  value={newOrg.services}
                  onChange={handleInputChange}
                  placeholder="e.g. Electricity, Gas supply"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Office Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={newOrg.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Kigali, Nyarugenge"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newOrg.email}
                    onChange={handleInputChange}
                    placeholder="e.g. info@org.rw"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tel">Telephone</Label>
                  <Input
                    id="tel"
                    name="tel"
                    type="tel"
                    value={newOrg.tel}
                    onChange={handleInputChange}
                    placeholder="e.g. +250 788 123 456"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddOrganization}
                className="bg-primary text-white"
                disabled={!newOrg.name || !newOrg.email}
              >
                Add Organization
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
            placeholder="Search organizations..."
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
              <TableHead>Organization</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Admin Email</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrganizations.length > 0 ? (
              filteredOrganizations.map((org) => (
                <TableRow key={org._id}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell>{org.services}</TableCell>
                  <TableCell>{org.location}</TableCell>
                  <TableCell>
                    {org.email}
                    <br />
                    {org.tel}
                  </TableCell>
                  <TableCell>{(org.admin as {email:string})?.email}</TableCell>
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
                  No organizations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
