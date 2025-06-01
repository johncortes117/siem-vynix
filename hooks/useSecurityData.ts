"use client"

import { useState, useEffect, useCallback } from "react"
import type { SecurityEvent, WazuhAgent, Vulnerability, SystemMetrics } from "@/types/dashboard"

// Datos base centralizados - FUENTE ÚNICA DE VERDAD
const generateCentralizedSecurityData = () => {
  // Agentes Wazuh base
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

  // Vulnerabilidades base con relación a agentes específicos
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
    {
      id: "vuln-006",
      cve: "CVE-2024-2961",
      title: "glibc Buffer Overflow",
      description: "Buffer overflow in iconv() function when processing invalid multi-byte sequences",
      severity: "medium",
      cvss: 6.9,
      affectedPackage: "glibc",
      version: "2.35",
      fixedVersion: "2.39",
      wazuhAgent: "web-server-01",
      detectedAt: "2025-01-19T10:10:00Z",
      status: "open",
      category: "Buffer Overflow",
      relatedEvents: [],
    },
  ]

  // Eventos de seguridad relacionados directamente con vulnerabilidades y agentes
  const events: SecurityEvent[] = [
    // Eventos relacionados con CVE-2024-3094 (XZ Utils) en web-server-01
    {
      id: "EVT-7823",
      timestamp: "2025-01-19T10:32:13",
      type: "Malware",
      source: "192.168.1.10",
      destination: "198.51.100.23",
      description: "Suspicious XZ Utils library activity detected - potential backdoor exploitation",
      riskLevel: "critical",
      status: "active",
      wazuhAgent: "web-server-01",
      ruleId: "554",
      severity: 9,
    },
    {
      id: "EVT-7822",
      timestamp: "2025-01-19T10:31:45",
      type: "System",
      source: "192.168.1.10",
      destination: "N/A",
      description: "Anomalous process execution detected in XZ Utils context",
      riskLevel: "critical",
      status: "active",
      wazuhAgent: "web-server-01",
      ruleId: "2502",
      severity: 9,
    },

    // Eventos relacionados con CVE-2024-6387 (OpenSSH) en db-server-01
    {
      id: "EVT-7821",
      timestamp: "2025-01-19T10:07:22",
      type: "Authentication",
      source: "203.0.113.42",
      destination: "192.168.1.20",
      description: "Multiple failed SSH login attempts exploiting OpenSSH vulnerability",
      riskLevel: "critical",
      status: "investigating",
      wazuhAgent: "db-server-01",
      ruleId: "5710",
      severity: 9,
    },
    {
      id: "EVT-7820",
      timestamp: "2025-01-19T10:06:18",
      type: "Network",
      source: "203.0.113.42",
      destination: "192.168.1.20",
      description: "Suspicious SSH connection patterns targeting database server",
      riskLevel: "high",
      status: "investigating",
      wazuhAgent: "db-server-01",
      ruleId: "40101",
      severity: 8,
    },

    // Eventos relacionados con CVE-2024-21626 (runc) en web-server-01
    {
      id: "EVT-7819",
      timestamp: "2025-01-19T10:27:56",
      type: "System",
      source: "192.168.1.10",
      destination: "N/A",
      description: "Container escape attempt detected - runc vulnerability exploitation",
      riskLevel: "high",
      status: "active",
      wazuhAgent: "web-server-01",
      ruleId: "31108",
      severity: 8,
    },

    // Eventos relacionados con CVE-2024-1086 (Linux Kernel) en backup-server-01
    {
      id: "EVT-7818",
      timestamp: "2025-01-19T10:17:33",
      type: "System",
      source: "192.168.1.40",
      destination: "N/A",
      description: "Kernel netfilter subsystem anomaly - use-after-free pattern detected",
      riskLevel: "high",
      status: "resolved",
      wazuhAgent: "backup-server-01",
      ruleId: "2503",
      severity: 7,
    },

    // Eventos relacionados con CVE-2024-0727 (OpenSSL) en db-server-01
    {
      id: "EVT-7817",
      timestamp: "2025-01-19T10:22:12",
      type: "Data",
      source: "192.168.1.20",
      destination: "N/A",
      description: "Malformed PKCS12 file processing detected - OpenSSL DoS attempt",
      riskLevel: "medium",
      status: "resolved",
      wazuhAgent: "db-server-01",
      ruleId: "80101",
      severity: 5,
    },

    // Eventos adicionales para completar distribución
    {
      id: "EVT-7816",
      timestamp: "2025-01-19T09:45:45",
      type: "Authentication",
      source: "192.168.1.105",
      destination: "192.168.1.10",
      description: "Successful login after multiple failures - potential brute force",
      riskLevel: "medium",
      status: "investigating",
      wazuhAgent: "web-server-01",
      ruleId: "5715",
      severity: 6,
    },
    {
      id: "EVT-7815",
      timestamp: "2025-01-19T09:30:12",
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
      id: "EVT-7814",
      timestamp: "2025-01-19T09:15:33",
      type: "Policy",
      source: "192.168.1.30",
      destination: "N/A",
      description: "Security policy violation - unauthorized software installation",
      riskLevel: "low",
      status: "resolved",
      wazuhAgent: "mail-server-01",
      ruleId: "80102",
      severity: 3,
    },
    {
      id: "EVT-7813",
      timestamp: "2025-01-19T08:55:21",
      type: "System",
      source: "192.168.1.40",
      destination: "N/A",
      description: "Backup service configuration change detected",
      riskLevel: "low",
      status: "resolved",
      wazuhAgent: "backup-server-01",
      ruleId: "2501",
      severity: 3,
    },
  ]

  // Crear relaciones entre vulnerabilidades y eventos
  vulnerabilities[0].relatedEvents = ["EVT-7823", "EVT-7822"] // XZ Utils
  vulnerabilities[1].relatedEvents = ["EVT-7821", "EVT-7820"] // OpenSSH
  vulnerabilities[2].relatedEvents = ["EVT-7819"] // runc
  vulnerabilities[3].relatedEvents = ["EVT-7818"] // Linux Kernel
  vulnerabilities[4].relatedEvents = ["EVT-7817"] // OpenSSL

  // Actualizar contadores de agentes basados en datos reales
  agents.forEach((agent) => {
    agent.eventsCount = events.filter((e) => e.wazuhAgent === agent.name).length
    agent.vulnerabilitiesCount = vulnerabilities.filter((v) => v.wazuhAgent === agent.name).length
  })

  return { agents, vulnerabilities, events }
}

