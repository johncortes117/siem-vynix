"use client"

import { useState } from "react"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Calendar,
  Clock,
  Database,
  Filter,
  Home,
  type LucideIcon,
  MoreHorizontal,
  Network,
  Search,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  Terminal,
  Users,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import EventsChart from "@/components/events-chart"
import RiskDistributionChart from "@/components/risk-distribution-chart"
import NetworkActivityMap from "@/components/network-activity-map"
import TimelineChart from "@/components/timeline-chart"

// Simulated security events data
const securityEvents = [
  {
    id: "EVT-7823",
    timestamp: "2025-05-19T07:42:13",
    type: "Authentication",
    source: "192.168.1.105",
    destination: "10.0.0.5",
    description: "Multiple failed login attempts",
    riskLevel: "high",
    status: "active",
  },
  {
    id: "EVT-7822",
    timestamp: "2025-05-19T07:38:45",
    type: "Network",
    source: "203.0.113.42",
    destination: "10.0.0.8",
    description: "Unusual port scanning activity",
    riskLevel: "high",
    status: "active",
  },
  {
    id: "EVT-7821",
    timestamp: "2025-05-19T07:35:22",
    type: "Malware",
    source: "192.168.1.110",
    destination: "198.51.100.23",
    description: "Suspicious outbound connection",
    riskLevel: "medium",
    status: "investigating",
  },
  {
    id: "EVT-7820",
    timestamp: "2025-05-19T07:30:18",
    type: "Data",
    source: "192.168.1.115",
    destination: "203.0.113.100",
    description: "Large data transfer to external IP",
    riskLevel: "medium",
    status: "investigating",
  },
  {
    id: "EVT-7819",
    timestamp: "2025-05-19T07:25:56",
    type: "System",
    source: "10.0.0.15",
    destination: "N/A",
    description: "Critical system service stopped",
    riskLevel: "medium",
    status: "resolved",
  },
  {
    id: "EVT-7818",
    timestamp: "2025-05-19T07:20:33",
    type: "Authentication",
    source: "192.168.1.120",
    destination: "10.0.0.5",
    description: "Successful login after multiple failures",
    riskLevel: "high",
    status: "investigating",
  },
  {
    id: "EVT-7817",
    timestamp: "2025-05-19T07:15:12",
    type: "Network",
    source: "192.168.1.125",
    destination: "10.0.0.1",
    description: "Internal network scanning",
    riskLevel: "medium",
    status: "active",
  },
  {
    id: "EVT-7816",
    timestamp: "2025-05-19T07:10:45",
    type: "Policy",
    source: "192.168.1.130",
    destination: "N/A",
    description: "Security policy violation",
    riskLevel: "low",
    status: "resolved",
  },
  {
    id: "EVT-7815",
    timestamp: "2025-05-19T07:05:22",
    type: "System",
    source: "10.0.0.20",
    destination: "N/A",
    description: "System update failure",
    riskLevel: "low",
    status: "resolved",
  },
  {
    id: "EVT-7814",
    timestamp: "2025-05-19T07:00:18",
    type: "Authentication",
    source: "192.168.1.135",
    destination: "10.0.0.5",
    description: "User account locked",
    riskLevel: "low",
    status: "resolved",
  },
]

// Navigation items
const navItems = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: Shield, label: "Security" },
  { icon: AlertTriangle, label: "Alerts" },
  { icon: BarChart3, label: "Reports" },
  { icon: Users, label: "Users" },
  { icon: Network, label: "Network" },
  { icon: Server, label: "Infrastructure" },
  { icon: Database, label: "Data" },
  { icon: Terminal, label: "Logs" },
  { icon: Settings, label: "Settings" },
]

