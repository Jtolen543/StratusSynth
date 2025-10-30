"use client"

import { useUserUsages } from "./queries/use-get-usages"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { 
  Activity,
  Clock, 
  AlertCircle,
  CheckCircle,
  Zap,
  Database,
  Upload,
  Mail,
  Globe,
  Search,
  FileText,
  Users
} from "lucide-react"

const getMetricIcon = (metric: string) => {
  const iconMap: Record<string, any> = {
    "api_calls": Globe,
    "file_uploads": Upload,
    "email_sends": Mail,
    "database_queries": Database,
    "search_requests": Search,
    "document_views": FileText,
    "user_invites": Users,
    "storage_usage": Database,
    "bandwidth_usage": Zap
  }
  return iconMap[metric] || Activity
}

const getMetricName = (metric: string) => {
  const nameMap: Record<string, string> = {
    "api_calls": "API Calls",
    "file_uploads": "File Uploads",
    "email_sends": "Email Sends",
    "database_queries": "Database Queries",
    "search_requests": "Search Requests",
    "document_views": "Document Views",
    "user_invites": "User Invites",
    "storage_usage": "Storage Usage",
    "bandwidth_usage": "Bandwidth Usage"
  }
  return nameMap[metric] || metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatCount = (count: number, metric: string) => {
  if (metric.includes('storage') || metric.includes('bandwidth')) {
    if (count >= 1024 * 1024 * 1024) {
      return `${(count / (1024 * 1024 * 1024)).toFixed(1)} GB`
    } else if (count >= 1024 * 1024) {
      return `${(count / (1024 * 1024)).toFixed(1)} MB`
    } else if (count >= 1024) {
      return `${(count / 1024).toFixed(1)} KB`
    }
    return `${count} bytes`
  }
  return count.toLocaleString()
}

export default function Page() {
  const userUsages = useUserUsages()
  
  if (userUsages.isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (userUsages.isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Error Loading Usage Data</h3>
                <p className="text-sm text-muted-foreground">
                  {typeof userUsages.error === 'string' ? userUsages.error : "Something went wrong"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const usages = userUsages.data

  return (
    <div className="space-y-6 mx-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Usage Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your service usage and activity across all features
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {usages.map((usage, index) => {
          const Icon = getMetricIcon(usage.metric)
          const metricName = getMetricName(usage.metric)
          const formattedCount = formatCount(usage.count, usage.metric)
          const formattedLimit = formatCount(usage.limit, usage.metric)
          const lastUpdated = new Date(usage.updatedAt).toLocaleDateString()
          const usagePercentage = usage.limit > 0 ? (usage.count / usage.limit) * 100 : 0
          const isNearLimit = usagePercentage >= 80
          const isOverLimit = usagePercentage >= 100
          
          return (
            <motion.div
              key={`${usage.metric}-${usage.referenceId}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-sm font-medium">{metricName}</CardTitle>
                  </div>
                  <Badge 
                    variant={isOverLimit ? "destructive" : isNearLimit ? "secondary" : "default"} 
                    className="text-xs"
                  >
                    {isOverLimit ? "Over Limit" : isNearLimit ? "Near Limit" : "Active"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-1">{formattedCount}</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Limit: {formattedLimit}</span>
                      <span>{usagePercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isOverLimit ? 'bg-destructive' : 
                          isNearLimit ? 'bg-yellow-500' : 
                          'bg-primary'
                        }`}
                        style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Updated {lastUpdated}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {usages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center text-center py-8">
                <div className="p-4 rounded-full bg-muted mb-4">
                  <Activity className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Usage Data Yet</h3>
                <p className="text-muted-foreground max-w-md">
                  Start using our services to see your usage statistics here. 
                  Your activity will be tracked and displayed in real-time.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {usages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates to your service usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {usages
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .slice(0, 5)
                  .map((usage) => {
                    const Icon = getMetricIcon(usage.metric)
                    const metricName = getMetricName(usage.metric)
                    const formattedCount = formatCount(usage.count, usage.metric)
                    const formattedLimit = formatCount(usage.limit, usage.metric)
                    const timeAgo = new Date(usage.updatedAt).toLocaleString()
                    const usagePercentage = usage.limit > 0 ? (usage.count / usage.limit) * 100 : 0
                    const isOverLimit = usagePercentage >= 100
                    const isNearLimit = usagePercentage >= 80
                    
                    return (
                      <div key={`${usage.metric}-${usage.referenceId}`} className="flex items-center gap-3 p-3 rounded-lg border">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{metricName}</p>
                          <p className="text-sm text-muted-foreground">
                            {formattedCount} / {formattedLimit} ({usagePercentage.toFixed(1)}%)
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{timeAgo}</p>
                          <div className={`flex items-center gap-1 text-xs ${
                            isOverLimit ? 'text-destructive' : 
                            isNearLimit ? 'text-yellow-600' : 
                            'text-green-600'
                          }`}>
                            <CheckCircle className="h-3 w-3" />
                            {isOverLimit ? 'Over Limit' : isNearLimit ? 'Near Limit' : 'Active'}
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