// Función para generar datos de gráficas basados en eventos reales
const generateChartData = (events: SecurityEvent[]) => {
  // Datos para EventsChart (distribución por tipo)
  const eventTypeDistribution = events.reduce(
    (acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Datos para RiskDistributionChart
  const riskDistribution = events.reduce(
    (acc, event) => {
      acc[event.riskLevel] = (acc[event.riskLevel] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Datos para TimelineChart (últimas 24 horas)
  const timelineData = []
  for (let i = 23; i >= 0; i--) {
    const hour = new Date(Date.now() - i * 60 * 60 * 1000).getHours()
    const hourEvents = events.filter((event) => {
      const eventHour = new Date(event.timestamp).getHours()
      return eventHour === hour
    })

    timelineData.push({
      hour,
      high: hourEvents.filter((e) => e.riskLevel === "critical" || e.riskLevel === "high").length,
      medium: hourEvents.filter((e) => e.riskLevel === "medium").length,
      low: hourEvents.filter((e) => e.riskLevel === "low").length,
    })
  }

  // Datos para NetworkActivityMap (distribución geográfica simulada)
  const networkActivityData = [
    {
      name: "Quito",
      coords: [-0.1807, -78.4678],
      events: events.filter((e) => e.wazuhAgent === "web-server-01" || e.wazuhAgent === "mail-server-01").length,
      risk: "high",
      color: "#ef4444",
      description: "Capital - Servidores Web y Mail",
    },
    {
      name: "Guayaquil",
      coords: [-2.1894, -79.889],
      events: events.filter((e) => e.wazuhAgent === "db-server-01").length,
      risk: "high",
      color: "#f59e0b",
      description: "Puerto Principal - Servidor Base de Datos",
    },
    {
      name: "Cuenca",
      coords: [-2.9001, -79.0059],
      events: events.filter((e) => e.wazuhAgent === "backup-server-01").length,
      risk: "medium",
      color: "#f59e0b",
      description: "Centro de Respaldo",
    },
  ]

  return {
    eventTypeDistribution,
    riskDistribution,
    timelineData,
    networkActivityData,
  }
}

// Estado inicial vacío para simular sistema sin datos
const emptyData = {
  agents: [] as WazuhAgent[],
  vulnerabilities: [] as Vulnerability[],
  events: [] as SecurityEvent[],
}

const emptyChartData = {
  eventTypeDistribution: {},
  riskDistribution: {},
  timelineData: Array(24).fill({ hour: 0, high: 0, medium: 0, low: 0 }),
  networkActivityData: [],
}

const emptyMetrics: SystemMetrics = {
  totalEvents: 0,
  activeThreats: 0,
  criticalVulnerabilities: 0,
  securityScore: 100,
  avgResponseTime: "0m 0s",
  connectedAgents: 0,
  totalAgents: 0,
}

export function useSecurityData() {
  // Estados para el flujo de simulación
  const [isConnected, setIsConnected] = useState(false)
  const [isAnalyzed, setIsAnalyzed] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [connectionProgress, setConnectionProgress] = useState(0)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  // Estados para los datos
  const [data, setData] = useState(emptyData)
  const [chartData, setChartData] = useState(emptyChartData)
  const [metrics, setMetrics] = useState(emptyMetrics)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Efecto para actualizar datos en tiempo real (solo si está conectado y analizado)
  useEffect(() => {
    if (!isConnected || !isAnalyzed) return

    const interval = setInterval(() => {
      setData((prevData) => {
        const updatedAgents = prevData.agents.map((agent) => {
          if (agent.status === "active" && Math.random() > 0.1) {
            return {
              ...agent,
              lastKeepAlive: new Date().toISOString(),
            }
          }
          return agent
        })

        // Ocasionalmente agregar nuevos eventos relacionados con vulnerabilidades existentes
        const updatedEvents = [...prevData.events]
        if (Math.random() > 0.8) {
          const activeAgents = updatedAgents.filter((a) => a.status === "active")
          const randomAgent = activeAgents[Math.floor(Math.random() * activeAgents.length)]

          if (randomAgent) {
            const relatedVulns = prevData.vulnerabilities.filter((v) => v.wazuhAgent === randomAgent.name)
            if (relatedVulns.length > 0) {
              const randomVuln = relatedVulns[Math.floor(Math.random() * relatedVulns.length)]

              const newEvent: SecurityEvent = {
                id: `EVT-${Date.now()}`,
                timestamp: new Date().toISOString(),
                type: randomVuln.category.includes("Authentication")
                  ? "Authentication"
                  : randomVuln.category.includes("Network")
                    ? "Network"
                    : "System",
                source: randomAgent.ip,
                destination: Math.random() > 0.5 ? "N/A" : `203.0.113.${Math.floor(Math.random() * 255)}`,
                description: `New security event related to ${randomVuln.cve} vulnerability`,
                riskLevel:
                  randomVuln.severity === "critical" ? "critical" : randomVuln.severity === "high" ? "high" : "medium",
                status: "active",
                wazuhAgent: randomAgent.name,
                ruleId: `${Math.floor(Math.random() * 90000) + 10000}`,
                severity: randomVuln.severity === "critical" ? 9 : randomVuln.severity === "high" ? 7 : 5,
              }

              updatedEvents.unshift(newEvent)

              // Actualizar relación en vulnerabilidad
              const updatedVulns = prevData.vulnerabilities.map((v) => {
                if (v.id === randomVuln.id) {
                  return {
                    ...v,
                    relatedEvents: [...v.relatedEvents, newEvent.id],
                  }
                }
                return v
              })

              const newData = {
                ...prevData,
                events: updatedEvents,
                vulnerabilities: updatedVulns,
                agents: updatedAgents.map((agent) => ({
                  ...agent,
                  eventsCount: updatedEvents.filter((e) => e.wazuhAgent === agent.name).length,
                })),
              }

              // Actualizar métricas y datos de gráficas
              setChartData(generateChartData(newData.events))
              updateMetrics(newData)

              return newData
            }
          }
        }

        return {
          ...prevData,
          agents: updatedAgents,
        }
      })

      setLastUpdate(new Date())
    }, 15000) // Actualizar cada 15 segundos

    return () => clearInterval(interval)
  }, [isConnected, isAnalyzed])

  // Función para actualizar métricas basadas en datos actuales
  const updateMetrics = (currentData: typeof data) => {
    setMetrics({
      totalEvents: currentData.events.length,
      activeThreats: currentData.events.filter((e) => e.status === "active").length,
      criticalVulnerabilities: currentData.vulnerabilities.filter(
        (v) => v.severity === "critical" && v.status === "open",
      ).length,
      securityScore: Math.max(
        0,
        100 -
          currentData.vulnerabilities.filter((v) => v.status === "open").length * 8 -
          currentData.events.filter((e) => e.riskLevel === "critical").length * 5,
      ),
      avgResponseTime: "4m 32s",
      connectedAgents: currentData.agents.filter((a) => a.status === "active").length,
      totalAgents: currentData.agents.length,
    })
  }

  // Función para simular conexión con Wazuh
  const connectToWazuh = useCallback(async () => {
    setIsConnecting(true)
    setConnectionProgress(0)

    // Simular progreso de conexión
    for (let i = 0; i <= 100; i += 10) {
      setConnectionProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    // Obtener solo los agentes, sin eventos ni vulnerabilidades
    const { agents } = generateCentralizedSecurityData()

    // Establecer solo los agentes, manteniendo eventos y vulnerabilidades vacíos
    setData({
      agents,
      events: [],
      vulnerabilities: [],
    })

    setIsConnected(true)
    setIsConnecting(false)
    setLastUpdate(new Date())
  }, [])

  // Función para simular análisis de seguridad
  const runAnalysis = useCallback(async () => {
    if (!isConnected) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simular progreso de análisis
    for (let i = 0; i <= 100; i += 5) {
      setAnalysisProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    // Obtener datos completos
    const fullData = generateCentralizedSecurityData()
    setData(fullData)

    // Generar datos de gráficas y métricas
    const newChartData = generateChartData(fullData.events)
    setChartData(newChartData)
    updateMetrics(fullData)

    setIsAnalyzed(true)
    setIsAnalyzing(false)
    setLastUpdate(new Date())
  }, [isConnected])

  // Función para refrescar datos (solo si ya está analizado)
  const refreshData = useCallback(async () => {
    if (!isConnected || !isAnalyzed) return

    setIsLoading(true)

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Regenerar algunos datos manteniendo consistencia
    setData((prevData) => {
      // Simular resolución de algunos eventos
      const updatedEvents = prevData.events.map((event) => {
        if (event.status === "active" && Math.random() > 0.7) {
          return { ...event, status: "resolved" as const }
        }
        return event
      })

      // Simular parcheo de algunas vulnerabilidades
      const updatedVulns = prevData.vulnerabilities.map((vuln) => {
        if (vuln.status === "open" && vuln.severity !== "critical" && Math.random() > 0.8) {
          return { ...vuln, status: "patched" as const }
        }
        return vuln
      })

      // Actualizar contadores de agentes
      const updatedAgents = prevData.agents.map((agent) => ({
        ...agent,
        eventsCount: updatedEvents.filter((e) => e.wazuhAgent === agent.name).length,
        vulnerabilitiesCount: updatedVulns.filter((v) => v.wazuhAgent === agent.name).length,
        lastKeepAlive: agent.status === "active" ? new Date().toISOString() : agent.lastKeepAlive,
      }))

      const newData = {
        events: updatedEvents,
        vulnerabilities: updatedVulns,
        agents: updatedAgents,
      }

      // Actualizar métricas y datos de gráficas
      setChartData(generateChartData(newData.events))
      updateMetrics(newData)

      return newData
    })

    setLastUpdate(new Date())
    setIsLoading(false)
  }, [isConnected, isAnalyzed])

  return {
    ...data,
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
  }
}
