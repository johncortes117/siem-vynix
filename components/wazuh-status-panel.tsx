"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Activity, AlertCircle, CheckCircle, Clock, RefreshCw, Server, Shield, Wifi, WifiOff } from "lucide-react"
import type { WazuhAgent } from "@/types/dashboard"

interface WazuhStatusPanelProps {
  agents: WazuhAgent[]
  isLoading: boolean
  onRefresh: () => void
  lastUpdate: Date
}

export default function WazuhStatusPanel({ agents, isLoading, onRefresh, lastUpdate }: WazuhStatusPanelProps) {
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
                Real-time monitoring of security agents
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
              onClick={onRefresh}
              disabled={isLoading}
              className="border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50">
            <Server className="h-6 w-6 text-cyan-500" />
            <div>
              <p className="text-sm font-medium">Total Agents</p>
              <p className="text-xl font-bold">{totalAgents}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50">
            <Activity className="h-6 w-6 text-green-500" />
            <div>
              <p className="text-sm font-medium">Active</p>
              <p className="text-xl font-bold text-green-500">{activeAgents}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50">
            <Shield className="h-6 w-6 text-amber-500" />
            <div>
              <p className="text-sm font-medium">Health</p>
              <p className="text-xl font-bold">{Math.round(connectionHealth)}%</p>
            </div>
          </div>
        </div>

        {/* Connection Progress */}
        {isLoading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Refreshing connections...</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        )}

        <Separator className="bg-slate-800" />

        {/* Agent List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Agent Details</h4>
            <span className="text-xs text-slate-500">Last updated: {lastUpdate.toLocaleTimeString()}</span>
          </div>

          <div className="space-y-2 max-h-[200px] overflow-y-auto">
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
                    <p className="text-xs text-slate-400">
                      Events: {agent.eventsCount} • Vulns: {agent.vulnerabilitiesCount}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
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
            <span className="text-slate-400">Rules Loaded:</span>
            <span className="ml-2 font-medium">3,247</span>
          </div>
          <div>
            <span className="text-slate-400">Total Events:</span>
            <span className="ml-2 font-medium">{agents.reduce((sum, agent) => sum + agent.eventsCount, 0)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
