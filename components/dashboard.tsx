"use client"

import { useState } from "react"
import {
  Activity,
  AlertTriangle,
  Bell,
  Bug,
  Calendar,
  Clock,
  FileText,
  Filter,
  Home,
  type LucideIcon,
  MoreHorizontal,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  Terminal,
  Wifi,
  WifiOff,
  Loader2,
  Database,
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
import { Progress } from "@/components/ui/progress"
import EventsChart from "@/components/events-chart"
import RiskDistributionChart from "@/components/risk-distribution-chart"
import NetworkActivityMap from "@/components/network-activity-map"
import TimelineChart from "@/components/timeline-chart"
import WazuhStatusPanel from "@/components/wazuh-status-panel"
import ReportGenerator from "@/components/report-generator"
import { useSecurityData } from "@/hooks/useSecurityData"

// Navigation items
const navItems = [
  { icon: Home, label: "Overview", key: "overview", active: true },
  { icon: Activity, label: "Security Events", key: "events" },
  { icon: Bug, label: "Vulnerabilities", key: "vulnerabilities" },
  { icon: FileText, label: "Reports", key: "reports" },
  { icon: Settings, label: "Settings", key: "settings" },
]

// Risk level badge component
const RiskLevelBadge = ({ level }: { level: string }) => {
  const variants = {
    critical: "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20",
    high: "bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20",
    medium: "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20",
    low: "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20",
  }

  return (
    <Badge variant="outline" className={`${variants[level as keyof typeof variants]} font-medium text-xs`}>
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
    open: "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20",
    patched: "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20",
    mitigated: "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20",
  }

  return (
    <Badge variant="outline" className={`${variants[status as keyof typeof variants]} font-medium text-xs`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
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
        <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">{title}</CardTitle>
        <Icon className="h-4 w-4 text-slate-400" />
      </CardHeader>
      <CardContent>
        <div className="text-lg sm:text-2xl font-bold text-slate-50">{value}</div>
        {change && <p className={`text-xs ${changeColor[changeType]}`}>{change}</p>}
        {description && <p className="text-xs text-slate-500 mt-1 hidden sm:block">{description}</p>}
      </CardContent>
    </Card>
  )
}

// Componente para mostrar el estado de conexión
const ConnectionStatus = ({
  isConnected,
  isConnecting,
  connectionProgress,
  connectToWazuh,
}: {
  isConnected: boolean
  isConnecting: boolean
  connectionProgress: number
  connectToWazuh: () => void
}) => {
  return (
    <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-cyan-500" />
            <div>
              <CardTitle className="text-base text-slate-50">Wazuh Connection Status</CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                {isConnected ? "Connected to Wazuh security platform" : "Not connected to security platform"}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnecting ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Connecting to Wazuh...</span>
              <span className="text-sm text-slate-300">{connectionProgress}%</span>
            </div>
            <Progress value={connectionProgress} className="h-2" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {!isConnected ? (
              <>
                <p className="text-slate-300 text-center">
                  Connect to the Wazuh security platform to start monitoring your infrastructure
                </p>
                <Button onClick={connectToWazuh} className="bg-cyan-600 hover:bg-cyan-700">
                  <Database className="h-4 w-4 mr-2" />
                  Connect to Wazuh
                </Button>
              </>
            ) : (
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                  <div className="flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-slate-200">Connection Status</span>
                  </div>
                  <span className="text-sm font-medium text-green-500">Connected</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-slate-400" />
                    <span className="text-sm text-slate-200">Last Connection</span>
                  </div>
                  <span className="text-sm text-slate-200">{new Date().toLocaleTimeString()}</span>
                </div>
                <p className="text-slate-300 text-center">
                  Connected to Wazuh. Run security analysis to detect threats and vulnerabilities.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Componente para mostrar el estado del análisis
const AnalysisStatus = ({
  isConnected,
  isAnalyzed,
  isAnalyzing,
  analysisProgress,
  runAnalysis,
}: {
  isConnected: boolean
  isAnalyzed: boolean
  isAnalyzing: boolean
  analysisProgress: number
  runAnalysis: () => void
}) => {
  return (
    <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-cyan-500" />
            <div>
              <CardTitle className="text-base text-slate-50">Security Analysis</CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                {isAnalyzed ? "Security analysis completed" : "Run analysis to detect threats and vulnerabilities"}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAnalyzing ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Running security analysis...</span>
              <span className="text-sm text-slate-300">{analysisProgress}%</span>
            </div>
            <Progress value={analysisProgress} className="h-2" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {!isAnalyzed ? (
              <>
                <p className="text-slate-300 text-center">
                  {isConnected
                    ? "Run a comprehensive security analysis to detect threats and vulnerabilities"
                    : "Connect to Wazuh first to run security analysis"}
                </p>
                <Button
                  onClick={runAnalysis}
                  disabled={!isConnected}
                  className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700"
                >
                  <Terminal className="h-4 w-4 mr-2" />
                  Run Analysis
                </Button>
              </>
            ) : (
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-slate-200">Analysis Status</span>
                  </div>
                  <span className="text-sm font-medium text-green-500">Completed</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-slate-400" />
                    <span className="text-sm text-slate-200">Last Analysis</span>
                  </div>
                  <span className="text-sm text-slate-200">{new Date().toLocaleTimeString()}</span>
                </div>
                <p className="text-slate-300 text-center">
                  Security analysis completed. View results in the dashboard.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const {
    events,
    vulnerabilities,
    agents,
    chartData,
    metrics,
    isLoading,
    lastUpdate,
    refreshData,
    isConnected,
    isAnalyzed,
    isConnecting,
    isAnalyzing,
    connectionProgress,
    analysisProgress,
    connectToWazuh,
    runAnalysis,
  } = useSecurityData()

  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [activeSection, setActiveSection] = useState<string>("overview")

  // Filter events based on risk level and search query
  const filteredEvents = events.filter((event) => {
    const matchesRisk = selectedRiskFilter === "all" || event.riskLevel === selectedRiskFilter
    const matchesSearch =
      event.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesRisk && matchesSearch
  })

  // Count events by risk level (usando datos reales)
  const eventCounts = {
    critical: events.filter((e) => e.riskLevel === "critical").length,
    high: events.filter((e) => e.riskLevel === "high").length,
    medium: events.filter((e) => e.riskLevel === "medium").length,
    low: events.filter((e) => e.riskLevel === "low").length,
    total: events.length,
  }

  // Count vulnerabilities by severity (usando datos reales)
  const vulnCounts = {
    critical: vulnerabilities.filter((v) => v.severity === "critical").length,
    high: vulnerabilities.filter((v) => v.severity === "high").length,
    medium: vulnerabilities.filter((v) => v.severity === "medium").length,
    low: vulnerabilities.filter((v) => v.severity === "low").length,
    total: vulnerabilities.length,
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen bg-slate-950 text-slate-50">
        <Sidebar className="border-r border-slate-800">
          <SidebarHeader className="border-b border-slate-800 px-4 py-6">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-cyan-500" />
              <h1 className="text-xl font-bold">Centinela</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Security Operations</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        className={activeSection === item.key ? "bg-slate-800 text-cyan-500" : ""}
                        onClick={() => setActiveSection(item.key)}
                      >
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
          <header className="flex h-16 items-center gap-4 border-b border-slate-800 bg-slate-950/50 px-4 sm:px-6 backdrop-blur-sm">
            <SidebarTrigger className="text-slate-400 hover:text-slate-50" />
            <div className="relative flex-1 max-w-xs sm:max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search events..."
                className="w-full bg-slate-900 border-slate-800 pl-9 focus-visible:ring-cyan-500 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="ml-auto flex items-center gap-2 sm:gap-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-50 hidden sm:flex"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden md:inline">Jan 19, 2025</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-50 h-8 w-8 sm:h-10 sm:w-10"
              >
                <Bell className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-50 h-8 w-8 sm:h-10 sm:w-10"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto p-4 sm:p-6">
            <div className="mx-auto max-w-7xl w-full space-y-4 sm:space-y-6">
              {/* Page header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">
                    {activeSection === "overview" && "Security Operations Center"}
                    {activeSection === "events" && "Security Events"}
                    {activeSection === "vulnerabilities" && "Vulnerability Management"}
                    {activeSection === "reports" && "Security Reports"}
                    {activeSection === "settings" && "System Settings"}
                  </h1>
                  <p className="text-sm text-slate-400">
                    {activeSection === "overview" &&
                      (isConnected
                        ? `Powered by Wazuh • ${metrics.connectedAgents}/${metrics.totalAgents} agents connected`
                        : "Connect to Wazuh to start monitoring")}
                    {activeSection === "events" &&
                      (isAnalyzed
                        ? `${metrics.totalEvents} events detected • ${metrics.activeThreats} active threats`
                        : "Run analysis to detect security events")}
                    {activeSection === "vulnerabilities" &&
                      (isAnalyzed
                        ? `${vulnerabilities.length} vulnerabilities found • ${metrics.criticalVulnerabilities} critical`
                        : "Run analysis to detect vulnerabilities")}
                    {activeSection === "reports" && "Generate comprehensive security analysis reports"}
                    {activeSection === "settings" && "Configure system preferences and integrations"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {isAnalyzed && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={refreshData}
                      disabled={isLoading}
                      className="gap-2 border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-50"
                    >
                      <Filter className="h-4 w-4" />
                      <span>Refresh Data</span>
                    </Button>
                  )}
                  {isConnected && !isAnalyzed && activeSection !== "reports" && activeSection !== "settings" && (
                    <Button
                      size="sm"
                      className="gap-2 bg-cyan-600 hover:bg-cyan-700"
                      onClick={runAnalysis}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Terminal className="h-4 w-4 mr-2" />
                      )}
                      <span className="hidden sm:inline">Run Analysis</span>
                      <span className="sm:hidden">Analyze</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Main content - renderizado condicional basado en activeSection */}
              {activeSection === "overview" && (
                <div className="space-y-4 sm:space-y-6 w-full">
                  {/* Estado de conexión y análisis */}
                  {!isAnalyzed && (
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
                      <ConnectionStatus
                        isConnected={isConnected}
                        isConnecting={isConnecting}
                        connectionProgress={connectionProgress}
                        connectToWazuh={connectToWazuh}
                      />
                      <AnalysisStatus
                        isConnected={isConnected}
                        isAnalyzed={isAnalyzed}
                        isAnalyzing={isAnalyzing}
                        analysisProgress={analysisProgress}
                        runAnalysis={runAnalysis}
                      />
                    </div>
                  )}

                  {/* Metrics - usando datos reales (solo mostrar si hay análisis) */}
                  {isAnalyzed && (
                    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-5">
                      <MetricCard
                        icon={AlertTriangle}
                        title="Active Threats"
                        value={metrics.activeThreats.toString()}
                        change={`${metrics.criticalVulnerabilities} critical`}
                        changeType="negative"
                        description="Requires immediate attention"
                      />
                      <MetricCard
                        icon={Bug}
                        title="Vulnerabilities"
                        value={vulnCounts.total.toString()}
                        change={`${vulnCounts.critical} critical`}
                        changeType="negative"
                        description="Open security issues"
                      />
                      <MetricCard
                        icon={Activity}
                        title="Security Events"
                        value={metrics.totalEvents.toString()}
                        change="Last 24 hours"
                        changeType="neutral"
                        description="Detected by Wazuh agents"
                      />
                      <MetricCard
                        icon={Shield}
                        title="Security Score"
                        value={`${metrics.securityScore}/100`}
                        change={metrics.securityScore > 80 ? "+2 this week" : "Needs improvement"}
                        changeType={metrics.securityScore > 80 ? "positive" : "negative"}
                        description="Overall security posture"
                      />
                      <MetricCard
                        icon={Clock}
                        title="Response Time"
                        value={metrics.avgResponseTime}
                        change="Target: <5 minutes"
                        changeType="positive"
                        description="Average incident response"
                      />
                    </div>
                  )}

                  {/* Wazuh Status Panel (solo mostrar si está conectado) */}
                  {isConnected && (
                    <WazuhStatusPanel
                      agents={agents}
                      isLoading={isLoading}
                      onRefresh={refreshData}
                      lastUpdate={lastUpdate}
                    />
                  )}

                  {/* Charts - usando datos reales (solo mostrar si hay análisis) */}
                  {isAnalyzed && (
                    <>
                      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                        <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm sm:text-base text-slate-50">
                              Security Events Timeline
                            </CardTitle>
                            <CardDescription className="text-slate-400 text-xs sm:text-sm">
                              Last 24 hours of security events from Wazuh agents
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <TimelineChart timelineData={chartData.timelineData} />
                          </CardContent>
                        </Card>
                        <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm sm:text-base text-slate-50">Risk Distribution</CardTitle>
                            <CardDescription className="text-slate-400 text-xs sm:text-sm">
                              Events and vulnerabilities by risk level
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <RiskDistributionChart riskDistribution={chartData.riskDistribution} />
                          </CardContent>
                        </Card>
                      </div>

                      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
                        <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm lg:col-span-2">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm sm:text-base text-slate-50">Network Activity Map</CardTitle>
                            <CardDescription className="text-slate-400 text-xs sm:text-sm">
                              Geographic distribution of security events in Ecuador
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <NetworkActivityMap networkActivityData={chartData.networkActivityData} />
                          </CardContent>
                        </Card>
                        <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm sm:text-base text-slate-50">Event Types</CardTitle>
                            <CardDescription className="text-slate-400 text-xs sm:text-sm">
                              Distribution by category
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <EventsChart eventTypeDistribution={chartData.eventTypeDistribution} />
                            <div className="mt-4 space-y-2 sm:space-y-3">
                              {Object.entries(chartData.eventTypeDistribution).map(([type, count]) => {
                                const colors = {
                                  Authentication: "#06b6d4",
                                  Network: "#a855f7",
                                  Malware: "#f59e0b",
                                  Data: "#ef4444",
                                  System: "#22c55e",
                                  Policy: "#8b5cf6",
                                }
                                const total = Object.values(chartData.eventTypeDistribution).reduce(
                                  (sum, c) => sum + c,
                                  0,
                                )
                                const percentage = total > 0 ? Math.round((count / total) * 100) : 0

                                return (
                                  <div key={type} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="h-2 w-2 sm:h-3 sm:w-3 rounded-full"
                                        style={{ backgroundColor: colors[type as keyof typeof colors] || "#64748b" }}
                                      />
                                      <span className="text-xs sm:text-sm text-slate-200">{type}</span>
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium text-slate-200">{percentage}%</span>
                                  </div>
                                )
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeSection === "events" && (
                <div className="space-y-4 sm:space-y-6 w-full">
                  {/* Security events table */}
                  {!isAnalyzed ? (
                    <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Shield className="h-12 w-12 text-slate-700 mb-4" />
                        <h3 className="text-lg font-medium text-slate-300 mb-2">No Security Events Available</h3>
                        <p className="text-slate-400 text-center max-w-md mb-6">
                          Connect to Wazuh and run a security analysis to detect and display security events.
                        </p>
                        {!isConnected ? (
                          <Button onClick={connectToWazuh} className="bg-cyan-600 hover:bg-cyan-700">
                            <Database className="h-4 w-4 mr-2" />
                            Connect to Wazuh
                          </Button>
                        ) : (
                          <Button onClick={runAnalysis} className="bg-cyan-600 hover:bg-cyan-700">
                            <Terminal className="h-4 w-4 mr-2" />
                            Run Analysis
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <CardTitle className="text-sm sm:text-base text-slate-50">Security Events</CardTitle>
                            <CardDescription className="text-slate-400 text-xs sm:text-sm">
                              Real-time security events detected by Wazuh agents
                            </CardDescription>
                            <div className="mt-2 text-xs text-slate-400">
                              <span className="font-medium text-cyan-500">{metrics.totalEvents}</span> events detected |
                              <span className="font-medium text-red-500 ml-2">{metrics.activeThreats}</span> active
                              threats
                            </div>
                          </div>
                          <Tabs defaultValue="all" className="w-full sm:w-[400px]">
                            <TabsList className="grid w-full grid-cols-4 bg-slate-900">
                              <TabsTrigger
                                value="all"
                                onClick={() => setSelectedRiskFilter("all")}
                                className="data-[state=active]:bg-slate-800 data-[state=active]:text-cyan-500 text-xs"
                              >
                                All ({eventCounts.total})
                              </TabsTrigger>
                              <TabsTrigger
                                value="critical"
                                onClick={() => setSelectedRiskFilter("critical")}
                                className="data-[state=active]:bg-slate-800 data-[state=active]:text-red-500 text-xs"
                              >
                                Critical ({eventCounts.critical})
                              </TabsTrigger>
                              <TabsTrigger
                                value="high"
                                onClick={() => setSelectedRiskFilter("high")}
                                className="data-[state=active]:bg-slate-800 data-[state=active]:text-orange-500 text-xs"
                              >
                                High ({eventCounts.high})
                              </TabsTrigger>
                              <TabsTrigger
                                value="medium"
                                onClick={() => setSelectedRiskFilter("medium")}
                                className="data-[state=active]:bg-slate-800 data-[state=active]:text-amber-500 text-xs"
                              >
                                Med ({eventCounts.medium})
                              </TabsTrigger>
                            </TabsList>
                          </Tabs>
                        </div>
                        <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                          <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                              type="search"
                              placeholder="Search events by ID, description, source..."
                              className="w-full bg-slate-900 border-slate-800 pl-9 focus-visible:ring-cyan-500 text-sm"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                          <Select defaultValue="newest">
                            <SelectTrigger className="w-full sm:w-[180px] bg-slate-900 border-slate-800">
                              <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800">
                              <SelectItem value="newest">Newest first</SelectItem>
                              <SelectItem value="oldest">Oldest first</SelectItem>
                              <SelectItem value="risk-high">Highest risk first</SelectItem>
                              <SelectItem value="severity">Highest severity first</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px] sm:h-[500px]">
                          <div className="overflow-x-auto">
                            <Table className="min-w-[800px]">
                              <TableHeader className="bg-slate-900/50">
                                <TableRow className="hover:bg-slate-900/80 border-slate-800">
                                  <TableHead className="w-[80px] text-xs">Event ID</TableHead>
                                  <TableHead className="w-[120px] text-xs">Timestamp</TableHead>
                                  <TableHead className="text-xs">Description</TableHead>
                                  <TableHead className="text-xs">Type</TableHead>
                                  <TableHead className="text-xs">Source</TableHead>
                                  <TableHead className="text-xs">Wazuh Agent</TableHead>
                                  <TableHead className="text-xs">Rule ID</TableHead>
                                  <TableHead className="text-xs">Risk Level</TableHead>
                                  <TableHead className="text-xs">Status</TableHead>
                                  <TableHead className="text-right text-xs">Actions</TableHead>
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
                                    <TableCell className="text-xs max-w-[200px] truncate" title={event.description}>
                                      {event.description}
                                    </TableCell>
                                    <TableCell className="text-xs">{event.type}</TableCell>
                                    <TableCell className="font-mono text-xs">{event.source}</TableCell>
                                    <TableCell className="text-xs">{event.wazuhAgent}</TableCell>
                                    <TableCell className="font-mono text-xs">{event.ruleId}</TableCell>
                                    <TableCell>
                                      <RiskLevelBadge level={event.riskLevel} />
                                    </TableCell>
                                    <TableCell>
                                      <StatusBadge status={event.status} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8">
                                            <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                                            <span className="sr-only">Open menu</span>
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                          align="end"
                                          className="w-[160px] bg-slate-900 border-slate-800"
                                        >
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
                  )}
                </div>
              )}

              {activeSection === "vulnerabilities" && (
                <div className="space-y-4 sm:space-y-6 w-full">
                  {/* Vulnerability Analysis */}
                  <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bug className="h-5 w-5 text-red-500" />
                          <div>
                            <CardTitle className="text-base text-slate-50">Vulnerability Analysis</CardTitle>
                            <CardDescription className="text-slate-400 text-sm">
                              CVE vulnerabilities detected by Wazuh agents
                            </CardDescription>
                          </div>
                        </div>
                        <Button onClick={refreshData} disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700">
                          {isLoading ? (
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Shield className="h-4 w-4 mr-2" />
                          )}
                          {isLoading ? "Scanning..." : "Scan Now"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Vulnerability Statistics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10">
                          <AlertTriangle className="h-6 w-6 text-red-500" />
                          <div>
                            <p className="text-xs text-red-300">Critical</p>
                            <p className="text-lg font-bold text-red-500">{vulnCounts.critical}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/10">
                          <AlertTriangle className="h-6 w-6 text-orange-500" />
                          <div>
                            <p className="text-xs text-orange-300">High</p>
                            <p className="text-lg font-bold text-orange-500">{vulnCounts.high}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10">
                          <Clock className="h-6 w-6 text-yellow-500" />
                          <div>
                            <p className="text-xs text-yellow-300">Medium</p>
                            <p className="text-lg font-bold text-yellow-500">{vulnCounts.medium}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10">
                          <Shield className="h-6 w-6 text-green-500" />
                          <div>
                            <p className="text-xs text-green-300">Low</p>
                            <p className="text-lg font-bold text-green-500">{vulnCounts.low}</p>
                          </div>
                        </div>
                      </div>

                      {/* Vulnerability List */}
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-3">
                          {vulnerabilities.map((vuln) => (
                            <div
                              key={vuln.id}
                              className="p-4 rounded-lg bg-slate-900/30 hover:bg-slate-900/50 transition-colors border border-slate-800"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <RiskLevelBadge level={vuln.severity} />
                                    <Badge variant="outline" className="text-slate-400 border-slate-600">
                                      {vuln.cve}
                                    </Badge>
                                    <StatusBadge status={vuln.status} />
                                  </div>
                                  <h4 className="font-medium text-sm mb-1 text-slate-50">{vuln.title}</h4>
                                  <p className="text-xs text-slate-300 mb-2">{vuln.description}</p>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                    <div>
                                      <span className="text-slate-400">CVSS:</span>
                                      <span className="ml-1 font-medium text-slate-200">{vuln.cvss}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400">Package:</span>
                                      <span className="ml-1 font-medium text-slate-200">{vuln.affectedPackage}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400">Version:</span>
                                      <span className="ml-1 font-medium text-slate-200">{vuln.version}</span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400">Agent:</span>
                                      <span className="ml-1 font-medium text-slate-200">{vuln.wazuhAgent}</span>
                                    </div>
                                  </div>
                                  {vuln.fixedVersion && (
                                    <div className="mt-2 text-xs">
                                      <span className="text-slate-500">Fixed in:</span>
                                      <span className="ml-1 font-medium text-green-400">{vuln.fixedVersion}</span>
                                    </div>
                                  )}
                                  {vuln.relatedEvents.length > 0 && (
                                    <div className="mt-2 text-xs">
                                      <span className="text-slate-500">Related events:</span>
                                      <span className="ml-1 font-medium text-cyan-400">
                                        {vuln.relatedEvents.join(", ")}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>Detected: {new Date(vuln.detectedAt).toLocaleString()}</span>
                                <span>Category: {vuln.category}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === "reports" && (
                <div className="space-y-4 sm:space-y-6 w-full">
                  <ReportGenerator events={events} vulnerabilities={vulnerabilities} metrics={metrics} />
                </div>
              )}

              {activeSection === "settings" && (
                <div className="space-y-4 sm:space-y-6 w-full">
                  <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-slate-50">Settings</CardTitle>
                      <CardDescription className="text-slate-400">System configuration and preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300">Settings panel coming soon...</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
