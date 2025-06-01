"use client"

import { useState, useEffect, useCallback } from "react"
import type { SecurityEvent, WazuhAgent, Vulnerability, SystemMetrics } from "@/types/dashboard"

// Simulated data that maintains logical relationships
const generateSecurityData = () => {
  const agents: WazuhAgent[] = [
    {
      id: "001",
      name: "web-server-01",
      ip: "192.168.1.10",
      os: "Ubuntu 22.04",
      version: "4.7.0",
      status: "active",
      lastKeepAlive: new Date().toISOString(),
      eventsCount: 0,
      vulnerabilitiesCount: 0,
    },
    {
      id: "002",
      name: "db-server-01",
      ip: "192.168.1.20",
      os: "CentOS 8",
      version: "4.7.0",
      status: "active",
      lastKeepAlive: new Date(Date.now() - 30000).toISOString(),
      eventsCount: 0,
      vulnerabilitiesCount: 0,
    },
    {
      id: "003",
      name: "mail-server-01",
      ip: "192.168.1.30",
      os: "Windows Server 2019",
      version: "4.6.0",
      status: "disconnected",
      lastKeepAlive: new Date(Date.now() - 300000).toISOString(),
      eventsCount: 0,
      vulnerabilitiesCount: 0,
    },
    {
      id: "004",
      name: "backup-server-01",
      ip: "192.168.1.40",
      os: "Ubuntu 20.04",
      version: "4.7.0",
      status: "active",
      lastKeepAlive: new Date(Date.now() - 15000).toISOString(),
      eventsCount: 0,
      vulnerabilitiesCount: 0,
    },
  ]

  const vulnerabilities: Vulnerability[] = [
    {
      id: "vuln-001",
      cve: "CVE-2024-3094",
      title: "XZ Utils Backdoor Vulnerability",
      description: "Malicious code in XZ Utils library allowing remote code execution",
      severity: "critical",
      cvss: 9.8,
      affectedPackage: "xz-utils",
      version: "5.6.0",
      fixedVersion: "5.6.1",
      wazuhAgent: "web-server-01",
      detectedAt: "2025-01-19T10:30:00Z",
      status: "open",
      category: "Remote Code Execution",
      relatedEvents: [],
    },
    {
      id: "vuln-002",
      cve: "CVE-2024-6387",
      title: "OpenSSH Remote Code Execution",
      description: "Signal handler race condition in OpenSSH server leading to RCE",
      severity: "critical",
      cvss: 9.8,
      affectedPackage: "openssh-server",
      version: "8.9p1",
      fixedVersion: "9.8p1",
      wazuhAgent: "db-server-01",
      detectedAt: "2025-01-19T10:05:00Z",
      status: "open",
      category: "Remote Code Execution",
      relatedEvents: [],
    },
    {
      id: "vuln-003",
      cve: "CVE-2024-21626",
      title: "runc Container Escape Vulnerability",
      description: "Container escape vulnerability in runc allowing privilege escalation",
      severity: "high",
      cvss: 8.6,
      affectedPackage: "runc",
      version: "1.1.5",
      fixedVersion: "1.1.12",
      wazuhAgent: "web-server-01",
      detectedAt: "2025-01-19T10:25:00Z",
      status: "open",
      category: "Privilege Escalation",
      relatedEvents: [],
    },
    {
      id: "vuln-004",
      cve: "CVE-2024-1086",
      title: "Linux Kernel Use-After-Free",
      description: "Use-after-free vulnerability in netfilter subsystem",
      severity: "high",
      cvss: 7.8,
      affectedPackage: "linux-kernel",
      version: "6.1.0",
      fixedVersion: "6.1.76",
      wazuhAgent: "backup-server-01",
      detectedAt: "2025-01-19T10:15:00Z",
      status: "patched",
      category: "Memory Corruption",
      relatedEvents: [],
    },
    {
      id: "vuln-005",
      cve: "CVE-2024-0727",
      title: "OpenSSL Denial of Service",
      description: "Processing a maliciously formatted PKCS12 file may lead to denial of service",
      severity: "medium",
      cvss: 5.5,
      affectedPackage: "openssl",
      version: "3.0.2",
      fixedVersion: "3.0.13",
      wazuhAgent: "db-server-01",
      detectedAt: "2025-01-19T10:20:00Z",
      status: "mitigated",
      category: "Denial of Service",
      relatedEvents: [],
    },
  ]

  const events: SecurityEvent[] = [
    {
      id: "EVT-7823",
      timestamp: "2025-01-19T07:42:13",
      type: "Authentication",
      source: "192.168.1.105",
      destination: "192.168.1.10",
      description: "Multiple failed SSH login attempts detected",
      riskLevel: "high",
      status: "active",
      wazuhAgent: "web-server-01",
      ruleId: "5710",
      severity: 8,
    },
    {
      id: "EVT-7822",
      timestamp: "2025-01-19T07:38:45",
      type: "Network",
      source: "203.0.113.42",
      destination: "192.168.1.20",
      description: "Suspicious port scanning activity targeting database server",
      riskLevel: "high",
      status: "active",
      wazuhAgent: "db-server-01",
      ruleId: "40101",
      severity: 7,
    },
    {
      id: "EVT-7821",
      timestamp: "2025-01-19T07:35:22",
      type: "Malware",
      source: "192.168.1.10",
      destination: "198.51.100.23",
      description: "Potential malware communication detected from web server",
      riskLevel: "critical",
      status: "investigating",
      wazuhAgent: "web-server-01",
      ruleId: "554",
      severity: 9,
    },
    {
      id: "EVT-7820",
      timestamp: "2025-01-19T07:30:18",
      type: "Data",
      source: "192.168.1.20",
      destination: "203.0.113.100",
      description: "Large data transfer detected from database server",
      riskLevel: "medium",
      status: "investigating",
      wazuhAgent: "db-server-01",
      ruleId: "31108",
      severity: 6,
    },
    {
      id: "EVT-7819",
      timestamp: "2025-01-19T07:25:56",
      type: "System",
      source: "192.168.1.40",
      destination: "N/A",
      description: "Critical backup service stopped unexpectedly",
      riskLevel: "medium",
      status: "resolved",
      wazuhAgent: "backup-server-01",
      ruleId: "2502",
      severity: 5,
    },
    {
      id: "EVT-7818",
      timestamp: "2025-01-19T07:20:33",
      type: "Authentication",
      source: "192.168.1.120",
      destination: "192.168.1.10",
      description: "Successful login after multiple failures - potential brute force",
      riskLevel: "high",
      status: "investigating",
      wazuhAgent: "web-server-01",
      ruleId: "5715",
      severity: 7,
    },
    {
      id: "EVT-7817",
      timestamp: "2025-01-19T07:15:12",
      type: "Network",
      source: "192.168.1.125",
      destination: "192.168.1.0/24",
      description: "Internal network reconnaissance detected",
      riskLevel: "medium",
      status: "active",
      wazuhAgent: "web-server-01",
      ruleId: "40103",
      severity: 6,
    },
    {
      id: "EVT-7816",
      timestamp: "2025-01-19T07:10:45",
      type: "Policy",
      source: "192.168.1.30",
      destination: "N/A",
      description: "Security policy violation - unauthorized software installation",
      riskLevel: "low",
      status: "resolved",
      wazuhAgent: "mail-server-01",
      ruleId: "80101",
      severity: 3,
    },
  ]

  // Create logical relationships between events and vulnerabilities
  vulnerabilities[0].relatedEvents = ["EVT-7821", "EVT-7818"] // XZ Utils related to malware and auth events
  vulnerabilities[1].relatedEvents = ["EVT-7823", "EVT-7818"] // OpenSSH related to auth events
  vulnerabilities[2].relatedEvents = ["EVT-7821"] // runc related to malware event

  // Update agent counts based on actual data
  agents.forEach((agent) => {
    agent.eventsCount = events.filter((e) => e.wazuhAgent === agent.name).length
    agent.vulnerabilitiesCount = vulnerabilities.filter((v) => v.wazuhAgent === agent.name).length
  })

  return { agents, vulnerabilities, events }
}

