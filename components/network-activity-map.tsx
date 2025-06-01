"use client"

import { useEffect, useRef, useState } from "react"

interface NetworkActivityMapProps {
  networkActivityData: Array<{
    name: string
    coords: [number, number]
    events: number
    risk: string
    color: string
    description: string
  }>
}

export default function NetworkActivityMap({ networkActivityData }: NetworkActivityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (mapRef.current) {
        const rect = mapRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window === "undefined") return

      // Cargar CSS de Leaflet
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

      // Cargar JavaScript de Leaflet
      if (!window.L) {
        const script = document.createElement("script")
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        script.onload = () => initializeMap()
        document.head.appendChild(script)
      } else {
        initializeMap()
      }
    }

    const initializeMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return

      const L = window.L

      // Crear el mapa centrado en Ecuador
      const map = L.map(mapRef.current, {
        center: [-1.8312, -78.1834], // Coordenadas de Ecuador
        zoom: 6,
        zoomControl: true,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        dragging: true,
        attributionControl: false,
      })

      // Agregar capa de mapa oscuro
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map)

      // Usar datos reales pasados como props
      networkActivityData.forEach((hotspot, index) => {
        // Crear icono personalizado con pulso
        const pulsingIcon = L.divIcon({
          className: "pulsing-marker",
          html: `
            <div class="pulse-container" style="--pulse-color: ${hotspot.color}">
              <div class="pulse-dot"></div>
              <div class="pulse-ring"></div>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })

        // Agregar marcador
        const marker = L.marker(hotspot.coords, { icon: pulsingIcon }).addTo(map)

        // Popup con información de seguridad
        const popupContent = `
          <div style="color: #1e293b; font-family: Inter, sans-serif; min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: ${hotspot.color}; font-size: 16px; font-weight: bold;">
              ${hotspot.name}
            </h3>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b;">
              ${hotspot.description}
            </p>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 12px; color: #475569;">Eventos:</span>
              <span style="font-size: 12px; font-weight: bold; color: ${hotspot.color};">
                ${hotspot.events}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 12px; color: #475569;">Nivel de Riesgo:</span>
              <span style="font-size: 12px; font-weight: bold; color: ${hotspot.color}; text-transform: capitalize;">
                ${hotspot.risk === "high" ? "Alto" : hotspot.risk === "medium" ? "Medio" : "Bajo"}
              </span>
            </div>
          </div>
        `

        marker.bindPopup(popupContent, {
          closeButton: true,
          autoClose: false,
          className: "custom-popup",
        })

        // Abrir popup automáticamente para las ciudades principales
        if (index < 2) {
          setTimeout(
            () => {
              marker.openPopup()
            },
            1000 + index * 500,
          )
        }
      })

      // Agregar círculos de actividad basados en datos reales
      networkActivityData.forEach((hotspot) => {
        const radius = Math.max(1000, hotspot.events * 500) // Radio basado en número real de eventos

        L.circle(hotspot.coords, {
          color: hotspot.color,
          fillColor: hotspot.color,
          fillOpacity: 0.1,
          radius: radius,
          weight: 1,
        }).addTo(map)
      })

      // Agregar leyenda personalizada con datos reales
      const legend = L.control({ position: "bottomright" })
      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "legend")
        div.style.cssText = `
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(8px);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #334155;
          color: #f8fafc;
          font-family: Inter, sans-serif;
          font-size: 12px;
          min-width: 160px;
        `

        const totalEvents = networkActivityData.reduce((sum, h) => sum + h.events, 0)

        div.innerHTML = `
          <div style="font-weight: bold; margin-bottom: 8px; color: #06b6d4;">
            Eventos de Seguridad
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <div style="width: 12px; height: 12px; background: #ef4444; border-radius: 50%; margin-right: 8px;"></div>
            <span>Alto Riesgo</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <div style="width: 12px; height: 12px; background: #f59e0b; border-radius: 50%; margin-right: 8px;"></div>
            <span>Medio Riesgo</span>
          </div>
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <div style="width: 12px; height: 12px; background: #22c55e; border-radius: 50%; margin-right: 8px;"></div>
            <span>Bajo Riesgo</span>
          </div>
          <div style="font-size: 10px; color: #94a3b8; border-top: 1px solid #334155; padding-top: 8px;">
            Total: ${totalEvents} eventos
          </div>
        `

        return div
      }
      legend.addTo(map)

      mapInstanceRef.current = map
      setIsLoaded(true)

      // Agregar estilos CSS para las animaciones (solo una vez)
      if (!document.querySelector("#leaflet-custom-styles")) {
        const style = document.createElement("style")
        style.id = "leaflet-custom-styles"
        style.textContent = `
          .pulsing-marker {
            background: transparent !important;
            border: none !important;
          }
          
          .pulse-container {
            position: relative;
            width: 20px;
            height: 20px;
          }
          
          .pulse-dot {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 8px;
            height: 8px;
            background: var(--pulse-color);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            z-index: 2;
          }
          
          .pulse-ring {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            border: 2px solid var(--pulse-color);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: pulse 2s infinite;
            opacity: 0.6;
          }
          
          @keyframes pulse {
            0% {
              transform: translate(-50%, -50%) scale(0.5);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(2);
              opacity: 0;
            }
          }
          
          .leaflet-popup-content-wrapper {
            background: #f8fafc !important;
            border-radius: 8px !important;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
          }
          
          .leaflet-popup-tip {
            background: #f8fafc !important;
          }
          
          .legend {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
          }
          
          .leaflet-control-zoom {
            background: rgba(15, 23, 42, 0.9) !important;
            border: 1px solid #334155 !important;
            border-radius: 8px !important;
          }
          
          .leaflet-control-zoom a {
            background: transparent !important;
            color: #f8fafc !important;
            border: none !important;
          }
          
          .leaflet-control-zoom a:hover {
            background: rgba(51, 65, 85, 0.8) !important;
          }
        `
        document.head.appendChild(style)
      }
    }

    loadLeaflet()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [networkActivityData])

  return (
    <div className="relative w-full h-[200px] sm:h-[250px] md:h-[280px] lg:h-[300px]">
      <div
        ref={mapRef}
        className="w-full h-full rounded-lg overflow-hidden border border-slate-700"
        style={{ background: "#0f172a" }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-lg">
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Cargando mapa de Ecuador...</span>
          </div>
        </div>
      )}
    </div>
  )
}
