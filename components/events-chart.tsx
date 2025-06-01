"use client"

import { useEffect, useRef, useState } from "react"

interface EventsChartProps {
  eventTypeDistribution: Record<string, number>
}

export default function EventsChart({ eventTypeDistribution }: EventsChartProps) {
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

    // Convertir datos reales a formato de gráfica
    const data = [
      { value: eventTypeDistribution.Authentication || 0, color: "#06b6d4", label: "Authentication" },
      { value: eventTypeDistribution.Network || 0, color: "#a855f7", label: "Network" },
      { value: eventTypeDistribution.Malware || 0, color: "#f59e0b", label: "Malware" },
      { value: eventTypeDistribution.Data || 0, color: "#ef4444", label: "Data" },
      { value: eventTypeDistribution.System || 0, color: "#22c55e", label: "System" },
      { value: eventTypeDistribution.Policy || 0, color: "#8b5cf6", label: "Policy" },
    ].filter((item) => item.value > 0) // Solo mostrar categorías con eventos

    const total = data.reduce((sum, item) => sum + item.value, 0)

    if (total === 0) {
      // Mostrar mensaje cuando no hay datos
      ctx.fillStyle = "#94a3b8"
      ctx.font = "14px Inter, system-ui, sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("No hay eventos", dimensions.width / 2, dimensions.height / 2)
      return
    }

    // Calcular responsive sizes
    const centerX = dimensions.width / 2
    const centerY = dimensions.height / 2
    const maxRadius = Math.min(centerX, centerY) - 20
    const radius = Math.max(40, Math.min(maxRadius, 80))
    const innerRadius = radius * 0.55

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
  }, [dimensions, eventTypeDistribution])

  return (
    <div ref={containerRef} className="relative w-full h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px]">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
