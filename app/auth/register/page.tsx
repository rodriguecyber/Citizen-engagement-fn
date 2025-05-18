"use client"

import type React from "react"
import axios from 'axios'
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { API_URL } from "@/lib/api"

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post(`${API_URL}/auth/register`,formData, {
        headers: { 'Content-Type': 'application/json' },
  
      });

      const data = await response.data;

      // Simulate registration
      setTimeout(() => {
        router.push("/auth/login")
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Registration error:", error)
      setIsLoading(false)
    }
  }

  // Rwanda location data - simplified for example
  const provinces = ["Kigali", "Northern", "Southern", "Eastern", "Western"]

  const districts = {
    Kigali: ["Gasabo", "Kicukiro", "Nyarugenge"],
    Northern: ["Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo"],
    Southern: ["Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango"],
    Eastern: ["Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana"],
    Western: ["Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rusizi", "Rutsiro"],
  }

  // Example sectors for Gasabo district
  const sectors = {
    Gasabo: [
      "Bumbogo",
      "Gatsata",
      "Gikomero",
      "Gisozi",
      "Jabana",
      "Jali",
      "Kacyiru",
      "Kimihurura",
      "Kimironko",
      "Kinyinya",
      "Ndera",
      "Nduba",
      "Remera",
      "Rusororo",
      "Rutunga",
    ],
  }

  return (
    <div className="container py-10">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-primary">Create an account</CardTitle>
          <CardDescription>Register as a citizen to submit and track complaints</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="province" className="sr-only">
                    Province
                  </Label>
                  <Select value={formData.province} onValueChange={(value) => handleSelectChange(value, "province")}>
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

                <div>
                  <Label htmlFor="district" className="sr-only">
                    District
                  </Label>
                  <Select
                    value={formData.district}
                    onValueChange={(value) => handleSelectChange(value, "district")}
                    disabled={!formData.province}
                  >
                    <SelectTrigger id="district">
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.province &&
                        districts[formData.province as keyof typeof districts]?.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sector" className="sr-only">
                    Sector
                  </Label>
                  <Select
                    value={formData.sector}
                    onValueChange={(value) => handleSelectChange(value, "sector")}
                    disabled={!formData.district}
                  >
                    <SelectTrigger id="sector">
                      <SelectValue placeholder="Select Sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.district &&
                        sectors[formData.district as keyof typeof sectors]?.map((sector) => (
                          <SelectItem key={sector} value={sector}>
                            {sector}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="cell" className="sr-only">
                    Cell
                  </Label>
                  <Input
                    id="cell"
                    placeholder="Cell"
                    value={formData.cell}
                    onChange={handleChange}
                    disabled={!formData.sector}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="village" className="sr-only">
                    Village
                  </Label>
                  <Input
                    id="village"
                    placeholder="Village"
                    value={formData.village}
                    onChange={handleChange}
                    disabled={!formData.cell}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
