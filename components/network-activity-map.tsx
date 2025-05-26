"use client"

import { useEffect, useRef, useState } from "react"

export default function NetworkActivityMap() {
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

    let animationId: number

    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1

    canvas.width = dimensions.width * dpr
    canvas.height = dimensions.height * dpr
    canvas.style.width = dimensions.width + "px"
    canvas.style.height = dimensions.height + "px"

    ctx.scale(dpr, dpr)

    // Responsive scaling
    const isMobile = dimensions.width < 500
    const scale = Math.min(dimensions.width / 600, dimensions.height / 300)

    const drawMap = () => {
      // Background
      const bgGradient = ctx.createLinearGradient(0, 0, dimensions.width, dimensions.height)
      bgGradient.addColorStop(0, "#1e293b")
      bgGradient.addColorStop(1, "#0f172a")
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      // Grid lines
      ctx.strokeStyle = "#334155"
      ctx.lineWidth = 0.5
      ctx.globalAlpha = 0.3

      const gridSize = Math.max(15, 30 * scale)
      for (let y = 0; y < dimensions.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(dimensions.width, y)
        ctx.stroke()
      }

      for (let x = 0; x < dimensions.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, dimensions.height)
        ctx.stroke()
      }

      ctx.globalAlpha = 1

      // Draw simplified continents
      ctx.fillStyle = "#475569"

      // North America
      ctx.beginPath()
      ctx.moveTo(dimensions.width * 0.1, dimensions.height * 0.2)
      ctx.lineTo(dimensions.width * 0.3, dimensions.height * 0.2)
      ctx.lineTo(dimensions.width * 0.32, dimensions.height * 0.35)
      ctx.lineTo(dimensions.width * 0.28, dimensions.height * 0.45)
      ctx.lineTo(dimensions.width * 0.15, dimensions.height * 0.4)
      ctx.closePath()
      ctx.fill()

      // Europe
      ctx.beginPath()
      ctx.moveTo(dimensions.width * 0.42, dimensions.height * 0.18)
      ctx.lineTo(dimensions.width * 0.52, dimensions.height * 0.2)
      ctx.lineTo(dimensions.width * 0.5, dimensions.height * 0.32)
      ctx.lineTo(dimensions.width * 0.4, dimensions.height * 0.3)
      ctx.closePath()
      ctx.fill()

      // Asia
      ctx.beginPath()
      ctx.moveTo(dimensions.width * 0.52, dimensions.height * 0.15)
      ctx.lineTo(dimensions.width * 0.85, dimensions.height * 0.18)
      ctx.lineTo(dimensions.width * 0.82, dimensions.height * 0.5)
      ctx.lineTo(dimensions.width * 0.5, dimensions.height * 0.48)
      ctx.closePath()
      ctx.fill()

      // Other continents (simplified for mobile)
      if (!isMobile) {
        // South America
        ctx.beginPath()
        ctx.moveTo(dimensions.width * 0.22, dimensions.height * 0.5)
        ctx.lineTo(dimensions.width * 0.3, dimensions.height * 0.48)
        ctx.lineTo(dimensions.width * 0.28, dimensions.height * 0.75)
        ctx.lineTo(dimensions.width * 0.2, dimensions.height * 0.7)
        ctx.closePath()
        ctx.fill()

        // Africa
        ctx.beginPath()
        ctx.moveTo(dimensions.width * 0.42, dimensions.height * 0.32)
        ctx.lineTo(dimensions.width * 0.52, dimensions.height * 0.32)
        ctx.lineTo(dimensions.width * 0.5, dimensions.height * 0.65)
        ctx.lineTo(dimensions.width * 0.4, dimensions.height * 0.6)
        ctx.closePath()
        ctx.fill()

        // Australia
        ctx.beginPath()
        ctx.moveTo(dimensions.width * 0.72, dimensions.height * 0.65)
        ctx.lineTo(dimensions.width * 0.82, dimensions.height * 0.63)
        ctx.lineTo(dimensions.width * 0.8, dimensions.height * 0.75)
        ctx.lineTo(dimensions.width * 0.7, dimensions.height * 0.73)
        ctx.closePath()
        ctx.fill()
      }
    }

    const drawActivityPoints = () => {
      // Hotspots (fewer for mobile)
      const hotspots = isMobile
        ? [
            {
              x: dimensions.width * 0.2,
              y: dimensions.height * 0.3,
              intensity: 0.8,
              color: "#ef4444",
              label: "USA",
              count: 128,
            },
            {
              x: dimensions.width * 0.46,
              y: dimensions.height * 0.25,
              intensity: 0.7,
              color: "#f59e0b",
              label: "EU",
              count: 95,
            },
            {
              x: dimensions.width * 0.7,
              y: dimensions.height * 0.3,
              intensity: 0.9,
              color: "#ef4444",
              label: "ASIA",
              count: 156,
            },
          ]
        : [
            {
              x: dimensions.width * 0.2,
              y: dimensions.height * 0.3,
              intensity: 0.8,
              color: "#ef4444",
              label: "USA",
              count: 128,
            },
            {
              x: dimensions.width * 0.46,
              y: dimensions.height * 0.25,
              intensity: 0.7,
              color: "#f59e0b",
              label: "EU",
              count: 95,
            },
            {
              x: dimensions.width * 0.7,
              y: dimensions.height * 0.3,
              intensity: 0.9,
              color: "#ef4444",
              label: "ASIA",
              count: 156,
            },
            {
              x: dimensions.width * 0.76,
              y: dimensions.height * 0.69,
              intensity: 0.5,
              color: "#22c55e",
              label: "AUS",
              count: 42,
            },
            {
              x: dimensions.width * 0.46,
              y: dimensions.height * 0.5,
              intensity: 0.6,
              color: "#f59e0b",
              label: "AFR",
              count: 67,
            },
            {
              x: dimensions.width * 0.25,
              y: dimensions.height * 0.62,
              intensity: 0.4,
              color: "#22c55e",
              label: "SA",
              count: 38,
            },
          ]

      // Draw hotspots
      hotspots.forEach((spot) => {
        const baseRadius = Math.max(20, 40 * scale)
        const glowRadius = baseRadius * spot.intensity

        // Glow effect
        const gradient = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, glowRadius)
        gradient.addColorStop(0, spot.color + "80")
        gradient.addColorStop(1, "transparent")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(spot.x, spot.y, glowRadius, 0, Math.PI * 2)
        ctx.fill()

        // Center point with pulse
        const time = Date.now() / 1000
        const pulseSize = 2 + Math.sin(time * 2 + spot.x) * 1

        ctx.fillStyle = spot.color
        ctx.beginPath()
        ctx.arc(spot.x, spot.y, pulseSize, 0, Math.PI * 2)
        ctx.fill()

        // Labels (responsive font size)
        const fontSize = Math.max(6, Math.min(10, 12 * scale))
        ctx.fillStyle = spot.color
        ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`
        ctx.textAlign = "center"
        ctx.textBaseline = "bottom"

        const labelText = isMobile ? `${spot.label}` : `${spot.label}: ${spot.count}`
        ctx.shadowColor = "#000000"
        ctx.shadowBlur = 2
        ctx.fillText(labelText, spot.x, spot.y - glowRadius - 3)
        ctx.shadowBlur = 0
      })

      // Connection lines (simplified for mobile)
      if (!isMobile && hotspots.length > 3) {
        ctx.strokeStyle = "#06b6d4"
        ctx.lineWidth = 1
        ctx.globalAlpha = 0.6

        const drawCurvedLine = (x1: number, y1: number, x2: number, y2: number, curvature: number) => {
          const midX = (x1 + x2) / 2
          const midY = (y1 + y2) / 2 - curvature

          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.quadraticCurveTo(midX, midY, x2, y2)
          ctx.stroke()
        }

        drawCurvedLine(hotspots[0].x, hotspots[0].y, hotspots[1].x, hotspots[1].y, 30 * scale)
        drawCurvedLine(hotspots[1].x, hotspots[1].y, hotspots[2].x, hotspots[2].y, 25 * scale)

        ctx.globalAlpha = 1
      }

      // Legend
      const legendFontSize = Math.max(8, Math.min(12, 14 * scale))
      const legendX = Math.max(8, 15 * scale)
      const legendY = Math.max(12, 20 * scale)

      ctx.fillStyle = "#f8fafc"
      ctx.font = `bold ${legendFontSize}px Inter, system-ui, sans-serif`
      ctx.textAlign = "left"
      ctx.textBaseline = "top"
      ctx.fillText(isMobile ? "Global Events" : "Global Security Events", legendX, legendY)

      if (!isMobile) {
        ctx.fillStyle = "#94a3b8"
        ctx.font = `${Math.max(6, legendFontSize - 2)}px Inter, system-ui, sans-serif`
        ctx.fillText("Total: 526 events in last 24h", legendX, legendY + 16)
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)
      drawMap()
      drawActivityPoints()
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [dimensions])

  return (
    <div ref={containerRef} className="relative w-full h-[200px] sm:h-[250px] md:h-[280px] lg:h-[300px]">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
