"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Building2, Users, MapPin, FileText, Settings, LogOut, Menu, X } from "lucide-react"

type SidebarProps = {
  userType: "superadmin" | "orgadmin" | "districtadmin" | "sectoradmin" | "citizen"
}

export function Sidebar({ userType }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Define navigation items based on user type
  const getNavigationItems = () => {
    switch (userType) {
      case "superadmin":
        return [
          { name: "Dashboard", href: "/dashboard/superadmin", icon: LayoutDashboard },
          { name: "Organizations", href: "/dashboard/superadmin/organizations", icon: Building2 },
          { name: "Admins", href: "/dashboard/superadmin/admins", icon: Users },
          { name: "Settings", href: "/dashboard/superadmin/settings", icon: Settings },
        ]
      case "orgadmin":
        return [
          { name: "Dashboard", href: "/dashboard/orgadmin", icon: LayoutDashboard },
          { name: "Districts", href: "/dashboard/orgadmin/districts", icon: MapPin },
          { name: "District Admins", href: "/dashboard/orgadmin/admins", icon: Users },
          { name: "Complaints", href: "/dashboard/orgadmin/complaints", icon: FileText },
          { name: "Settings", href: "/dashboard/orgadmin/settings", icon: Settings },
        ]
      case "districtadmin":
        return [
          { name: "Dashboard", href: "/dashboard/districtadmin", icon: LayoutDashboard },
          { name: "Sectors", href: "/dashboard/districtadmin/sectors", icon: MapPin },
          { name: "Sector Admins", href: "/dashboard/districtadmin/admins", icon: Users },
          { name: "Complaints", href: "/dashboard/districtadmin/complaints", icon: FileText },
          { name: "Settings", href: "/dashboard/districtadmin/settings", icon: Settings },
        ]
      case "sectoradmin":
        return [
          { name: "Dashboard", href: "/dashboard/sectoradmin", icon: LayoutDashboard },
          { name: "Complaints", href: "/dashboard/sectoradmin/complaints", icon: FileText },
          { name: "Citizens", href: "/dashboard/sectoradmin/citizens", icon: Users },
          { name: "Settings", href: "/dashboard/sectoradmin/settings", icon: Settings },
        ]
      case "citizen":
        return [
          { name: "Dashboard", href: "/dashboard/citizen", icon: LayoutDashboard },
          { name: "My Complaints", href: "/dashboard/citizen/complaints", icon: FileText },
          { name: "New Complaint", href: "/dashboard/citizen/new-complaint", icon: FileText },
          { name: "Profile", href: "/dashboard/citizen/profile", icon: Users },
        ]
      default:
        return []
    }
  }

  const navigation = getNavigationItems()

  return (
    <>
      <div className="fixed left-4 top-4 z-50 md:hidden w-fit ">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar for mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 transform bg-white transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col pt-16">
          <div className="mb-8 px-6 py-4">
            <h2 className="text-xl font-bold text-primary">Citizen Engagement</h2>
            <p className="text-sm text-gray-500">{userType.charAt(0).toUpperCase() + userType.slice(1)} Portal</p>
          </div>
          <div className="flex-1 space-y-1 px-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  pathname === item.href ? "bg-primary text-white" : "text-gray-700 hover:bg-primary/10",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
          <div className="mt-auto p-4">
            <Button
              variant="outline"
              className="w-full justify-start text-red-500"
              onClick={() => {
                // Handle logout logic here
                setIsOpen(false)
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden h-screen w-64 flex-shrink-0 flex-col border-r bg-white md:flex">
        <div className="mb-8 px-6 py-6">
          <h2 className="text-xl font-bold text-primary">Citizen Engagement</h2>
          <p className="text-sm text-gray-500">{userType.charAt(0).toUpperCase() + userType.slice(1)} Portal</p>
        </div>
        <div className="flex-1 space-y-1 px-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                pathname === item.href ? "bg-primary text-white" : "text-gray-700 hover:bg-primary/10",
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </div>
        <div className="mt-auto p-4">
          <Button variant="outline" className="w-full justify-start text-red-500" asChild>
            <Link href="/auth/login">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Link>
          </Button>
        </div>
      </div>
    </>
  )
}
