import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Users, FileText, CheckCircle, Clock } from "lucide-react"

export default function OrgAdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Organization Admin Dashboard</h2>
        <p className="text-muted-foreground">Manage districts and district administrators for your organization.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Districts</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">District Admins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+34 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">+4% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Districts Overview</CardTitle>
            <CardDescription>Districts your organization is operating in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { district: "Gasabo", sectors: 15, complaints: 42, resolved: 37 },
                { district: "Kicukiro", sectors: 10, complaints: 38, resolved: 32 },
                { district: "Nyarugenge", sectors: 10, complaints: 26, resolved: 20 },
                { district: "Burera", sectors: 8, complaints: 18, resolved: 15 },
                { district: "Musanze", sectors: 12, complaints: 32, resolved: 28 },
              ].map((district, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{district.district}</p>
                    <p className="text-sm text-muted-foreground">{district.sectors} sectors</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{district.complaints} complaints</p>
                    <p className="text-sm text-green-600">{district.resolved} resolved</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
            <CardDescription>Service delivery performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium">Maximum Service Days:</span>
                </div>
                <span className="font-bold">5 days</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Average Resolution Time</span>
                  <span>3.2 days</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: "64%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Within Service Level Agreement</span>
                  <span>92%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: "92%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Exceeded Service Days</span>
                  <span>8%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-red-500" style={{ width: "8%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