// Risk level badge component
const RiskLevelBadge = ({ level }: { level: string }) => {
  const variants = {
    high: "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20",
    medium: "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20",
    low: "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20",
  }

  return (
    <Badge variant="outline" className={`${variants[level as keyof typeof variants]} font-medium`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </Badge>
  )
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    active: "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20",
    investigating: "bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20",
    resolved: "bg-slate-500/10 text-slate-500 border-slate-500/20 hover:bg-slate-500/20",
  }

  return (
    <Badge variant="outline" className={`${variants[status as keyof typeof variants]} font-medium`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

// Metric card component
const MetricCard = ({
  icon: Icon,
  title,
  value,
  change,
  changeType = "neutral",
  description,
}: {
  icon: LucideIcon
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  description?: string
}) => {
  const changeColor = {
    positive: "text-green-500",
    negative: "text-red-500",
    neutral: "text-slate-500",
  }

  return (
    <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
        <Icon className="h-4 w-4 text-slate-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && <p className={`text-xs ${changeColor[changeType]}`}>{change}</p>}
        {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Filter events based on risk level and search query
  const filteredEvents = securityEvents.filter((event) => {
    const matchesRisk = selectedRiskFilter === "all" || event.riskLevel === selectedRiskFilter
    const matchesSearch =
      event.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesRisk && matchesSearch
  })

  // Count events by risk level
  const eventCounts = {
    high: securityEvents.filter((e) => e.riskLevel === "high").length,
    medium: securityEvents.filter((e) => e.riskLevel === "medium").length,
    low: securityEvents.filter((e) => e.riskLevel === "low").length,
    total: securityEvents.length,
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen bg-slate-950 text-slate-50">
        <Sidebar className="border-r border-slate-800">
          <SidebarHeader className="border-b border-slate-800 px-4 py-6">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-cyan-500" />
              <h1 className="text-xl font-bold">Vynix</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton className={item.active ? "bg-slate-800 text-cyan-500" : ""}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-slate-800 p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-slate-800 text-cyan-500">AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Admin User</span>
                <span className="text-xs text-slate-500">Security Analyst</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 bg-slate-900 border-slate-800">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <header className="flex h-16 items-center gap-4 border-b border-slate-800 bg-slate-950/50 px-6 backdrop-blur-sm">
            <SidebarTrigger className="text-slate-400 hover:text-slate-50" />
            <div className="relative flex-1 max-w-xs sm:max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search events, alerts, users..."
                className="w-full bg-slate-900 border-slate-800 pl-9 focus-visible:ring-cyan-500"
              />
            </div>
            <div className="ml-auto flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-50 hidden sm:flex"
              >
                <Calendar className="h-4 w-4" />
                <span>May 19, 2025</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-50"
              >
                <Bell className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-50"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto p-6">
            <div className="mx-auto max-w-7xl space-y-6">
              {/* Page header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Security Dashboard</h1>
                  <p className="text-sm text-slate-400">Real-time security monitoring and event analysis</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-50"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                  </Button>
                  <Button size="sm" className="gap-2 bg-cyan-600 hover:bg-cyan-700">
                    <Terminal className="h-4 w-4" />
                    <span>Run Analysis</span>
                  </Button>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  icon={AlertTriangle}
                  title="Critical Alerts"
                  value="12"
                  change="+3 from yesterday"
                  changeType="negative"
                  description="4 require immediate attention"
                />
                <MetricCard
                  icon={Activity}
                  title="Active Threats"
                  value="8"
                  change="5 under investigation"
                  changeType="neutral"
                  description="2 high priority, 3 medium, 3 low"
                />
                <MetricCard
                  icon={Shield}
                  title="Security Score"
                  value="78/100"
                  change="+2 points this week"
                  changeType="positive"
                  description="Top vulnerabilities: Authentication (3), Network (2)"
                />
                <MetricCard
                  icon={Clock}
                  title="Avg. Response Time"
                  value="4m 32s"
                  change="-12s from last week"
                  changeType="positive"
                  description="Target: <5 minutes for critical events"
                />
              </div>

              {/* Charts and data */}
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Security Events Timeline</CardTitle>
                    <CardDescription className="text-slate-400">Last 24 hours of security events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TimelineChart />
                  </CardContent>
                </Card>
                <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Risk Distribution</CardTitle>
                    <CardDescription className="text-slate-400">Events by risk level</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RiskDistributionChart />
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Network Activity Map</CardTitle>
                    <CardDescription className="text-slate-400">
                      Geographic distribution of security events
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <NetworkActivityMap />
                  </CardContent>
                </Card>
                <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Event Types</CardTitle>
                    <CardDescription className="text-slate-400">Distribution by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EventsChart />
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-cyan-500" />
                          <span className="text-sm">Authentication</span>
                        </div>
                        <span className="text-sm font-medium">32%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-purple-500" />
                          <span className="text-sm">Network</span>
                        </div>
                        <span className="text-sm font-medium">28%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-amber-500" />
                          <span className="text-sm">Malware</span>
                        </div>
                        <span className="text-sm font-medium">18%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-red-500" />
                          <span className="text-sm">Data</span>
                        </div>
                        <span className="text-sm font-medium">12%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500" />
                          <span className="text-sm">System</span>
                        </div>
                        <span className="text-sm font-medium">10%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Security events table */}
              <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Security Events</CardTitle>
                      <CardDescription className="text-slate-400">
                        Recent security events detected in your environment
                      </CardDescription>
                      <div className="mt-2 text-xs text-slate-400">
                        <span className="font-medium text-cyan-500">526</span> events detected in the last 24 hours |
                        <span className="font-medium text-red-500 ml-2">+18%</span> increase from previous day
                      </div>
                    </div>
                    <Tabs defaultValue="all" className="w-full sm:w-[400px]">
                      <TabsList className="grid w-full grid-cols-4 bg-slate-900">
                        <TabsTrigger
                          value="all"
                          onClick={() => setSelectedRiskFilter("all")}
                          className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-500"
                        >
                          All ({eventCounts.total})
                        </TabsTrigger>
                        <TabsTrigger
                          value="high"
                          onClick={() => setSelectedRiskFilter("high")}
                          className="data-[state=active]:bg-slate-800 data-[state=active]:text-red-500"
                        >
                          High ({eventCounts.high})
                        </TabsTrigger>
                        <TabsTrigger
                          value="medium"
                          onClick={() => setSelectedRiskFilter("medium")}
                          className="data-[state=active]:bg-slate-800 data-[state=active]:text-amber-500"
                        >
                          Medium ({eventCounts.medium})
                        </TabsTrigger>
                        <TabsTrigger
                          value="low"
                          onClick={() => setSelectedRiskFilter("low")}
                          className="data-[state=active]:bg-slate-800 data-[state=active]:text-green-500"
                        >
                          Low ({eventCounts.low})
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                      <Input
                        type="search"
                        placeholder="Search events by ID, description, source..."
                        className="w-full bg-slate-900 border-slate-800 pl-9 focus-visible:ring-cyan-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select defaultValue="newest">
                      <SelectTrigger className="w-[180px] bg-slate-900 border-slate-800">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800">
                        <SelectItem value="newest">Newest first</SelectItem>
                        <SelectItem value="oldest">Oldest first</SelectItem>
                        <SelectItem value="risk-high">Highest risk first</SelectItem>
                        <SelectItem value="risk-low">Lowest risk first</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="overflow-x-auto">
                      <Table className="min-w-[800px]">
                        <TableHeader className="bg-slate-900/50">
                          <TableRow className="hover:bg-slate-900/80 border-slate-800">
                            <TableHead className="w-[100px]">Event ID</TableHead>
                            <TableHead className="w-[180px]">Timestamp</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Destination</TableHead>
                            <TableHead>Risk Level</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredEvents.map((event) => (
                            <TableRow key={event.id} className="hover:bg-slate-900/80 border-slate-800">
                              <TableCell className="font-mono text-xs">{event.id}</TableCell>
                              <TableCell className="text-xs">
                                <div className="flex flex-col">
                                  <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                                  <span className="text-slate-500">
                                    {new Date(event.timestamp).toLocaleDateString()}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>{event.description}</TableCell>
                              <TableCell>{event.type}</TableCell>
                              <TableCell className="font-mono text-xs">{event.source}</TableCell>
                              <TableCell className="font-mono text-xs">{event.destination}</TableCell>
                              <TableCell>
                                <RiskLevelBadge level={event.riskLevel} />
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={event.status} />
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-[160px] bg-slate-900 border-slate-800">
                                    <DropdownMenuItem>View details</DropdownMenuItem>
                                    <DropdownMenuItem>Investigate</DropdownMenuItem>
                                    <DropdownMenuItem>Mark as resolved</DropdownMenuItem>
                                    <DropdownMenuItem>Create ticket</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
