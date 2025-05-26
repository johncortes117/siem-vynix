"use client"

import { useEffect, useRef } from "react"

export default function EventsChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const canvas = canvasRef.current
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Draw donut chart
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10
    const innerRadius = radius * 0.6

    // Data for the chart - DATOS FICTICIOS
    const data = [
      { value: 32, color: "#06b6d4", label: "Authentication" }, // cyan-500
      { value: 28, color: "#a855f7", label: "Network" }, // purple-500
      { value: 18, color: "#f59e0b", label: "Malware" }, // amber-500
      { value: 12, color: "#ef4444", label: "Data" }, // red-500
      { value: 10, color: "#22c55e", label: "System" }, // green-500
    ]

    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0)

    // Draw segments
    let startAngle = -0.5 * Math.PI // Start at the top

    data.forEach((segment) => {
      const segmentAngle = (segment.value / total) * 2 * Math.PI

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + segmentAngle)
      ctx.arc(centerX, centerY, innerRadius, startAngle + segmentAngle, startAngle, true)
      ctx.closePath()

      ctx.fillStyle = segment.color
      ctx.fill()

      startAngle += segmentAngle
    })

    // Draw center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, innerRadius - 1, 0, 2 * Math.PI)
    ctx.fillStyle = "#020617" // slate-950
    ctx.fill()

    // Add glow effect
    data.forEach((segment) => {
      const segmentAngle = (segment.value / total) * 2 * Math.PI

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + segmentAngle)
      ctx.arc(centerX, centerY, innerRadius, startAngle + segmentAngle, startAngle, true)
      ctx.closePath()

      const gradient = ctx.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, radius)
      gradient.addColorStop(0, "transparent")
      gradient.addColorStop(0.8, "transparent")
      gradient.addColorStop(1, `${segment.color}40`) // Add alpha for glow

      ctx.fillStyle = gradient
      ctx.fill()

      startAngle += segmentAngle
    })

    // Add labels in the center
    ctx.fillStyle = "#f8fafc" // slate-50
    ctx.font = "bold 16px Inter, system-ui, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(`${total}`, centerX, centerY - 5)

    ctx.fillStyle = "#94a3b8" // slate-400
    ctx.font = "12px Inter, system-ui, sans-serif"
    ctx.fillText("Total Events", centerX, centerY + 15)
  }, [])

  return (
    <div className="relative h-[180px] w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
