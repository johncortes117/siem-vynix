"use client"

import { useEffect, useRef } from "react"

export default function RiskDistributionChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const canvas = canvasRef.current
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Data for the chart - DATOS FICTICIOS
    const data = [
      { label: "High", value: 35, color: "#ef4444" }, // red-500
      { label: "Medium", value: 45, color: "#f59e0b" }, // amber-500
      { label: "Low", value: 20, color: "#22c55e" }, // green-500
    ]

    const barHeight = 30
    const barSpacing = 20
    const maxBarWidth = canvas.width - 100
    const startY = 40

    // Find the maximum value for scaling
    const maxValue = Math.max(...data.map((item) => item.value))

    // Draw bars
    data.forEach((item, index) => {
      const y = startY + index * (barHeight + barSpacing)
      const barWidth = (item.value / maxValue) * maxBarWidth

      // Draw label
      ctx.fillStyle = "#94a3b8" // slate-400
      ctx.font = "14px Inter, system-ui, sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(item.label, 60, y + barHeight / 2 + 5)

      // Draw background bar
      ctx.fillStyle = "#1e293b" // slate-800
      ctx.fillRect(70, y, maxBarWidth, barHeight)

      // Draw value bar with gradient
      const gradient = ctx.createLinearGradient(70, 0, 70 + barWidth, 0)
      gradient.addColorStop(0, item.color)
      gradient.addColorStop(1, `${item.color}80`) // Add alpha for gradient

      ctx.fillStyle = gradient
      ctx.fillRect(70, y, barWidth, barHeight)

      // Add glow effect
      ctx.shadowColor = item.color
      ctx.shadowBlur = 8
      ctx.fillRect(70, y, barWidth, barHeight)
      ctx.shadowBlur = 0

      // Draw percentage
      ctx.fillStyle = "#f8fafc" // slate-50
      ctx.font = "bold 14px Inter, system-ui, sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`${item.value}%`, 80 + barWidth, y + barHeight / 2 + 5)

      // Draw value label inside bar if there's enough space
      if (barWidth > 50) {
        ctx.fillStyle = "#f8fafc" // slate-50
        ctx.font = "bold 14px Inter, system-ui, sans-serif"
        ctx.textAlign = "left"
        ctx.fillText(`${item.value}%`, 80, y + barHeight / 2 + 5)
      }
    })

    // Draw title
    ctx.fillStyle = "#f8fafc" // slate-50
    ctx.font = "bold 16px Inter, system-ui, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("Risk Level Distribution", 0, 20)

    // Draw total count
    const total = data.reduce((sum, item) => sum + item.value, 0)
    ctx.fillStyle = "#94a3b8" // slate-400
    ctx.font = "14px Inter, system-ui, sans-serif"
    ctx.textAlign = "right"
    ctx.fillText(`Total: ${total}%`, canvas.width - 10, 20)
  }, [])

  return (
    <div className="relative h-[180px] w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
