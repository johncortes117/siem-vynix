"use client"

import { useEffect, useRef } from "react"

export default function NetworkActivityMap() {
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

    // Responsive scaling
    const scale = Math.min(rect.width / 800, rect.height / 400)

    // Draw world map (simplified)
    const drawMap = () => {
      // Background with subtle gradient
      const bgGradient = ctx.createLinearGradient(0, 0, rect.width, rect.height)
      bgGradient.addColorStop(0, "#1e293b")
      bgGradient.addColorStop(1, "#0f172a")
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, rect.width, rect.height)

      // Draw grid lines with better spacing
      ctx.strokeStyle = "#334155" // slate-700
      ctx.lineWidth = 0.5
      ctx.globalAlpha = 0.3

      const gridSize = Math.max(20, 40 * scale)

      // Horizontal grid lines
      for (let y = 0; y < rect.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(rect.width, y)
        ctx.stroke()
      }

      // Vertical grid lines
      for (let x = 0; x < rect.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, rect.height)
        ctx.stroke()
      }

      ctx.globalAlpha = 1

      // Draw continents with better proportions
      ctx.fillStyle = "#475569" // slate-600

      // North America
      ctx.beginPath()
      ctx.moveTo(rect.width * 0.1, rect.height * 0.2)
      ctx.lineTo(rect.width * 0.3, rect.height * 0.2)
      ctx.lineTo(rect.width * 0.32, rect.height * 0.35)
      ctx.lineTo(rect.width * 0.28, rect.height * 0.45)
      ctx.lineTo(rect.width * 0.15, rect.height * 0.4)
      ctx.lineTo(rect.width * 0.08, rect.height * 0.3)
      ctx.closePath()
      ctx.fill()

      // South America
      ctx.beginPath()
      ctx.moveTo(rect.width * 0.22, rect.height * 0.5)
      ctx.lineTo(rect.width * 0.3, rect.height * 0.48)
      ctx.lineTo(rect.width * 0.28, rect.height * 0.75)
      ctx.lineTo(rect.width * 0.24, rect.height * 0.8)
      ctx.lineTo(rect.width * 0.2, rect.height * 0.7)
      ctx.closePath()
      ctx.fill()

      // Europe
      ctx.beginPath()
      ctx.moveTo(rect.width * 0.42, rect.height * 0.18)
      ctx.lineTo(rect.width * 0.52, rect.height * 0.2)
      ctx.lineTo(rect.width * 0.5, rect.height * 0.32)
      ctx.lineTo(rect.width * 0.4, rect.height * 0.3)
      ctx.closePath()
      ctx.fill()

      // Africa
      ctx.beginPath()
      ctx.moveTo(rect.width * 0.42, rect.height * 0.32)
      ctx.lineTo(rect.width * 0.52, rect.height * 0.32)
      ctx.lineTo(rect.width * 0.5, rect.height * 0.65)
      ctx.lineTo(rect.width * 0.44, rect.height * 0.68)
      ctx.lineTo(rect.width * 0.4, rect.height * 0.6)
      ctx.closePath()
      ctx.fill()

      // Asia
      ctx.beginPath()
      ctx.moveTo(rect.width * 0.52, rect.height * 0.15)
      ctx.lineTo(rect.width * 0.85, rect.height * 0.18)
      ctx.lineTo(rect.width * 0.82, rect.height * 0.5)
      ctx.lineTo(rect.width * 0.5, rect.height * 0.48)
      ctx.closePath()
      ctx.fill()

      // Australia
      ctx.beginPath()
      ctx.moveTo(rect.width * 0.72, rect.height * 0.65)
      ctx.lineTo(rect.width * 0.82, rect.height * 0.63)
      ctx.lineTo(rect.width * 0.8, rect.height * 0.75)
      ctx.lineTo(rect.width * 0.7, rect.height * 0.73)
      ctx.closePath()
      ctx.fill()
    }

    // Draw activity points
    const drawActivityPoints = () => {
      // Define some hotspots - DATOS FICTICIOS
      const hotspots = [
        { x: rect.width * 0.2, y: rect.height * 0.3, intensity: 0.8, color: "#ef4444", label: "USA", count: 128 },
        { x: rect.width * 0.46, y: rect.height * 0.25, intensity: 0.7, color: "#f59e0b", label: "EU", count: 95 },
        { x: rect.width * 0.7, y: rect.height * 0.3, intensity: 0.9, color: "#ef4444", label: "ASIA", count: 156 },
        { x: rect.width * 0.76, y: rect.height * 0.69, intensity: 0.5, color: "#22c55e", label: "AUS", count: 42 },
        { x: rect.width * 0.46, y: rect.height * 0.5, intensity: 0.6, color: "#f59e0b", label: "AFR", count: 67 },
        { x: rect.width * 0.25, y: rect.height * 0.62, intensity: 0.4, color: "#22c55e", label: "SA", count: 38 },
      ]

      // Draw each hotspot with improved styling
      hotspots.forEach((spot) => {
        const baseRadius = Math.max(30, 60 * scale)
        const glowRadius = baseRadius * spot.intensity

        // Draw multiple glow layers for better effect
        for (let i = 3; i >= 1; i--) {
          const gradient = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, (glowRadius * i) / 3)
          gradient.addColorStop(0, spot.color + Math.floor(80 / i).toString(16))
          gradient.addColorStop(1, "transparent")

          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(spot.x, spot.y, (glowRadius * i) / 3, 0, Math.PI * 2)
          ctx.fill()
        }

        // Draw center point with pulse effect
        const time = Date.now() / 1000
        const pulseSize = 3 + Math.sin(time * 2 + spot.x) * 1.5

        ctx.fillStyle = spot.color
        ctx.beginPath()
        ctx.arc(spot.x, spot.y, pulseSize, 0, Math.PI * 2)
        ctx.fill()

        // Add white center dot
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.arc(spot.x, spot.y, 1, 0, Math.PI * 2)
        ctx.fill()

        // Draw label with event count (responsive font size)
        const fontSize = Math.max(8, 12 * scale)
        ctx.fillStyle = spot.color
        ctx.font = `bold ${fontSize}px Inter, system-ui, sans-serif`
        ctx.textAlign = "center"
        ctx.textBaseline = "bottom"

        // Add text background for better readability
        const textY = spot.y - glowRadius - 5
        ctx.shadowColor = "#000000"
        ctx.shadowBlur = 3
        ctx.fillText(`${spot.label}: ${spot.count}`, spot.x, textY)
        ctx.shadowBlur = 0
      })

      // Draw connection lines with animation
      ctx.strokeStyle = "#06b6d4" // cyan-500
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

      // Draw connections
      drawCurvedLine(hotspots[0].x, hotspots[0].y, hotspots[1].x, hotspots[1].y, 50 * scale)
      drawCurvedLine(hotspots[1].x, hotspots[1].y, hotspots[2].x, hotspots[2].y, 40 * scale)
      drawCurvedLine(hotspots[0].x, hotspots[0].y, hotspots[5].x, hotspots[5].y, -30 * scale)
      drawCurvedLine(hotspots[1].x, hotspots[1].y, hotspots[4].x, hotspots[4].y, -20 * scale)
      drawCurvedLine(hotspots[2].x, hotspots[2].y, hotspots[3].x, hotspots[3].y, -40 * scale)

      ctx.globalAlpha = 1

      // Add animated particles
      const time = Date.now() / 1000
      const drawParticle = (x1: number, y1: number, x2: number, y2: number, curvature: number, offset: number) => {
        const t = (Math.sin(time + offset) + 1) / 2

        const midX = (x1 + x2) / 2
        const midY = (y1 + y2) / 2 - curvature

        const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2
        const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2

        ctx.fillStyle = "#06b6d4"
        ctx.shadowColor = "#06b6d4"
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(px, py, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // Draw particles on connections
      drawParticle(hotspots[0].x, hotspots[0].y, hotspots[1].x, hotspots[1].y, 50 * scale, 0)
      drawParticle(hotspots[1].x, hotspots[1].y, hotspots[2].x, hotspots[2].y, 40 * scale, 1)
      drawParticle(hotspots[0].x, hotspots[0].y, hotspots[5].x, hotspots[5].y, -30 * scale, 2)

      // Add legend with responsive positioning
      const legendFontSize = Math.max(10, 14 * scale)
      const legendX = Math.max(10, 15 * scale)
      const legendY = Math.max(15, 25 * scale)

      ctx.fillStyle = "#f8fafc"
      ctx.font = `bold ${legendFontSize}px Inter, system-ui, sans-serif`
      ctx.textAlign = "left"
      ctx.textBaseline = "top"
      ctx.fillText("Global Security Events", legendX, legendY)

      ctx.fillStyle = "#94a3b8"
      ctx.font = `${Math.max(8, 12 * scale)}px Inter, system-ui, sans-serif`
      ctx.fillText("Total: 526 events in last 24h", legendX, legendY + 20)

      // Add color legend (responsive positioning)
      const legendBottomY = rect.height - Math.max(60, 80 * scale)

      const legendItems = [
        { color: "#ef4444", label: "High Risk (284)", y: 0 },
        { color: "#f59e0b", label: "Medium Risk (162)", y: 18 },
        { color: "#22c55e", label: "Low Risk (80)", y: 36 },
      ]

      legendItems.forEach((item) => {
        ctx.fillStyle = item.color
        ctx.beginPath()
        ctx.arc(legendX + 8, legendBottomY + item.y + 8, 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#94a3b8"
        ctx.font = `${Math.max(8, 11 * scale)}px Inter, system-ui, sans-serif`
        ctx.textAlign = "left"
        ctx.fillText(item.label, legendX + 20, legendBottomY + item.y + 12)
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, rect.width, rect.height)
      drawMap()
      drawActivityPoints()
      requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      const newRect = canvas.getBoundingClientRect()
      canvas.width = newRect.width * dpr
      canvas.height = newRect.height * dpr
      canvas.style.width = newRect.width + "px"
      canvas.style.height = newRect.height + "px"
      ctx.scale(dpr, dpr)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
