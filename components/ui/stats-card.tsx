import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

interface StatsCardProps {
    title: string
    value: number
    icon: React.ReactNode
    description: string
    trend: string
    trendUp: boolean
}

export function StatsCard({ title, value, icon, description, trend, trendUp }: StatsCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
                <div className="flex items-center pt-1">
                    {trendUp ? (
                        <ArrowUpIcon className="h-4 w-4 text-green-500" />
                    ) : (
                        <ArrowDownIcon className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-xs text-muted-foreground ml-1">{trend}</span>
                </div>
            </CardContent>
        </Card>
    )
} 