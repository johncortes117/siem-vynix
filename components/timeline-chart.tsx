"use client"

import { useEffect, useRef, useState } from "react"

interface TimelineChartProps {
  timelineData: Array<{
    hour: number
    high: number
    medium: number
    low: number
  }>
}

export default function TimelineChart({ timelineData }: TimelineChartProps) {
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

    // Responsive padding
    const isMobile = dimensions.width < 400
    const padding = {
      top: Math.max(15, dimensions.height * 0.1),
      right: Math.max(10, dimensions.width * 0.05),
      bottom: Math.max(25, dimensions.height * 0.15),
      left: Math.max(25, dimensions.width * 0.08),
    }

    const chartWidth = dimensions.width - padding.left - padding.right
    const chartHeight = dimensions.height - padding.top - padding.bottom

    const hours = timelineData.length
    const maxValue = Math.max(...timelineData.map((d) => d.high + d.medium + d.low), 1)

    // Draw axes
    const drawAxes = () => {
      ctx.strokeStyle = "#475569"
      ctx.lineWidth = 1

      // X-axis
      ctx.beginPath()
      ctx.moveTo(padding.left, dimensions.height - padding.bottom)
      ctx.lineTo(dimensions.width - padding.right, dimensions.height - padding.bottom)
      ctx.stroke()

      // Y-axis
      ctx.beginPath()
      ctx.moveTo(padding.left, padding.top)
      ctx.lineTo(padding.left, dimensions.height - padding.bottom)
      ctx.stroke()

      // Labels
      const labelFontSize = Math.max(6, Math.min(10, dimensions.width / 60))
      ctx.fillStyle = "#94a3b8"
      ctx.font = `${labelFontSize}px Inter, system-ui, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "top"

      // X-axis labels (fewer on mobile)
      const hourStep = isMobile ? 6 : 4
      for (let i = 0; i < hours; i += hourStep) {
        const x = padding.left + (i / (hours - 1)) * chartWidth
        ctx.fillText(`${timelineData[i]?.hour || 0}h`, x, dimensions.height - padding.bottom + 5)
      }

      // Y-axis labels
      ctx.textAlign = "right"
      ctx.textBaseline = "middle"
      for (let i = 0; i <= 3; i++) {
        const y = dimensions.height - padding.bottom - (i / 3) * chartHeight
        ctx.fillText(`${Math.round((i / 3) * maxValue)}`, padding.left - 5, y)
      }

      // Grid lines
      ctx.strokeStyle = "#334155"
      ctx.lineWidth = 0.5
      ctx.setLineDash([2, 2])
      ctx.globalAlpha = 0.5

      for (let i = 1; i <= 3; i++) {
        const y = dimensions.height - padding.bottom - (i / 3) * chartHeight
        ctx.beginPath()
        ctx.moveTo(padding.left, y)
        ctx.lineTo(dimensions.width - padding.right, y)
        ctx.stroke()
      }

      ctx.setLineDash([])
      ctx.globalAlpha = 1
    }

    // Draw bars
    const drawBars = () => {
      const barWidth = Math.max(1, (chartWidth / hours) * 0.6)

      timelineData.forEach((d, i) => {
        const x = padding.left + i * (chartWidth / (hours - 1)) - barWidth / 2
        let y = dimensions.height - padding.bottom

        // Low risk
        const lowHeight = maxValue > 0 ? (d.low / maxValue) * chartHeight : 0
        ctx.fillStyle = "#22c55e"
        ctx.fillRect(x, y - lowHeight, barWidth, lowHeight)
        y -= lowHeight

        // Medium risk
        const mediumHeight = maxValue > 0 ? (d.medium / maxValue) * chartHeight : 0
        ctx.fillStyle = "#f59e0b"
        ctx.fillRect(x, y - mediumHeight, barWidth, mediumHeight)
        y -= mediumHeight

        // High risk
        const highHeight = maxValue > 0 ? (d.high / maxValue) * chartHeight : 0
        ctx.fillStyle = "#ef4444"
        ctx.fillRect(x, y - highHeight, barWidth, highHeight)
      })
    }

    // Draw line
    const drawLines = () => {
      const totals = timelineData.map((d) => d.high + d.medium + d.low)

      ctx.strokeStyle = "#06b6d4"
      ctx.lineWidth = 2
      ctx.beginPath()

      totals.forEach((total, i) => {
        const x = padding.left + i * (chartWidth / (hours - 1))
        const y = dimensions.height - padding.bottom - (maxValue > 0 ? (total / maxValue) * chartHeight : 0)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Points
      const pointSize = Math.max(1, Math.min(3, dimensions.width / 200))
      totals.forEach((total, i) => {
        const x = padding.left + i * (chartWidth / (hours - 1))
        const y = dimensions.height - padding.bottom - (maxValue > 0 ? (total / maxValue) * chartHeight : 0)

        ctx.fillStyle = "#06b6d4"
        ctx.beginPath()
        ctx.arc(x, y, pointSize, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    // Draw legend (simplified for mobile)
    const drawLegend = () => {
      const legendFontSize = Math.max(6, Math.min(10, dimensions.width / 60))

      if (isMobile) {
        // Simple legend for mobile
        ctx.fillStyle = "#f8fafc"
        ctx.font = `bold ${legendFontSize}px Inter, system-ui, sans-serif`
        ctx.textAlign = "left"
        ctx.textBaseline = "top"
        ctx.fillText("24h Events", padding.left, 5)
      } else {
        // Full legend for larger screens
        const legendItems = [
          { label: "High", color: "#ef4444" },
          { label: "Medium", color: "#f59e0b" },
          { label: "Low", color: "#22c55e" },
          { label: "Total", color: "#06b6d4" },
        ]

        const legendX = dimensions.width - padding.right - 80
        const legendY = padding.top + 5

        legendItems.forEach((item, i) => {
          const y = legendY + i * 14

          ctx.fillStyle = item.color
          ctx.fillRect(legendX, y, 8, 8)

          ctx.fillStyle = "#94a3b8"
          ctx.font = `${legendFontSize}px Inter, system-ui, sans-serif`
          ctx.textAlign = "left"
          ctx.textBaseline = "top"
          ctx.fillText(item.label, legendX + 12, y)
        })

        // Summary
        const totalEvents = timelineData.reduce((sum, d) => sum + d.high + d.medium + d.low, 0)
        ctx.fillStyle = "#f8fafc"
        ctx.font = `bold ${legendFontSize + 1}px Inter, system-ui, sans-serif`
        ctx.textAlign = "left"
        ctx.fillText(`Total: ${totalEvents} events`, padding.left, padding.top - 10)
      }
    }

    // Draw everything
    drawAxes()
    drawBars()
    drawLines()
    drawLegend()
  }, [dimensions, timelineData])

  return (
    <div ref={containerRef} className="relative w-full h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px]">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