export function useSecurityData() {
  const [data, setData] = useState(() => generateSecurityData())
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Calculate metrics based on actual data
  const metrics: SystemMetrics = {
    totalEvents: data.events.length,
    activeThreats: data.events.filter((e) => e.status === "active").length,
    criticalVulnerabilities: data.vulnerabilities.filter((v) => v.severity === "critical" && v.status === "open")
      .length,
    securityScore: Math.max(0, 100 - data.vulnerabilities.filter((v) => v.status === "open").length * 5),
    avgResponseTime: "4m 32s",
    connectedAgents: data.agents.filter((a) => a.status === "active").length,
    totalAgents: data.agents.length,
  }

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => ({
        ...prevData,
        agents: prevData.agents.map((agent) => {
          if (agent.status === "active" && Math.random() > 0.1) {
            return {
              ...agent,
              lastKeepAlive: new Date().toISOString(),
            }
          }
          return agent
        }),
      }))
      setLastUpdate(new Date())
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const refreshData = useCallback(async () => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate some new events or update existing ones
    setData((prevData) => {
      const newEvents = [...prevData.events]

      // Simulate new event detection
      if (Math.random() > 0.7) {
        const agents = prevData.agents.filter((a) => a.status === "active")
        const randomAgent = agents[Math.floor(Math.random() * agents.length)]

        if (randomAgent) {
          const newEvent: SecurityEvent = {
            id: `EVT-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: ["Authentication", "Network", "System"][Math.floor(Math.random() * 3)] as any,
            source: `192.168.1.${Math.floor(Math.random() * 255)}`,
            destination: randomAgent.ip,
            description: "New security event detected by Wazuh agent",
            riskLevel: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as any,
            status: "active",
            wazuhAgent: randomAgent.name,
            ruleId: `${Math.floor(Math.random() * 90000) + 10000}`,
            severity: Math.floor(Math.random() * 10) + 1,
          }
          newEvents.unshift(newEvent)
        }
      }

      // Update agent counts
      const updatedAgents = prevData.agents.map((agent) => ({
        ...agent,
        eventsCount: newEvents.filter((e) => e.wazuhAgent === agent.name).length,
        lastKeepAlive: agent.status === "active" ? new Date().toISOString() : agent.lastKeepAlive,
      }))

      return {
        ...prevData,
        events: newEvents,
        agents: updatedAgents,
      }
    })

    setLastUpdate(new Date())
    setIsLoading(false)
  }, [])

  return {
    ...data,
    metrics,
    isLoading,
    lastUpdate,
    refreshData,
  }
}
