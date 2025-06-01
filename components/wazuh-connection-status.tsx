"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  RefreshCw,
  Server,
  Shield,
  Wifi,
  WifiOff,
} from "lucide-react"

interface WazuhAgent {
  id: string
  name: string
  ip: string
  os: string
  version: string
  status: "active" | "disconnected" | "never_connected"
  lastKeepAlive: string
  configSum: string
  mergedSum: string
}

const mockAgents: WazuhAgent[] = [
  {
    id: "001",
    name: "web-server-01",
    ip: "192.168.1.10",
    os: "Ubuntu 22.04",
    version: "4.7.0",
    status: "active",
    lastKeepAlive: new Date().toISOString(),
    configSum: "ab34ef56",
    mergedSum: "cd78gh90",
  },
  {
    id: "002",
    name: "db-server-01",
    ip: "192.168.1.20",
    os: "CentOS 8",
    version: "4.7.0",
    status: "active",
    lastKeepAlive: new Date(Date.now() - 30000).toISOString(),
    configSum: "ef12ab34",
    mergedSum: "gh56cd78",
  },
  {
    id: "003",
    name: "mail-server-01",
    ip: "192.168.1.30",
    os: "Windows Server 2019",
    version: "4.6.0",
    status: "disconnected",
    lastKeepAlive: new Date(Date.now() - 300000).toISOString(),
    configSum: "ij90ef12",
    mergedSum: "kl34gh56",
  },
  {
    id: "004",
    name: "backup-server-01",
    ip: "192.168.1.40",
    os: "Ubuntu 20.04",
    version: "4.7.0",
    status: "active",
    lastKeepAlive: new Date(Date.now() - 15000).toISOString(),
    configSum: "mn78ij90",
    mergedSum: "op12kl34",
  },
]

export default function WazuhConnectionStatus() {
  const [agents, setAgents] = useState<WazuhAgent[]>(mockAgents)
  const [isConnecting, setIsConnecting] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [connectionProgress, setConnectionProgress] = useState(0)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prevAgents) =>
        prevAgents.map((agent) => {
          if (agent.status === "active" && Math.random() > 0.1) {
            return {
              ...agent,
              lastKeepAlive: new Date().toISOString(),
            }
          }
          return agent
        }),
      )
      setLastUpdate(new Date())
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const handleRefreshConnection = async () => {
    setIsConnecting(true)
    setConnectionProgress(0)

    // Simulate connection progress
    const progressInterval = setInterval(() => {
      setConnectionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsConnecting(false)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Simulate some agents reconnecting
    setTimeout(() => {
      setAgents((prevAgents) =>
        prevAgents.map((agent) => {
          if (agent.status === "disconnected" && Math.random() > 0.5) {
            return {
              ...agent,
              status: "active" as const,
              lastKeepAlive: new Date().toISOString(),
            }
          }
          return agent
        }),
      )
    }, 2000)
  }

  const activeAgents = agents.filter((agent) => agent.status === "active").length
  const totalAgents = agents.length
  const connectionHealth = (activeAgents / totalAgents) * 100

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "disconnected":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-500/10 text-green-500 border-green-500/20",
      disconnected: "bg-red-500/10 text-red-500 border-red-500/20",
      never_connected: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    }

    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants]}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    )
  }

  return (
    <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyan-500" />
            <div>
              <CardTitle className="text-base">Wazuh Agent Status</CardTitle>
              <CardDescription className="text-slate-400 text-sm">
                Real-time agent connectivity and health monitoring
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {connectionHealth >= 80 ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshConnection}
              disabled={isConnecting}
              className="border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isConnecting ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50">
            <Server className="h-8 w-8 text-cyan-500" />
            <div>
              <p className="text-sm font-medium">Total Agents</p>
              <p className="text-2xl font-bold">{totalAgents}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50">
            <Activity className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm font-medium">Active</p>
              <p className="text-2xl font-bold text-green-500">{activeAgents}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50">
            <Database className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-sm font-medium">Health</p>
              <p className="text-2xl font-bold">{Math.round(connectionHealth)}%</p>
            </div>
          </div>
        </div>

        {/* Connection Progress */}
        {isConnecting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Refreshing connections...</span>
              <span className="text-sm text-slate-400">{connectionProgress}%</span>
            </div>
            <Progress value={connectionProgress} className="h-2" />
          </div>
        )}

        <Separator className="bg-slate-800" />

        {/* Agent List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Agent Details</h4>
            <span className="text-xs text-slate-500">Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 hover:bg-slate-900/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(agent.status)}
                  <div>
                    <p className="text-sm font-medium">{agent.name}</p>
                    <p className="text-xs text-slate-500">
                      {agent.ip} • {agent.os} • v{agent.version}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(agent.status)}
                  <span className="text-xs text-slate-500">
                    {agent.status === "active"
                      ? `${Math.floor((Date.now() - new Date(agent.lastKeepAlive).getTime()) / 1000)}s ago`
                      : `${Math.floor((Date.now() - new Date(agent.lastKeepAlive).getTime()) / 60000)}m ago`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connection Statistics */}
        <Separator className="bg-slate-800" />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Manager Version:</span>
            <span className="ml-2 font-medium">4.7.0</span>
          </div>
          <div>
            <span className="text-slate-400">API Status:</span>
            <span className="ml-2 font-medium text-green-500">Connected</span>
          </div>
          <div>
            <span className="text-slate-400">Cluster Status:</span>
            <span className="ml-2 font-medium text-green-500">Enabled</span>
          </div>
          <div>
            <span className="text-slate-400">Rules Loaded:</span>
            <span className="ml-2 font-medium">3,247</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
