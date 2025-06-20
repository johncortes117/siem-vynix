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
import jsPDF from "jspdf"

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
    if (reportConfig.format === "pdf") {
      const pdf = new jsPDF()
      pdf.setFontSize(18)
      pdf.text("Vynix Security Report", 20, 20)

      pdf.setFontSize(12)
      pdf.text(`Report Period: ${reportData.summary.reportPeriod}`, 20, 30)
      pdf.text(`Generated At: ${new Date(reportData.generatedAt).toLocaleString()}`, 20, 38)

      pdf.setFontSize(14)
      pdf.text("Summary", 20, 50)
      pdf.setFontSize(10)
      let yPos = 58
      pdf.text(`Total Security Events: ${reportData.summary.totalEvents}`, 25, yPos)
      pdf.text(`Critical Events: ${reportData.summary.criticalEvents}`, 25, (yPos += 6))
      pdf.text(`High Risk Events: ${reportData.summary.highEvents}`, 25, (yPos += 6))
      pdf.text(`Total Vulnerabilities: ${reportData.summary.totalVulnerabilities}`, 25, (yPos += 6))
      pdf.text(`Critical Vulnerabilities: ${reportData.summary.criticalVulnerabilities}`, 25, (yPos += 6))
      pdf.text(`Open Vulnerabilities: ${reportData.summary.openVulnerabilities}`, 25, (yPos += 6))
      pdf.text(`Security Score: ${reportData.summary.securityScore}%`, 25, (yPos += 6))

      yPos += 10
      pdf.setFontSize(14)
      pdf.text("Top Threats", 20, yPos)
      pdf.setFontSize(10)
      yPos += 8
      if (reportData.summary.topThreats && reportData.summary.topThreats.length > 0) {
        reportData.summary.topThreats.forEach((threat: { type: string; count: number }) => {
          pdf.text(`- ${threat.type}: ${threat.count}`, 25, yPos)
          yPos += 6
          if (yPos > 280) {
            pdf.addPage()
            yPos = 20
          }
        })
      } else {
        pdf.text("- No significant threats identified in this period.", 25, yPos)
        yPos += 6
      }

      yPos += 4
      pdf.setFontSize(14)
      pdf.text("Recommendations", 20, yPos)
      pdf.setFontSize(10)
      yPos += 8
      if (reportData.summary.recommendations && reportData.summary.recommendations.length > 0) {
        reportData.summary.recommendations.forEach((rec: string) => {
          const splitRec = pdf.splitTextToSize(rec, 170) // 170 is approx width in mm for A4
          pdf.text(splitRec, 25, yPos)
          yPos += splitRec.length * 5 // Adjust spacing based on number of lines
          if (yPos > 280) {
            pdf.addPage()
            yPos = 20
          }
        })
      } else {
        pdf.text("- No specific recommendations at this time.", 25, yPos)
        yPos += 6
      }

      if (reportConfig.includeVulnerabilities && reportData.vulnerabilities.length > 0) {
        if (yPos > 260) {
          pdf.addPage()
          yPos = 20
        }
        pdf.setFontSize(14)
        pdf.text("Vulnerability Details", 20, yPos)
        yPos += 8
        pdf.setFontSize(9)
        reportData.vulnerabilities.forEach((vuln: Vulnerability, index: number) => {
          if (yPos > 270) {
            pdf.addPage()
            yPos = 20
            pdf.setFontSize(14)
            pdf.text("Vulnerability Details (Continued)", 20, yPos)
            yPos += 8
            pdf.setFontSize(9)
          }
          pdf.text(`ID: ${vuln.id} | Severity: ${vuln.severity} | Status: ${vuln.status}`, 25, yPos)
          yPos += 5
          pdf.text(`Description: ${vuln.description}`, 25, yPos)
          yPos += 5
          pdf.text(`Detected: ${new Date(vuln.detectedAt).toLocaleDateString()} | CVE: ${vuln.cve || "N/A"}`, 25, yPos)
          yPos += 7
        })
      }

      pdf.save(`vynix-security-report-${reportConfig.startDate}-to-${reportConfig.endDate}.pdf`)
    } else if (reportConfig.format === "json") {
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `vynix-security-report-${reportConfig.startDate}-to-${reportConfig.endDate}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else if (reportConfig.format === "csv") {
      // Basic CSV generation for events as an example
      let csvContent = "data:text/csv;charset=utf-8,"
      csvContent += "EventID,Timestamp,Type,RiskLevel,SourceIP,DestinationIP,Description\\r\\n" // Header
      reportData.events.forEach((event: SecurityEvent) => {
        const row = [
          event.id,
          event.timestamp,
          event.type,
          event.riskLevel,
          event.sourceIp,
          event.destinationIp,
          `"${event.description.replace(/"/g, '""')}"`, // Escape double quotes
        ].join(",")
        csvContent += row + "\\r\\n"
      })

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `vynix-events-report-${reportConfig.startDate}-to-${reportConfig.endDate}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
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
            <CardTitle className="text-base text-slate-50">Security Report Generator</CardTitle>
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
            <Label htmlFor="startDate" className="text-sm font-medium text-slate-300">
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
            <Label htmlFor="endDate" className="text-sm font-medium text-slate-300">
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
          <Label className="text-sm font-medium text-slate-300">Include in Report</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeEvents"
                checked={reportConfig.includeEvents}
                onCheckedChange={(checked) =>
                  setReportConfig((prev) => ({ ...prev, includeEvents: checked as boolean }))
                }
              />
              <Label htmlFor="includeEvents" className="text-sm text-slate-300">
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
              <Label htmlFor="includeVulnerabilities" className="text-sm text-slate-300">
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
              <Label htmlFor="includeMetrics" className="text-sm text-slate-300">
                System Metrics & Analysis
              </Label>
            </div>
          </div>
        </div>

        {/* Format Selection */}
        <div className="space-y-2 w-full">
          <Label className="text-sm font-medium text-slate-300">Report Format</Label>
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
          <Label className="text-sm font-medium text-slate-300">Report Preview</Label>
          <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-slate-900/50 w-full">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-500">{counts.events}</div>
              <div className="text-xs text-slate-200">Security Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500">{counts.vulnerabilities}</div>
              <div className="text-xs text-slate-200">Vulnerabilities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{counts.criticalIssues}</div>
              <div className="text-xs text-slate-200">Critical Issues</div>
            </div>
          </div>

          {counts.criticalIssues > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                High Priority
              </Badge>
              <span className="text-sm text-slate-200">
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
