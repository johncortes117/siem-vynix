"use client"

import { useEffect, useRef } from "react"

export default function TimelineChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const canvas = canvasRef.current
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Chart dimensions
    const padding = { top: 20, right: 20, bottom: 30, left: 40 }
    const chartWidth = canvas.width - padding.left - padding.right
    const chartHeight = canvas.height - padding.top - padding.bottom

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
      ctx.moveTo(padding.left, canvas.height - padding.bottom)
      ctx.lineTo(canvas.width - padding.right, canvas.height - padding.bottom)
      ctx.stroke()

      // Y-axis
      ctx.beginPath()
      ctx.moveTo(padding.left, padding.top)
      ctx.lineTo(padding.left, canvas.height - padding.bottom)
      ctx.stroke()

      // X-axis labels (hours)
      ctx.fillStyle = "#94a3b8" // slate-400
      ctx.font = "10px Inter, system-ui, sans-serif"
      ctx.textAlign = "center"

      const hourStep = Math.ceil(hours / 12) // Show fewer labels if many hours
      for (let i = 0; i < hours; i += hourStep) {
        const x = padding.left + (i / (hours - 1)) * chartWidth
        ctx.fillText(`${i}h`, x, canvas.height - padding.bottom + 15)
      }

      // Y-axis labels
      ctx.textAlign = "right"
      for (let i = 0; i <= 5; i++) {
        const y = canvas.height - padding.bottom - (i / 5) * chartHeight
        ctx.fillText(`${Math.round((i / 5) * maxValue)}`, padding.left - 5, y + 3)
      }

      // Grid lines
      ctx.strokeStyle = "#334155" // slate-700
      ctx.setLineDash([2, 2])

      // Horizontal grid lines
      for (let i = 1; i <= 5; i++) {
        const y = canvas.height - padding.bottom - (i / 5) * chartHeight
        ctx.beginPath()
        ctx.moveTo(padding.left, y)
        ctx.lineTo(canvas.width - padding.right, y)
        ctx.stroke()
      }

      ctx.setLineDash([])
    }

    // Draw stacked bar chart
    const drawBars = () => {
      const barWidth = (chartWidth / hours) * 0.8
      const barSpacing = (chartWidth / hours) * 0.2

      data.forEach((d, i) => {
        const x = padding.left + i * (chartWidth / (hours - 1)) - barWidth / 2
        let y = canvas.height - padding.bottom

        // Low risk (green)
        const lowHeight = (d.low / maxValue) * chartHeight
        ctx.fillStyle = "#22c55e" // green-500
        ctx.fillRect(x, y - lowHeight, barWidth, lowHeight)
        y -= lowHeight

        // Medium risk (amber)
        const mediumHeight = (d.medium / maxValue) * chartHeight
        ctx.fillStyle = "#f59e0b" // amber-500
        ctx.fillRect(x, y - mediumHeight, barWidth, mediumHeight)
        y -= mediumHeight

        // High risk (red)
        const highHeight = (d.high / maxValue) * chartHeight
        ctx.fillStyle = "#ef4444" // red-500
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

      // Draw line
      ctx.strokeStyle = "#06b6d4" // cyan-500
      ctx.lineWidth = 2
      ctx.beginPath()

      totals.forEach((total, i) => {
        const x = padding.left + i * (chartWidth / (hours - 1))
        const y = canvas.height - padding.bottom - (total / maxValue) * chartHeight

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

      // Draw points
      totals.forEach((total, i) => {
        const x = padding.left + i * (chartWidth / (hours - 1))
        const y = canvas.height - padding.bottom - (total / maxValue) * chartHeight

        ctx.fillStyle = "#06b6d4" // cyan-500
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()

        // Add glow to points
        ctx.shadowColor = "#06b6d4"
        ctx.shadowBlur = 5
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })
    }

    // Draw legend
    const drawLegend = () => {
      const legendItems = [
        { label: "High Risk", color: "#ef4444" },
        { label: "Medium Risk", color: "#f59e0b" },
        { label: "Low Risk", color: "#22c55e" },
        { label: "Total Events", color: "#06b6d4" },
      ]

      const legendX = canvas.width - padding.right - 120
      const legendY = padding.top + 10

      legendItems.forEach((item, i) => {
        const y = legendY + i * 20

        // Draw color box
        ctx.fillStyle = item.color
        ctx.fillRect(legendX, y, 12, 12)

        // Draw label
        ctx.fillStyle = "#94a3b8" // slate-400
        ctx.font = "12px Inter, system-ui, sans-serif"
        ctx.textAlign = "left"
        ctx.fillText(item.label, legendX + 20, y + 10)
      })

      // Add total count
      const totalEvents = data.reduce((sum, d) => sum + d.high + d.medium + d.low, 0)
      ctx.fillStyle = "#f8fafc" // slate-50
      ctx.font = "bold 12px Inter, system-ui, sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`Total: ${totalEvents} events`, padding.left, padding.top - 5)

      // Add peak time
      const peakHour = data.reduce((max, d, i, arr) => {
        const total = d.high + d.medium + d.low
        const maxTotal = arr[max].high + arr[max].medium + arr[max].low
        return total > maxTotal ? i : max
      }, 0)

      ctx.fillStyle = "#94a3b8" // slate-400
      ctx.font = "12px Inter, system-ui, sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`Peak activity: ${peakHour}:00`, padding.left, padding.top + 15)
    }

    // Draw everything
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawAxes()
      drawBars()
      drawLines()
      drawLegend()
    }

    draw()

    // Handle resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
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
