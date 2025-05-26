"use client"

import { useEffect, useRef, useState } from "react"

export default function EventsChart() {
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

    // Set actual canvas size
    canvas.width = dimensions.width * dpr
    canvas.height = dimensions.height * dpr
    canvas.style.width = dimensions.width + "px"
    canvas.style.height = dimensions.height + "px"

    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height)

    // Calculate responsive sizes
    const centerX = dimensions.width / 2
    const centerY = dimensions.height / 2
    const maxRadius = Math.min(centerX, centerY) - 20
    const radius = Math.max(40, Math.min(maxRadius, 80)) // Min 40px, max 80px
    const innerRadius = radius * 0.55

    // Data for the chart
    const data = [
      { value: 32, color: "#06b6d4", label: "Authentication" },
      { value: 28, color: "#a855f7", label: "Network" },
      { value: 18, color: "#f59e0b", label: "Malware" },
      { value: 12, color: "#ef4444", label: "Data" },
      { value: 10, color: "#22c55e", label: "System" },
    ]

    const total = data.reduce((sum, item) => sum + item.value, 0)

    // Draw segments
    let startAngle = -0.5 * Math.PI

    data.forEach((segment) => {
      const segmentAngle = (segment.value / total) * 2 * Math.PI

      // Draw main segment
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + segmentAngle)
      ctx.arc(centerX, centerY, innerRadius, startAngle + segmentAngle, startAngle, true)
      ctx.closePath()

      // Create gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, innerRadius, centerX, centerY, radius)
      gradient.addColorStop(0, segment.color + "40")
      gradient.addColorStop(0.7, segment.color)
      gradient.addColorStop(1, segment.color + "CC")

      ctx.fillStyle = gradient
      ctx.fill()

      // Add border
      ctx.strokeStyle = "#1e293b"
      ctx.lineWidth = 1
      ctx.stroke()

      startAngle += segmentAngle
    })

    // Draw center circle
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, innerRadius)
    centerGradient.addColorStop(0, "#0f172a")
    centerGradient.addColorStop(1, "#020617")

    ctx.beginPath()
    ctx.arc(centerX, centerY, innerRadius - 2, 0, 2 * Math.PI)
    ctx.fillStyle = centerGradient
    ctx.fill()

    ctx.strokeStyle = "#334155"
    ctx.lineWidth = 1
    ctx.stroke()

    // Add center text with responsive font size
    const fontSize = Math.max(12, Math.min(radius / 4, 18))
    ctx.fillStyle = "#f8fafc"
    ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`${total}`, centerX, centerY - 4)

    const smallFontSize = Math.max(8, Math.min(radius / 6, 12))
    ctx.fillStyle = "#94a3b8"
    ctx.font = `${smallFontSize}px Inter, system-ui, sans-serif`
    ctx.fillText("Total Events", centerX, centerY + fontSize / 2 + 2)
  }, [dimensions])

  return (
    <div ref={containerRef} className="relative w-full h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px]">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
