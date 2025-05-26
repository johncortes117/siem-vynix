"use client"

import { useEffect, useRef } from "react"

export default function RiskDistributionChart() {
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

    // Data for the chart - DATOS FICTICIOS
    const data = [
      { label: "High", value: 35, color: "#ef4444", count: 184 }, // red-500
      { label: "Medium", value: 45, color: "#f59e0b", count: 237 }, // amber-500
      { label: "Low", value: 20, color: "#22c55e", count: 105 }, // green-500
    ]

    const barHeight = Math.max(25, rect.height / 8)
    const barSpacing = Math.max(15, rect.height / 12)
    const maxBarWidth = rect.width - 120
    const startY = 40

    // Find the maximum value for scaling
    const maxValue = Math.max(...data.map((item) => item.value))

    // Draw bars with improved styling
    data.forEach((item, index) => {
      const y = startY + index * (barHeight + barSpacing)
      const barWidth = (item.value / maxValue) * maxBarWidth

      // Draw label
      ctx.fillStyle = "#94a3b8" // slate-400
      ctx.font = `${Math.max(12, rect.width / 30)}px Inter, system-ui, sans-serif`
      ctx.textAlign = "right"
      ctx.textBaseline = "middle"
      ctx.fillText(item.label, 70, y + barHeight / 2)

      // Draw background bar with rounded corners
      ctx.fillStyle = "#1e293b" // slate-800
      ctx.beginPath()
      ctx.roundRect(80, y, maxBarWidth, barHeight, 4)
      ctx.fill()

      // Draw value bar with gradient and rounded corners
      const gradient = ctx.createLinearGradient(80, y, 80 + barWidth, y + barHeight)
      gradient.addColorStop(0, item.color + "40")
      gradient.addColorStop(0.5, item.color)
      gradient.addColorStop(1, item.color + "CC")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.roundRect(80, y, barWidth, barHeight, 4)
      ctx.fill()

      // Add glow effect
      ctx.shadowColor = item.color
      ctx.shadowBlur = 12
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      ctx.fill()
      ctx.shadowBlur = 0

      // Add subtle border
      ctx.strokeStyle = item.color + "80"
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw percentage with better positioning
      ctx.fillStyle = "#f8fafc" // slate-50
      ctx.font = `bold ${Math.max(12, rect.width / 25)}px Inter, system-ui, sans-serif`
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"

      // Position percentage text better
      const textX = barWidth > 60 ? 90 : 90 + barWidth + 10
      ctx.fillText(`${item.value}%`, textX, y + barHeight / 2)

      // Add event count
      ctx.fillStyle = "#64748b" // slate-500
      ctx.font = `${Math.max(10, rect.width / 35)}px Inter, system-ui, sans-serif`
      ctx.textAlign = "right"
      ctx.fillText(`${item.count} events`, rect.width - 10, y + barHeight / 2)
    })

    // Draw title with better typography
    ctx.fillStyle = "#f8fafc" // slate-50
    ctx.font = `bold ${Math.max(14, rect.width / 20)}px Inter, system-ui, sans-serif`
    ctx.textAlign = "left"
    ctx.textBaseline = "top"
    ctx.fillText("Risk Level Distribution", 0, 10)

    // Draw total count
    const total = data.reduce((sum, item) => sum + item.count, 0)
    ctx.fillStyle = "#94a3b8" // slate-400
    ctx.font = `${Math.max(11, rect.width / 30)}px Inter, system-ui, sans-serif`
    ctx.textAlign = "right"
    ctx.fillText(`Total: ${total} events`, rect.width - 10, 15)
  }, [])

  return (
    <div className="relative h-[180px] w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
