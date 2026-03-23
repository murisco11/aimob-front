"use client"

import { useEffect, useRef, useCallback } from "react"

const ORBS = [
  // Top-left: large primary green
  {
    cx: "15%", cy: "8%",
    size: 600,
    color: "rgba(16, 185, 129, 0.10)",
    drift: "animate-aurora-1",
  },
  // Center-right: teal accent
  {
    cx: "80%", cy: "30%",
    size: 500,
    color: "rgba(20, 184, 140, 0.07)",
    drift: "animate-aurora-2",
  },
  // Mid-left: emerald
  {
    cx: "10%", cy: "55%",
    size: 550,
    color: "rgba(16, 185, 129, 0.08)",
    drift: "animate-aurora-3",
  },
  // Bottom-center: wide green wash
  {
    cx: "55%", cy: "78%",
    size: 650,
    color: "rgba(16, 185, 129, 0.09)",
    drift: "animate-aurora-1",
  },
  // Bottom-right: deep teal
  {
    cx: "85%", cy: "92%",
    size: 450,
    color: "rgba(20, 184, 140, 0.06)",
    drift: "animate-aurora-2",
  },
]

export function AmbientBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0.5, y: 0.5 })
  const targetRef = useRef({ x: 0.5, y: 0.5 })
  const activeRef = useRef(false)
  const rafRef = useRef<number>(0)

  const animate = useCallback(() => {
    const lerp = 0.04
    posRef.current.x += (targetRef.current.x - posRef.current.x) * lerp
    posRef.current.y += (targetRef.current.y - posRef.current.y) * lerp

    if (glowRef.current) {
      const xPx = (posRef.current.x * (containerRef.current?.offsetWidth ?? 0)).toFixed(0)
      const yPx = (posRef.current.y * (containerRef.current?.offsetHeight ?? 0)).toFixed(0)
      glowRef.current.style.background = activeRef.current
        ? `radial-gradient(800px circle at ${xPx}px ${yPx}px, rgba(16, 185, 129, 0.07), transparent 60%)`
        : "transparent"
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const scrollY = window.scrollY
      targetRef.current = {
        x: e.clientX / rect.width,
        y: (e.clientY + scrollY) / container.scrollHeight,
      }
      activeRef.current = true
    }

    const onLeave = () => {
      activeRef.current = false
    }

    window.addEventListener("mousemove", onMove)
    document.addEventListener("mouseleave", onLeave)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [animate])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Static blurred green gradient orbs */}
      {ORBS.map((orb, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${orb.drift}`}
          style={{
            left: orb.cx,
            top: orb.cy,
            width: orb.size,
            height: orb.size,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(80px)",
          }}
        />
      ))}

      {/* Mouse-following glow layer */}
      <div
        ref={glowRef}
        className="absolute inset-0 transition-opacity duration-700"
      />
    </div>
  )
}
