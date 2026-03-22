"use client"

import { Bot, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ContactFooter() {

  return (
    <>
      {/* Final CTA + Contact */}
      <section className="relative px-6 py-24" id="contact">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-0 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/5 blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          <div className="relative overflow-hidden p-8 text-center sm:p-12">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-70" />
            <div className="mx-auto flex h-14 items-center justify-center">
              <img src="/logo.png" alt="AIMOB CRM" className="h-14 w-auto object-contain" />
            </div>

            <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Pronto para automatizar suas vendas?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Junte-se a corretores de sucesso e comece agora mesmo a faturar mais.
            </p>

            <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-4">
              <Button
                asChild
                size="lg"
                className="mt-1 w-full gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 hover:bg-primary/90"
              >
                <a href="/signup">
                  Criar conta agora
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Comece agora no plano PRO.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/70 px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="AIMOB CRM" className="h-8 w-auto object-contain" />
            <span className="text-lg font-bold text-foreground">AIMOB</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            {[
              { label: "Funcionalidades", href: "#features" },
              { label: "Planos", href: "#pricing" },
              { label: "Contato", href: "#contact" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="/login"
            className="group inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-foreground"
          >
            Entrar
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="mx-auto mt-8 max-w-6xl border-t border-border pt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} AIMOB. Todos os direitos reservados.
        </div>
      </footer>
    </>
  )
}