"use client"

import { useEffect, useRef, useState } from "react"

interface RiskDistributionChartProps {
  riskDistribution: Record<string, number>
}

export default function RiskDistributionChart({ riskDistribution }: RiskDistributionChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1

    canvas.width = dimensions.width * dpr
    canvas.height = dimensions.height * dpr
    canvas.style.width = dimensions.width + "px"
    canvas.style.height = dimensions.height + "px"

    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, dimensions.width, dimensions.height)

    // Usar datos reales de distribución de riesgo
    const total = Object.values(riskDistribution).reduce((sum, count) => sum + count, 0)

    const data = [
      {
        label: "Critical",
        value: total > 0 ? Math.round(((riskDistribution.critical || 0) / total) * 100) : 0,
        color: "#ef4444",
        count: riskDistribution.critical || 0,
      },
      {
        label: "High",
        value: total > 0 ? Math.round(((riskDistribution.high || 0) / total) * 100) : 0,
        color: "#f59e0b",
        count: riskDistribution.high || 0,
      },
      {
        label: "Medium",
        value: total > 0 ? Math.round(((riskDistribution.medium || 0) / total) * 100) : 0,
        color: "#f59e0b",
        count: riskDistribution.medium || 0,
      },
      {
        label: "Low",
        value: total > 0 ? Math.round(((riskDistribution.low || 0) / total) * 100) : 0,
        color: "#22c55e",
        count: riskDistribution.low || 0,
      },
    ].filter((item) => item.count > 0) // Solo mostrar niveles con eventos

    if (total === 0) {
      ctx.fillStyle = "#94a3b8"
      ctx.font = "14px Inter, system-ui, sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("No hay eventos", dimensions.width / 2, dimensions.height / 2)
      return
    }

    // Responsive sizing
    const isMobile = dimensions.width < 400
    const barHeight = Math.max(15, Math.min(dimensions.height / 6, 25))
    const barSpacing = Math.max(8, Math.min(dimensions.height / 12, 15))
    const maxBarWidth = dimensions.width - (isMobile ? 80 : 120)
    const startY = isMobile ? 25 : 35

    const maxValue = Math.max(...data.map((item) => item.value))

    // Draw bars
    data.forEach((item, index) => {
      const y = startY + index * (barHeight + barSpacing)
      const barWidth = maxValue > 0 ? (item.value / maxValue) * maxBarWidth : 0

      // Draw label
      const labelFontSize = Math.max(8, Math.min(dimensions.width / 30, 12))
      ctx.fillStyle = "#94a3b8"
      ctx.font = `${labelFontSize}px Inter, system-ui, sans-serif`
      ctx.textAlign = "right"
      ctx.textBaseline = "middle"
      ctx.fillText(item.label, isMobile ? 50 : 70, y + barHeight / 2)

      // Draw background bar
      ctx.fillStyle = "#1e293b"
      ctx.beginPath()
      ctx.roundRect(isMobile ? 55 : 80, y, maxBarWidth, barHeight, 3)
      ctx.fill()

      // Draw value bar with gradient
      if (barWidth > 0) {
        const gradient = ctx.createLinearGradient(isMobile ? 55 : 80, y, (isMobile ? 55 : 80) + barWidth, y + barHeight)
        gradient.addColorStop(0, item.color + "40")
        gradient.addColorStop(0.5, item.color)
        gradient.addColorStop(1, item.color + "CC")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.roundRect(isMobile ? 55 : 80, y, barWidth, barHeight, 3)
        ctx.fill()
      }

      // Draw percentage
      const percentFontSize = Math.max(8, Math.min(dimensions.width / 35, 11))
      ctx.fillStyle = "#f8fafc"
      ctx.font = `bold ${percentFontSize}px Inter, system-ui, sans-serif`
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"

      const textX = barWidth > 40 ? (isMobile ? 65 : 90) : (isMobile ? 55 : 80) + barWidth + 5
      ctx.fillText(`${item.value}%`, textX, y + barHeight / 2)

      // Draw event count (hide on very small screens)
      if (!isMobile || dimensions.width > 300) {
        const countFontSize = Math.max(7, Math.min(dimensions.width / 40, 9))
        ctx.fillStyle = "#64748b"
        ctx.font = `${countFontSize}px Inter, system-ui, sans-serif`
        ctx.textAlign = "right"
        ctx.fillText(`${item.count}`, dimensions.width - 5, y + barHeight / 2)
      }
    })

    // Draw title
    const titleFontSize = Math.max(10, Math.min(dimensions.width / 25, 14))
    ctx.fillStyle = "#f8fafc"
    ctx.font = `bold ${titleFontSize}px Inter, system-ui, sans-serif`
    ctx.textAlign = "left"
    ctx.textBaseline = "top"
    ctx.fillText(isMobile ? "Risk Distribution" : "Risk Level Distribution", 0, 5)

    // Draw total (hide on very small screens)
    if (dimensions.width > 250) {
      const totalFontSize = Math.max(8, Math.min(dimensions.width / 35, 11))
      ctx.fillStyle = "#94a3b8"
      ctx.font = `${totalFontSize}px Inter, system-ui, sans-serif`
      ctx.textAlign = "right"
      ctx.fillText(`Total: ${total}`, dimensions.width - 5, 8)
    }
  }, [dimensions, riskDistribution])

  return (
    <div ref={containerRef} className="relative w-full h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px]">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
