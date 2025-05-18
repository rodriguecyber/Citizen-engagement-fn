"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {Upload, X, FileText, Image } from "lucide-react"
import axios from "axios"
import { Sidebar } from "@/components/dashboard/sidebar"
import { useToast } from "@/hooks/use-toast"
import { API_URL } from "@/lib/api"


interface Organization {
  _id: string
  name: string
  services: string[]
  districts: District[]
  admin: {
    _id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
}

interface District {
  _id: string
  name: string
  sectors: Sector[]
}

interface Sector {
  _id: string
  name: string
  active: boolean
}

interface FileWithPreview extends File {
  preview?: string;
}

export default function NewComplaintPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrg, setSelectedOrg] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [selectedSector, setSelectedSector] = useState<string>("")
  const [selectedService, setSelectedService] = useState<string>("")
  const [escalateToOrg, setEscalateToOrg] = useState(false)
  const [escalateToDistrict, setEscalateToDistrict] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    escalationReason: "",
  })
  const [idDocument, setIdDocument] = useState<FileWithPreview | null>(null)
  const [additionalDocuments, setAdditionalDocuments] = useState<FileWithPreview[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const additionalFilesInputRef = useRef<HTMLInputElement>(null)
const {toast} = useToast()
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get(`${API_URL}/organizations`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        })
        setOrganizations(response.data)
      } catch (error) {
        console.error("Error fetching organizations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrganizations()
  }, [])

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      if (idDocument?.preview) URL.revokeObjectURL(idDocument.preview)
      additionalDocuments.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview)
      })
    }
  }, [idDocument, additionalDocuments])

  const handleIdDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
        
        return
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "ID document must be less than 5MB",
          variant: "destructive",
        })
        return
      }
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
      setIdDocument(fileWithPreview)
    }
  }

  const handleAdditionalDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    // Validate number of files
    if (additionalDocuments.length + files.length > 5) {
      toast({
        title: "Too many files",
        description: "You can upload up to 5 additional documents",
        variant: "destructive",
      })
      return
    }
    // Validate each file
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type`,
          variant: "destructive",
        })
      }
      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive",
        })
      }
      return isValidType && isValidSize
    })
    const filesWithPreview = validFiles.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    )
    setAdditionalDocuments(prev => [...prev, ...filesWithPreview])
  }

  const removeIdDocument = () => {
    if (idDocument?.preview) URL.revokeObjectURL(idDocument.preview)
    setIdDocument(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const removeAdditionalDocument = (index: number) => {
    const file = additionalDocuments[index]
    if (file.preview) URL.revokeObjectURL(file.preview)
    setAdditionalDocuments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idDocument) {
      toast({
        title: "ID Document Required",
        description: "Please upload your ID document",
        variant: "destructive",
      })
      return
    }

    try {
      setUploading(true)
      const formDataObj = new FormData()

      // Append complaint data
      formDataObj.append('title', formData.title)
      formDataObj.append('description', formData.description)
      formDataObj.append('service', selectedService)
      formDataObj.append('organization', selectedOrg)
      if (!escalateToOrg) formDataObj.append('district', selectedDistrict)
      if (!escalateToOrg && !escalateToDistrict) formDataObj.append('sector', selectedSector)
      formDataObj.append('escalateToDistrict', String(escalateToDistrict))
      formDataObj.append('escalateToOrg', String(escalateToOrg))
      formDataObj.append('escalationLevel', escalateToOrg ? 'organization' : escalateToDistrict ? 'district' : 'sector')

      if (escalateToOrg || escalateToDistrict) {
        formDataObj.append('escalationReason', formData.escalationReason)
      }

      // Combine all documents into a single array
      const allDocuments = [
        { file: idDocument, type: 'id' },
        ...additionalDocuments.map(file => ({ file, type: 'additional' }))
      ]

      allDocuments.forEach((doc, index) => {
        formDataObj.append('documents', doc.file)
      })

      await axios.post(`${API_URL}/complaints`, formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      toast({
        title: "Success",
        description: escalateToOrg || escalateToDistrict
          ? "Your escalated complaint has been submitted successfully. It will be reviewed by the appropriate authority."
          : "Your complaint has been submitted successfully.",
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        escalationReason: "",
      })
      setSelectedOrg("")
      setSelectedDistrict("")
      setSelectedSector("")
      setSelectedService("")
      setEscalateToDistrict(false) 
      setEscalateToOrg(false)
      removeIdDocument()
      setAdditionalDocuments([])
      window.location.href='/dashboard/citizen'
    } catch (error) {
        toast
    } finally {
      setUploading(false)
    }
  }

  const selectedOrgData = organizations.find((org) => org._id === selectedOrg)
  const selectedDistrictData = selectedOrgData?.districts.find((dist) => dist._id === selectedDistrict)

  // Handle escalation changes
  const handleEscalationChange = (type: 'district' | 'org', checked: boolean) => {
    if (type === 'org') {
      setEscalateToOrg(checked)
      if (checked) {
        setEscalateToDistrict(false)
        setSelectedDistrict("")
        setSelectedSector("")
      }
    } else {
      setEscalateToDistrict(checked)
      if (checked) {
        setSelectedSector("")
      }
    }
  }

  return (
    <div className="flex">
      <Sidebar userType="citizen" />

      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Submit New Complaint</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                    <SelectTrigger id="organization">
                      <SelectValue placeholder="Select Organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org._id} value={org._id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedOrg && (
                  <div className="space-y-2">
                    <Label htmlFor="service">Service</Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger id="service">
                        <SelectValue placeholder="Select Service" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedOrgData?.services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedOrg && !escalateToOrg && (
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                      <SelectTrigger id="district">
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedOrgData?.districts.map((district) => (
                          <SelectItem key={district._id} value={district._id}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedDistrict && !escalateToDistrict && !escalateToOrg && (
                  <div className="space-y-2">
                    <Label htmlFor="sector">Sector</Label>
                    <Select value={selectedSector} onValueChange={setSelectedSector}>
                      <SelectTrigger id="sector">
                        <SelectValue placeholder="Select Sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedDistrictData?.sectors
                          .filter((sector) => sector.active)
                          .map((sector) => (
                            <SelectItem key={sector._id} value={sector._id}>
                              {sector.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="escalateToOrg"
                      checked={escalateToOrg}
                      onCheckedChange={(checked) => handleEscalationChange('org', checked as boolean)}
                    />
                    <Label htmlFor="escalateToOrg" className="text-sm">
                      Escalate to Organization Level (if the organization doesn't operate in your district)
                    </Label>
                  </div>

                  {!escalateToOrg && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="escalateToDistrict"
                        checked={escalateToDistrict}
                        onCheckedChange={(checked) => handleEscalationChange('district', checked as boolean)}
                      />
                      <Label htmlFor="escalateToDistrict" className="text-sm">
                        Escalate to District Level (if your sector is not available)
                      </Label>
                    </div>
                  )}

                  {(escalateToOrg || escalateToDistrict) && (
                    <div className="space-y-2">
                      <Label htmlFor="escalationReason">Reason for Escalation</Label>
                      <Textarea
                        id="escalationReason"
                        value={formData.escalationReason}
                        onChange={(e) => setFormData({ ...formData, escalationReason: e.target.value })}
                        placeholder={`Please explain why you need to escalate to ${escalateToOrg ? 'organization' : 'district'} level`}
                        rows={2}
                        required
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Complaint Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Brief description of your complaint"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Please provide detailed information about your complaint"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="idDocument">ID Document (Required)</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="idDocument"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleIdDocumentChange}
                        ref={fileInputRef}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload ID Document
                      </Button>
                    </div>
                    {idDocument && (
                      <div className="mt-2 flex items-center gap-2 rounded-md border p-2">
                        {idDocument.type.startsWith('image/') ? (
                          <Image className="h-8 w-8 text-blue-500" />
                        ) : (
                          <FileText className="h-8 w-8 text-blue-500" />
                        )}
                        <span className="flex-1 truncate text-sm">{idDocument.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeIdDocument}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Upload a clear image or PDF of your ID (max 5MB)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalDocuments">Additional Documents (Optional)</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="additionalDocuments"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                        multiple
                        onChange={handleAdditionalDocumentsChange}
                        ref={additionalFilesInputRef}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => additionalFilesInputRef.current?.click()}
                        className="w-full"
                        disabled={additionalDocuments.length >= 5}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Additional Documents
                      </Button>
                    </div>
                    {additionalDocuments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {additionalDocuments.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 rounded-md border p-2">
                            {file.type.startsWith('image/') ? (
                              <Image className="h-8 w-8 text-blue-500" />
                            ) : (
                              <FileText className="h-8 w-8 text-blue-500" />
                            )}
                            <span className="flex-1 truncate text-sm">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAdditionalDocument(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Upload up to 5 additional documents (max 10MB each)
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={uploading || (!selectedOrg) || (!selectedService) ||
                  (!escalateToOrg && !selectedDistrict) ||
                  (!escalateToOrg && !escalateToDistrict && !selectedSector) ||
                  ((escalateToOrg || escalateToDistrict) && !formData.escalationReason) ||
                  !idDocument
                }
              >
                {uploading ? "Submitting..." : "Submit Complaint"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>

  )
}
