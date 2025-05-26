"use client"

import { useEffect, useRef } from "react"

export default function EventsChart() {
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

    // Draw donut chart
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const radius = Math.min(centerX, centerY) - 20
    const innerRadius = radius * 0.55

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

    // Draw segments with improved styling
    let startAngle = -0.5 * Math.PI // Start at the top

    data.forEach((segment, index) => {
      const segmentAngle = (segment.value / total) * 2 * Math.PI

      // Draw main segment
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + segmentAngle)
      ctx.arc(centerX, centerY, innerRadius, startAngle + segmentAngle, startAngle, true)
      ctx.closePath()

      // Create gradient for each segment
      const gradient = ctx.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, radius)
      gradient.addColorStop(0, segment.color + "40")
      gradient.addColorStop(0.7, segment.color)
      gradient.addColorStop(1, segment.color + "CC")

      ctx.fillStyle = gradient
      ctx.fill()

      // Add subtle border
      ctx.strokeStyle = "#1e293b"
      ctx.lineWidth = 2
      ctx.stroke()

      // Add glow effect
      ctx.shadowColor = segment.color
      ctx.shadowBlur = 15
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      ctx.fill()
      ctx.shadowBlur = 0

      startAngle += segmentAngle
    })

    // Draw center circle with gradient
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, innerRadius)
    centerGradient.addColorStop(0, "#0f172a")
    centerGradient.addColorStop(1, "#020617")

    ctx.beginPath()
    ctx.arc(centerX, centerY, innerRadius - 2, 0, 2 * Math.PI)
    ctx.fillStyle = centerGradient
    ctx.fill()

    // Add border to center circle
    ctx.strokeStyle = "#334155"
    ctx.lineWidth = 1
    ctx.stroke()

    // Add labels in the center with better typography
    ctx.fillStyle = "#f8fafc" // slate-50
    ctx.font = `bold ${Math.max(16, radius / 8)}px Inter, system-ui, sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`${total}`, centerX, centerY - 8)

    ctx.fillStyle = "#94a3b8" // slate-400
    ctx.font = `${Math.max(10, radius / 12)}px Inter, system-ui, sans-serif`
    ctx.fillText("Total Events", centerX, centerY + 12)

    // Add percentage labels on segments for larger screens
    if (radius > 60) {
      startAngle = -0.5 * Math.PI
      data.forEach((segment) => {
        const segmentAngle = (segment.value / total) * 2 * Math.PI
        const midAngle = startAngle + segmentAngle / 2
        const labelRadius = (radius + innerRadius) / 2

        const x = centerX + Math.cos(midAngle) * labelRadius
        const y = centerY + Math.sin(midAngle) * labelRadius

        ctx.fillStyle = "#ffffff"
        ctx.font = `bold ${Math.max(10, radius / 15)}px Inter, system-ui, sans-serif`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        // Add text shadow for better readability
        ctx.shadowColor = "#000000"
        ctx.shadowBlur = 3
        ctx.fillText(`${segment.value}%`, x, y)
        ctx.shadowBlur = 0

        startAngle += segmentAngle
      })
    }
  }, [])

  return (
    <div className="relative h-[180px] w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
