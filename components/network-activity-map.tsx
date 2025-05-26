"use client"

import { useEffect, useRef } from "react"

export default function NetworkActivityMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const canvas = canvasRef.current
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Draw world map (simplified)
    const drawMap = () => {
      ctx.fillStyle = "#1e293b" // slate-800
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid lines
      ctx.strokeStyle = "#334155" // slate-700
      ctx.lineWidth = 1

      // Horizontal grid lines
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Vertical grid lines
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Draw continents (very simplified)
      ctx.fillStyle = "#334155" // slate-700

      // North America
      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.1, canvas.height * 0.2)
      ctx.lineTo(canvas.width * 0.3, canvas.height * 0.2)
      ctx.lineTo(canvas.width * 0.3, canvas.height * 0.4)
      ctx.lineTo(canvas.width * 0.2, canvas.height * 0.5)
      ctx.lineTo(canvas.width * 0.1, canvas.height * 0.4)
      ctx.closePath()
      ctx.fill()

      // South America
      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.2, canvas.height * 0.5)
      ctx.lineTo(canvas.width * 0.3, canvas.height * 0.5)
      ctx.lineTo(canvas.width * 0.25, canvas.height * 0.8)
      ctx.lineTo(canvas.width * 0.2, canvas.height * 0.7)
      ctx.closePath()
      ctx.fill()

      // Europe
      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.4, canvas.height * 0.2)
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.2)
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.3)
      ctx.lineTo(canvas.width * 0.4, canvas.height * 0.3)
      ctx.closePath()
      ctx.fill()

      // Africa
      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.4, canvas.height * 0.3)
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.3)
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.6)
      ctx.lineTo(canvas.width * 0.4, canvas.height * 0.6)
      ctx.closePath()
      ctx.fill()

      // Asia
      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.5, canvas.height * 0.2)
      ctx.lineTo(canvas.width * 0.8, canvas.height * 0.2)
      ctx.lineTo(canvas.width * 0.8, canvas.height * 0.5)
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.5)
      ctx.closePath()
      ctx.fill()

      // Australia
      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.7, canvas.height * 0.6)
      ctx.lineTo(canvas.width * 0.8, canvas.height * 0.6)
      ctx.lineTo(canvas.width * 0.8, canvas.height * 0.7)
      ctx.lineTo(canvas.width * 0.7, canvas.height * 0.7)
      ctx.closePath()
      ctx.fill()

      // Add country labels
      ctx.fillStyle = "#94a3b8" // slate-400
      ctx.font = "10px Inter, system-ui, sans-serif"
      ctx.textAlign = "center"

      ctx.fillText("USA", canvas.width * 0.2, canvas.height * 0.3)
      ctx.fillText("EU", canvas.width * 0.45, canvas.height * 0.25)
      ctx.fillText("CHINA", canvas.width * 0.65, canvas.height * 0.3)
      ctx.fillText("RUSSIA", canvas.width * 0.6, canvas.height * 0.2)
      ctx.fillText("BRAZIL", canvas.width * 0.25, canvas.height * 0.6)
      ctx.fillText("INDIA", canvas.width * 0.6, canvas.height * 0.4)
      ctx.fillText("AUS", canvas.width * 0.75, canvas.height * 0.65)
    }

    // Draw activity points
    const drawActivityPoints = () => {
      // Define some hotspots - DATOS FICTICIOS
      const hotspots = [
        { x: canvas.width * 0.2, y: canvas.height * 0.3, intensity: 0.8, color: "#ef4444", label: "USA: 128 events" }, // North America (red)
        { x: canvas.width * 0.45, y: canvas.height * 0.25, intensity: 0.7, color: "#f59e0b", label: "EU: 95 events" }, // Europe (amber)
        { x: canvas.width * 0.7, y: canvas.height * 0.3, intensity: 0.9, color: "#ef4444", label: "ASIA: 156 events" }, // Asia (red)
        { x: canvas.width * 0.75, y: canvas.height * 0.65, intensity: 0.5, color: "#22c55e", label: "AUS: 42 events" }, // Australia (green)
        {
          x: canvas.width * 0.45,
          y: canvas.height * 0.45,
          intensity: 0.6,
          color: "#f59e0b",
          label: "AFRICA: 67 events",
        }, // Africa (amber)
        {
          x: canvas.width * 0.25,
          y: canvas.height * 0.6,
          intensity: 0.4,
          color: "#22c55e",
          label: "S.AMERICA: 38 events",
        }, // South America (green)
      ]

      // Draw each hotspot
      hotspots.forEach((spot) => {
        // Draw glow
        const gradient = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, 50 * spot.intensity)
        gradient.addColorStop(0, `${spot.color}80`) // Semi-transparent
        gradient.addColorStop(1, "transparent")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(spot.x, spot.y, 50 * spot.intensity, 0, Math.PI * 2)
        ctx.fill()

        // Draw center point
        ctx.fillStyle = spot.color
        ctx.beginPath()
        ctx.arc(spot.x, spot.y, 3, 0, Math.PI * 2)
        ctx.fill()

        // Draw label with event count
        ctx.fillStyle = spot.color
        ctx.font = "10px Inter, system-ui, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(spot.label, spot.x, spot.y - 15)
      })

      // Draw some connection lines between hotspots
      ctx.strokeStyle = "#06b6d4" // cyan-500
      ctx.lineWidth = 1

      // Function to draw a curved line between two points
      const drawCurvedLine = (x1: number, y1: number, x2: number, y2: number, curvature: number) => {
        const midX = (x1 + x2) / 2
        const midY = (y1 + y2) / 2 - curvature

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.quadraticCurveTo(midX, midY, x2, y2)
        ctx.stroke()
      }

      // Draw some connections
      drawCurvedLine(hotspots[0].x, hotspots[0].y, hotspots[1].x, hotspots[1].y, 50) // North America to Europe
      drawCurvedLine(hotspots[1].x, hotspots[1].y, hotspots[2].x, hotspots[2].y, 40) // Europe to Asia
      drawCurvedLine(hotspots[0].x, hotspots[0].y, hotspots[5].x, hotspots[5].y, -30) // North America to South America
      drawCurvedLine(hotspots[1].x, hotspots[1].y, hotspots[4].x, hotspots[4].y, -20) // Europe to Africa
      drawCurvedLine(hotspots[2].x, hotspots[2].y, hotspots[3].x, hotspots[3].y, -40) // Asia to Australia

      // Add some animated particles along the connections
      const time = Date.now() / 1000
      const drawParticle = (x1: number, y1: number, x2: number, y2: number, curvature: number, offset: number) => {
        const t = (Math.sin(time + offset) + 1) / 2 // Value between 0 and 1

        const midX = (x1 + x2) / 2
        const midY = (y1 + y2) / 2 - curvature

        // Quadratic bezier formula
        const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2
        const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2

        ctx.fillStyle = "#06b6d4" // cyan-500
        ctx.beginPath()
        ctx.arc(px, py, 2, 0, Math.PI * 2)
        ctx.fill()

        // Add glow
        ctx.shadowColor = "#06b6d4"
        ctx.shadowBlur = 5
        ctx.beginPath()
        ctx.arc(px, py, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // Draw particles on connections
      drawParticle(hotspots[0].x, hotspots[0].y, hotspots[1].x, hotspots[1].y, 50, 0)
      drawParticle(hotspots[1].x, hotspots[1].y, hotspots[2].x, hotspots[2].y, 40, 1)
      drawParticle(hotspots[0].x, hotspots[0].y, hotspots[5].x, hotspots[5].y, -30, 2)
      drawParticle(hotspots[1].x, hotspots[1].y, hotspots[4].x, hotspots[4].y, -20, 3)
      drawParticle(hotspots[2].x, hotspots[2].y, hotspots[3].x, hotspots[3].y, -40, 4)

      // Add legend
      ctx.fillStyle = "#f8fafc" // slate-50
      ctx.font = "bold 12px Inter, system-ui, sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Global Security Events", 10, 20)

      ctx.fillStyle = "#94a3b8" // slate-400
      ctx.font = "10px Inter, system-ui, sans-serif"
      ctx.fillText("Total: 526 events in last 24h", 10, 35)

      // Add color legend
      const legendY = canvas.height - 60

      // High risk
      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc(15, legendY, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#94a3b8"
      ctx.textAlign = "left"
      ctx.fillText("High Risk (284)", 25, legendY + 4)

      // Medium risk
      ctx.fillStyle = "#f59e0b"
      ctx.beginPath()
      ctx.arc(15, legendY + 20, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#94a3b8"
      ctx.fillText("Medium Risk (162)", 25, legendY + 24)

      // Low risk
      ctx.fillStyle = "#22c55e"
      ctx.beginPath()
      ctx.arc(15, legendY + 40, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "#94a3b8"
      ctx.fillText("Low Risk (80)", 25, legendY + 44)
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawMap()
      drawActivityPoints()
      requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
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
