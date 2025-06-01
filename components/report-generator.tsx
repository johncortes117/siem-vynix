"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, FileText, Loader2 } from "lucide-react"
import type { ReportConfig, SecurityEvent, Vulnerability, SystemMetrics } from "@/types/dashboard"

interface ReportGeneratorProps {
  events: SecurityEvent[]
  vulnerabilities: Vulnerability[]
  metrics: SystemMetrics
}

export default function ReportGenerator({ events, vulnerabilities, metrics }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days ago
    endDate: new Date().toISOString().split("T")[0], // today
    includeEvents: true,
    includeVulnerabilities: true,
    includeMetrics: true,
    format: "pdf",
  })

  const generateReport = async () => {
    setIsGenerating(true)
    setProgress(0)

    // Simulate report generation progress
    const steps = [
      "Collecting security events...",
      "Analyzing vulnerabilities...",
      "Processing metrics...",
      "Generating charts...",
      "Compiling report...",
      "Finalizing document...",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setProgress(((i + 1) / steps.length) * 100)
    }

    // Simulate download
    const reportData = generateReportData()
    downloadReport(reportData)

    setIsGenerating(false)
    setProgress(0)
  }

  const generateReportData = () => {
    const startDate = new Date(reportConfig.startDate)
    const endDate = new Date(reportConfig.endDate)

    // Filter data based on date range
    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.timestamp)
      return eventDate >= startDate && eventDate <= endDate
    })

    const filteredVulnerabilities = vulnerabilities.filter((vuln) => {
      const vulnDate = new Date(vuln.detectedAt)
      return vulnDate >= startDate && vulnDate <= endDate
    })

    // Generate report summary
    const summary = {
      reportPeriod: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      totalEvents: filteredEvents.length,
      criticalEvents: filteredEvents.filter((e) => e.riskLevel === "critical").length,
      highEvents: filteredEvents.filter((e) => e.riskLevel === "high").length,
      totalVulnerabilities: filteredVulnerabilities.length,
      criticalVulnerabilities: filteredVulnerabilities.filter((v) => v.severity === "critical").length,
      openVulnerabilities: filteredVulnerabilities.filter((v) => v.status === "open").length,
      securityScore: metrics.securityScore,
      topThreats: getTopThreats(filteredEvents),
      recommendations: generateRecommendations(filteredEvents, filteredVulnerabilities),
    }

    return {
      config: reportConfig,
      summary,
      events: reportConfig.includeEvents ? filteredEvents : [],
      vulnerabilities: reportConfig.includeVulnerabilities ? filteredVulnerabilities : [],
      metrics: reportConfig.includeMetrics ? metrics : null,
      generatedAt: new Date().toISOString(),
    }
  }

  const getTopThreats = (events: SecurityEvent[]) => {
    const threatCounts = events.reduce(
      (acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(threatCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }))
  }

  const generateRecommendations = (events: SecurityEvent[], vulnerabilities: Vulnerability[]) => {
    const recommendations = []

    if (vulnerabilities.filter((v) => v.severity === "critical" && v.status === "open").length > 0) {
      recommendations.push("Immediately patch critical vulnerabilities, especially CVE-2024-3094 and CVE-2024-6387")
    }

    if (events.filter((e) => e.type === "Authentication" && e.riskLevel === "high").length > 2) {
      recommendations.push("Implement stronger authentication controls and monitor for brute force attacks")
    }

    if (events.filter((e) => e.type === "Network").length > 3) {
      recommendations.push("Review network segmentation and implement additional monitoring for lateral movement")
    }

    if (metrics.securityScore < 80) {
      recommendations.push("Overall security posture needs improvement - focus on vulnerability management")
    }

    return recommendations
  }

  const downloadReport = (reportData: any) => {
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vynix-security-report-${reportConfig.startDate}-to-${reportConfig.endDate}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getFilteredCounts = () => {
    const startDate = new Date(reportConfig.startDate)
    const endDate = new Date(reportConfig.endDate)

    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.timestamp)
      return eventDate >= startDate && eventDate <= endDate
    })

    const filteredVulnerabilities = vulnerabilities.filter((vuln) => {
      const vulnDate = new Date(vuln.detectedAt)
      return vulnDate >= startDate && vulnDate <= endDate
    })

    return {
      events: filteredEvents.length,
      vulnerabilities: filteredVulnerabilities.length,
      criticalIssues:
        filteredEvents.filter((e) => e.riskLevel === "critical").length +
        filteredVulnerabilities.filter((v) => v.severity === "critical" && v.status === "open").length,
    }
  }

  const counts = getFilteredCounts()

  return (
    <Card className="border-slate-800 bg-slate-950/50 backdrop-blur-sm w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-cyan-500" />
          <div>
            <CardTitle className="text-base">Security Report Generator</CardTitle>
            <CardDescription className="text-slate-400 text-sm">
              Generate comprehensive security analysis reports
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 w-full">
        {/* Date Range Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-sm font-medium">
              Start Date
            </Label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                id="startDate"
                type="date"
                value={reportConfig.startDate}
                onChange={(e) => setReportConfig((prev) => ({ ...prev, startDate: e.target.value }))}
                className="pl-9 bg-slate-900 border-slate-800"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-sm font-medium">
              End Date
            </Label>
            <div className="relative">
              <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                id="endDate"
                type="date"
                value={reportConfig.endDate}
                onChange={(e) => setReportConfig((prev) => ({ ...prev, endDate: e.target.value }))}
                className="pl-9 bg-slate-900 border-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Report Content Selection */}
        <div className="space-y-3 w-full">
          <Label className="text-sm font-medium">Include in Report</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeEvents"
                checked={reportConfig.includeEvents}
                onCheckedChange={(checked) =>
                  setReportConfig((prev) => ({ ...prev, includeEvents: checked as boolean }))
                }
              />
              <Label htmlFor="includeEvents" className="text-sm">
                Security Events ({counts.events} in selected period)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeVulnerabilities"
                checked={reportConfig.includeVulnerabilities}
                onCheckedChange={(checked) =>
                  setReportConfig((prev) => ({ ...prev, includeVulnerabilities: checked as boolean }))
                }
              />
              <Label htmlFor="includeVulnerabilities" className="text-sm">
                Vulnerabilities ({counts.vulnerabilities} in selected period)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeMetrics"
                checked={reportConfig.includeMetrics}
                onCheckedChange={(checked) =>
                  setReportConfig((prev) => ({ ...prev, includeMetrics: checked as boolean }))
                }
              />
              <Label htmlFor="includeMetrics" className="text-sm">
                System Metrics & Analysis
              </Label>
            </div>
          </div>
        </div>

        {/* Format Selection */}
        <div className="space-y-2 w-full">
          <Label className="text-sm font-medium">Report Format</Label>
          <Select
            value={reportConfig.format}
            onValueChange={(value: "pdf" | "json" | "csv") => setReportConfig((prev) => ({ ...prev, format: value }))}
          >
            <SelectTrigger className="bg-slate-900 border-slate-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              <SelectItem value="pdf">PDF Report</SelectItem>
              <SelectItem value="json">JSON Data</SelectItem>
              <SelectItem value="csv">CSV Export</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-slate-800" />

        {/* Report Preview */}
        <div className="space-y-3 w-full">
          <Label className="text-sm font-medium">Report Preview</Label>
          <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-slate-900/50 w-full">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-500">{counts.events}</div>
              <div className="text-xs text-slate-400">Security Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500">{counts.vulnerabilities}</div>
              <div className="text-xs text-slate-400">Vulnerabilities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{counts.criticalIssues}</div>
              <div className="text-xs text-slate-400">Critical Issues</div>
            </div>
          </div>

          {counts.criticalIssues > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                High Priority
              </Badge>
              <span className="text-sm text-slate-400">
                This report contains {counts.criticalIssues} critical security issues requiring immediate attention
              </span>
            </div>
          )}
        </div>

        {/* Generation Progress */}
        {isGenerating && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Generating report...</span>
              <span className="text-sm text-slate-400">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Generate Button */}
        <Button onClick={generateReport} disabled={isGenerating} className="w-full bg-cyan-600 hover:bg-cyan-700">
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Generate Security Report
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
