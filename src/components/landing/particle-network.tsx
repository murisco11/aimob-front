"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  glowing: boolean
  opacity: number
  pulsePhase: number
  pulseSpeed: number
}

const PARTICLE_COUNT = 70
const CONNECTION_DISTANCE = 140
const MOUSE_RADIUS = 160
const MOUSE_REPEL_STRENGTH = 0.025
const LINE_OPACITY = 0.08
const GLOW_CHANCE = 0.15

export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animationRef = useRef<number>(0)
  const dimensionsRef = useRef({ w: 0, h: 0 })

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        glowing: Math.random() < GLOW_CHANCE,
        opacity: Math.random() * 0.4 + 0.15,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.01 + 0.005,
      })
    }
    particlesRef.current = particles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dimensionsRef.current = { w: rect.width, h: rect.height }

      if (particlesRef.current.length === 0) {
        initParticles(rect.width, rect.height)
      }
    }

    resize()
    window.addEventListener("resize", resize)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    const slateColor = "148, 163, 184"   // slate-400
    const greenColor = "16, 185, 129"     // emerald-500

    const draw = () => {
      const { w, h } = dimensionsRef.current
      const particles = particlesRef.current
      const mouse = mouseRef.current

      ctx.clearRect(0, 0, w, h)

      // Update positions
      for (const p of particles) {
        // Mouse repulsion
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * MOUSE_REPEL_STRENGTH
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }

        // Damping
        p.vx *= 0.995
        p.vy *= 0.995

        p.x += p.vx
        p.y += p.vy
        p.pulsePhase += p.pulseSpeed

        // Wrap around edges
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * LINE_OPACITY
            const eitherGlows = particles[i].glowing || particles[j].glowing
            const color = eitherGlows ? greenColor : slateColor
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${color}, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Draw connections to mouse
      for (const p of particles) {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_RADIUS) {
          const alpha = (1 - dist / MOUSE_RADIUS) * 0.12
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(${greenColor}, ${alpha})`
          ctx.lineWidth = 0.6
          ctx.stroke()
        }
      }

      // Draw particles
      for (const p of particles) {
        const pulse = p.glowing
          ? 0.5 + Math.sin(p.pulsePhase) * 0.3
          : p.opacity

        if (p.glowing) {
          // Outer glow
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${greenColor}, ${pulse * 0.12})`
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.glowing
          ? `rgba(${greenColor}, ${pulse})`
          : `rgba(${slateColor}, ${pulse})`
        ctx.fill()
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    animationRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", resize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [initParticles])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10 h-full w-full"
      aria-hidden="true"
    />
  )
}
