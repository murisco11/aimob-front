"use client"

import { useState } from "react"
import { Bot, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "Funcionalidades", href: "#features" },
  { label: "Como Funciona", href: "#system" },
  { label: "Planos", href: "#pricing" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-6 z-50 px-4 sm:px-6">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-1 py-1 sm:px-2">
        <a href="#" className="flex items-center gap-2">
          <img src="/logo.png" alt="AIMOB CRM" className="h-9 w-auto object-contain" />
          <span className="text-xl font-bold tracking-tight text-foreground">
            AIMOB
          </span>
        </a>

        <ul className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="rounded-full border border-transparent bg-secondary/55 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex md:items-center md:gap-4">
          <a href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Entrar
          </a>
          <Button className="rounded-full px-6" asChild>
            <a href="/signup">Cadastre-se</a>
          </Button>
        </div>

        <button
          className="rounded-full bg-secondary/60 px-3 py-2 text-foreground transition-colors hover:bg-secondary md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="mx-auto mt-3 w-full max-w-6xl rounded-2xl border border-border glass-card px-6 pb-6 md:hidden">
          <ul className="flex flex-col gap-3 pt-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-full bg-secondary/60 px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            <Button variant="outline" className="w-full rounded-full" asChild>
              <a href="/login" onClick={() => setMobileOpen(false)}>
                Entrar
              </a>
            </Button>
            <Button className="w-full rounded-full" asChild>
              <a href="/signup" onClick={() => setMobileOpen(false)}>
                Cadastre-se
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
