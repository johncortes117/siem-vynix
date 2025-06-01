export interface SecurityEvent {
  id: string
  timestamp: string
  type: "Authentication" | "Network" | "Malware" | "Data" | "System" | "Policy"
  source: string
  destination: string
  description: string
  riskLevel: "critical" | "high" | "medium" | "low"
  status: "active" | "investigating" | "resolved"
  wazuhAgent: string
  ruleId: string
  severity: number
}

export interface WazuhAgent {
  id: string
  name: string
  ip: string
  os: string
  version: string
  status: "active" | "disconnected" | "never_connected"
  lastKeepAlive: string
  eventsCount: number
  vulnerabilitiesCount: number
}

export interface Vulnerability {
  id: string
  cve: string
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  cvss: number
  affectedPackage: string
  version: string
  fixedVersion?: string
  wazuhAgent: string
  detectedAt: string
  status: "open" | "patched" | "mitigated" | "false_positive"
  category: string
  relatedEvents: string[]
}

export interface SystemMetrics {
  totalEvents: number
  activeThreats: number
  criticalVulnerabilities: number
  securityScore: number
  avgResponseTime: string
  connectedAgents: number
  totalAgents: number
}

export interface ReportConfig {
  startDate: string
  endDate: string
  includeEvents: boolean
  includeVulnerabilities: boolean
  includeMetrics: boolean
  format: "pdf" | "json" | "csv"
}
