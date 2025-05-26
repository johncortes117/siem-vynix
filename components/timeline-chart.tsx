"use client"

import { useEffect, useRef } from "react"

export default function TimelineChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with device pixel ratio for crisp rendering
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = rect.width + "px"
    canvas.style.height = rect.height + "px"

    ctx.scale(dpr, dpr)

    // Chart dimensions (responsive)
    const padding = {
      top: Math.max(20, rect.height * 0.1),
      right: Math.max(20, rect.width * 0.05),
      bottom: Math.max(30, rect.height * 0.15),
      left: Math.max(40, rect.width * 0.08),
    }
    const chartWidth = rect.width - padding.left - padding.right
    const chartHeight = rect.height - padding.top - padding.bottom

    // Generate sample data - 24 hours of events - DATOS FICTICIOS
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

    // Calculate max value for scaling
    const maxValue = Math.max(...data.map((d) => d.high + d.medium + d.low))

    // Draw axes
    const drawAxes = () => {
      ctx.strokeStyle = "#475569" // slate-600
      ctx.lineWidth = 1

      // X-axis
      ctx.beginPath()
      ctx.moveTo(padding.left, rect.height - padding.bottom)
      ctx.lineTo(rect.width - padding.right, rect.height - padding.bottom)
      ctx.stroke()

      // Y-axis
      ctx.beginPath()
      ctx.moveTo(padding.left, padding.top)
      ctx.lineTo(padding.left, rect.height - padding.bottom)
      ctx.stroke()

      // Responsive font sizes
      const labelFontSize = Math.max(8, Math.min(12, rect.width / 60))
      const axisFontSize = Math.max(9, Math.min(11, rect.width / 70))

      // X-axis labels (hours) - responsive spacing
      ctx.fillStyle = "#94a3b8" // slate-400
      ctx.font = `${labelFontSize}px Inter, system-ui, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "top"

      const hourStep = rect.width < 600 ? 4 : rect.width < 400 ? 6 : 2
      for (let i = 0; i < hours; i += hourStep) {
        const x = padding.left + (i / (hours - 1)) * chartWidth
        ctx.fillText(`${i}h`, x, rect.height - padding.bottom + 8)
      }

      // Y-axis labels
      ctx.textAlign = "right"
      ctx.textBaseline = "middle"
      for (let i = 0; i <= 5; i++) {
        const y = rect.height - padding.bottom - (i / 5) * chartHeight
        ctx.fillText(`${Math.round((i / 5) * maxValue)}`, padding.left - 8, y)
      }

      // Grid lines
      ctx.strokeStyle = "#334155" // slate-700
      ctx.lineWidth = 0.5
      ctx.setLineDash([2, 2])
      ctx.globalAlpha = 0.5

      // Horizontal grid lines
      for (let i = 1; i <= 5; i++) {
        const y = rect.height - padding.bottom - (i / 5) * chartHeight
        ctx.beginPath()
        ctx.moveTo(padding.left, y)
        ctx.lineTo(rect.width - padding.right, y)
        ctx.stroke()
      }

      ctx.setLineDash([])
      ctx.globalAlpha = 1
    }

    // Draw stacked bar chart
    const drawBars = () => {
      const barWidth = Math.max(2, (chartWidth / hours) * 0.7)

      data.forEach((d, i) => {
        const x = padding.left + i * (chartWidth / (hours - 1)) - barWidth / 2
        let y = rect.height - padding.bottom

        // Low risk (green)
        const lowHeight = (d.low / maxValue) * chartHeight
        const lowGradient = ctx.createLinearGradient(x, y - lowHeight, x, y)
        lowGradient.addColorStop(0, "#22c55e")
        lowGradient.addColorStop(1, "#22c55e80")

        ctx.fillStyle = lowGradient
        ctx.fillRect(x, y - lowHeight, barWidth, lowHeight)
        y -= lowHeight

        // Medium risk (amber)
        const mediumHeight = (d.medium / maxValue) * chartHeight
        const mediumGradient = ctx.createLinearGradient(x, y - mediumHeight, x, y)
        mediumGradient.addColorStop(0, "#f59e0b")
        mediumGradient.addColorStop(1, "#f59e0b80")

        ctx.fillStyle = mediumGradient
        ctx.fillRect(x, y - mediumHeight, barWidth, mediumHeight)
        y -= mediumHeight

        // High risk (red)
        const highHeight = (d.high / maxValue) * chartHeight
        const highGradient = ctx.createLinearGradient(x, y - highHeight, x, y)
        highGradient.addColorStop(0, "#ef4444")
        highGradient.addColorStop(1, "#ef4444CC")

        ctx.fillStyle = highGradient
        ctx.fillRect(x, y - highHeight, barWidth, highHeight)

        // Add glow to high risk bars
        if (d.high > 0) {
          ctx.shadowColor = "#ef4444"
          ctx.shadowBlur = 8
          ctx.fillRect(x, y - highHeight, barWidth, highHeight)
          ctx.shadowBlur = 0
        }
      })
    }

    // Draw line chart overlay
    const drawLines = () => {
      // Calculate total events per hour
      const totals = data.map((d) => d.high + d.medium + d.low)

      // Draw line with gradient
      const lineGradient = ctx.createLinearGradient(0, padding.top, 0, rect.height - padding.bottom)
      lineGradient.addColorStop(0, "#06b6d4")
      lineGradient.addColorStop(1, "#06b6d480")

      ctx.strokeStyle = "#06b6d4" // cyan-500
      ctx.lineWidth = 2
      ctx.beginPath()

      totals.forEach((total, i) => {
        const x = padding.left + i * (chartWidth / (hours - 1))
        const y = rect.height - padding.bottom - (total / maxValue) * chartHeight

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Add glow to line
      ctx.shadowColor = "#06b6d4"
      ctx.shadowBlur = 8
      ctx.stroke()
      ctx.shadowBlur = 0

      // Draw points with responsive size
      const pointSize = Math.max(2, Math.min(4, rect.width / 200))
      totals.forEach((total, i) => {
        const x = padding.left + i * (chartWidth / (hours - 1))
        const y = rect.height - padding.bottom - (total / maxValue) * chartHeight

        ctx.fillStyle = "#06b6d4"
        ctx.beginPath()
        ctx.arc(x, y, pointSize, 0, Math.PI * 2)
        ctx.fill()

        // Add glow to points
        ctx.shadowColor = "#06b6d4"
        ctx.shadowBlur = 5
        ctx.beginPath()
        ctx.arc(x, y, pointSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })
    }

    // Draw legend (responsive)
    const drawLegend = () => {
      const legendItems = [
        { label: "High Risk", color: "#ef4444" },
        { label: "Medium Risk", color: "#f59e0b" },
        { label: "Low Risk", color: "#22c55e" },
        { label: "Total Events", color: "#06b6d4" },
      ]

      const legendFontSize = Math.max(8, Math.min(12, rect.width / 60))
      const legendSpacing = Math.max(15, rect.width / 40)

      // Position legend responsively
      const legendX = rect.width < 600 ? padding.left : rect.width - padding.right - 120
      const legendY = rect.width < 600 ? rect.height - 60 : padding.top + 10

      legendItems.forEach((item, i) => {
        const x = rect.width < 600 ? legendX + i * legendSpacing : legendX
        const y = rect.width < 600 ? legendY : legendY + i * 18

        // Draw color box
        ctx.fillStyle = item.color
        ctx.fillRect(x, y, 10, 10)

        // Draw label
        ctx.fillStyle = "#94a3b8" // slate-400
        ctx.font = `${legendFontSize}px Inter, system-ui, sans-serif`
        ctx.textAlign = "left"
        ctx.textBaseline = "top"

        if (rect.width < 600) {
          // Abbreviated labels for small screens
          const shortLabels = ["High", "Med", "Low", "Total"]
          ctx.fillText(shortLabels[i], x + 15, y + 12)
        } else {
          ctx.fillText(item.label, x + 15, y + 2)
        }
      })

      // Add summary info
      const totalEvents = data.reduce((sum, d) => sum + d.high + d.medium + d.low, 0)
      const peakHour = data.reduce((max, d, i, arr) => {
        const total = d.high + d.medium + d.low
        const maxTotal = arr[max].high + arr[max].medium + arr[max].low
        return total > maxTotal ? i : max
      }, 0)

      const summaryFontSize = Math.max(10, Math.min(14, rect.width / 50))

      ctx.fillStyle = "#f8fafc" // slate-50
      ctx.font = `bold ${summaryFontSize}px Inter, system-ui, sans-serif`
      ctx.textAlign = "left"
      ctx.textBaseline = "top"
      ctx.fillText(`Total: ${totalEvents} events`, padding.left, padding.top - 15)

      if (rect.width > 400) {
        ctx.fillStyle = "#94a3b8" // slate-400
        ctx.font = `${Math.max(8, summaryFontSize - 2)}px Inter, system-ui, sans-serif`
        ctx.fillText(`Peak: ${peakHour}:00`, padding.left + 150, padding.top - 15)
      }
    }

    // Draw everything
    const draw = () => {
      ctx.clearRect(0, 0, rect.width, rect.height)
      drawAxes()
      drawBars()
      drawLines()
      drawLegend()
    }

    draw()

    // Handle resize
    const handleResize = () => {
      const newRect = canvas.getBoundingClientRect()
      canvas.width = newRect.width * dpr
      canvas.height = newRect.height * dpr
      canvas.style.width = newRect.width + "px"
      canvas.style.height = newRect.height + "px"
      ctx.scale(dpr, dpr)
      draw()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="relative h-[180px] w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
