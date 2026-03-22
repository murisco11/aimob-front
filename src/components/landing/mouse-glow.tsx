"use client"

import { useEffect, useRef, useCallback } from "react"

export function MouseGlow() {
  const containerRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0.5, y: 0.5 })
  const targetRef = useRef({ x: 0.5, y: 0.5 })
  const rafRef = useRef<number>(0)
  const activeRef = useRef(false)

  const animate = useCallback(() => {
    const lerp = 0.06
    posRef.current.x += (targetRef.current.x - posRef.current.x) * lerp
    posRef.current.y += (targetRef.current.y - posRef.current.y) * lerp

    if (glowRef.current) {
      const xPct = (posRef.current.x * 100).toFixed(2)
      const yPct = (posRef.current.y * 100).toFixed(2)
      glowRef.current.style.background = activeRef.current
        ? `radial-gradient(650px circle at ${xPct}% ${yPct}%, rgba(16, 185, 129, 0.12), transparent 65%)`
        : "transparent"
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      targetRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
      activeRef.current = true
    }

    const onLeave = () => {
      activeRef.current = false
    }

    container.addEventListener("mousemove", onMove)
    container.addEventListener("mouseleave", onLeave)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      container.removeEventListener("mousemove", onMove)
      container.removeEventListener("mouseleave", onLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [animate])

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10 overflow-hidden">
      {/* Animated CSS grid */}
      <div className="hero-grid absolute inset-0" />

      {/* Grid fade-out at edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, hsl(220 16% 6%) 100%)",
        }}
      />

      {/* Mouse-following radial glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: 1 }}
      />
    </div>
  )
}
