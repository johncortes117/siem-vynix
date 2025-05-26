"use client"

import { useEffect, useRef, useState } from "react"

export default function TimelineChart() {
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

    // Sample data
    const hours = 24
    const data = [
      { hour: 0, high: 2, medium: 3, low: 5 },
      { hour: 1, high: 1, medium: 2, low: 4 },
      { hour: 2, high: 0, medium: 1, low: 3 },
      { hour: 3, high: 0, medium: 1, low: 2 },
      { hour: 4, high: 1, medium: 0, low: 1 },
      { hour: 5, high: 0, medium: 1, low: 2 },
      { hour: 6, high: 1, medium: 2, low: 3 },
      { hour: 7, high: 2, medium: 3, low: 4 },
      { hour: 8, high: 3, medium: 5, low: 6 },
      { hour: 9, high: 4, medium: 6, low: 8 },
      { hour: 10, high: 3, medium: 5, low: 7 },
      { hour: 11, high: 2, medium: 4, low: 6 },
      { hour: 12, high: 3, medium: 5, low: 5 },
      { hour: 13, high: 4, medium: 6, low: 7 },
      { hour: 14, high: 5, medium: 7, low: 8 },
      { hour: 15, high: 4, medium: 6, low: 7 },
      { hour: 16, high: 3, medium: 5, low: 6 },
      { hour: 17, high: 4, medium: 4, low: 5 },
      { hour: 18, high: 3, medium: 3, low: 4 },
      { hour: 19, high: 2, medium: 4, low: 5 },
      { hour: 20, high: 3, medium: 3, low: 4 },
      { hour: 21, high: 2, medium: 2, low: 3 },
      { hour: 22, high: 1, medium: 2, low: 4 },
      { hour: 23, high: 2, medium: 3, low: 5 },
    ]

    const maxValue = Math.max(...data.map((d) => d.high + d.medium + d.low))

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
        ctx.fillText(`${i}h`, x, dimensions.height - padding.bottom + 5)
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

      data.forEach((d, i) => {
        const x = padding.left + i * (chartWidth / (hours - 1)) - barWidth / 2
        let y = dimensions.height - padding.bottom

        // Low risk
        const lowHeight = (d.low / maxValue) * chartHeight
        ctx.fillStyle = "#22c55e"
        ctx.fillRect(x, y - lowHeight, barWidth, lowHeight)
        y -= lowHeight

        // Medium risk
        const mediumHeight = (d.medium / maxValue) * chartHeight
        ctx.fillStyle = "#f59e0b"
        ctx.fillRect(x, y - mediumHeight, barWidth, mediumHeight)
        y -= mediumHeight

        // High risk
        const highHeight = (d.high / maxValue) * chartHeight
        ctx.fillStyle = "#ef4444"
        ctx.fillRect(x, y - highHeight, barWidth, highHeight)
      })
    }

    // Draw line
    const drawLines = () => {
      const totals = data.map((d) => d.high + d.medium + d.low)

      ctx.strokeStyle = "#06b6d4"
      ctx.lineWidth = 2
      ctx.beginPath()

      totals.forEach((total, i) => {
        const x = padding.left + i * (chartWidth / (hours - 1))
        const y = dimensions.height - padding.bottom - (total / maxValue) * chartHeight

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
        const y = dimensions.height - padding.bottom - (total / maxValue) * chartHeight

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
        const totalEvents = data.reduce((sum, d) => sum + d.high + d.medium + d.low, 0)
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
  }, [dimensions])

  return (
    <div ref={containerRef} className="relative w-full h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px]">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
