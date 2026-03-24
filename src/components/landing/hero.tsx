import { ArrowRight, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-x-clip px-6 pt-40 pb-16">

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="text-left">
            <div className="relative mb-6 inline-flex items-center gap-2 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-secondary/30 to-accent/10 px-4 py-2 text-sm font-medium text-foreground shadow-md shadow-primary/10">
              <div className="absolute inset-y-0 -left-full h-full w-full bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-90 animate-light-swipe" />
              <Sparkles className="h-4 w-4 text-primary z-10" />
              <span className="relative z-10 text-primary">AIMOB: CRM inteligente para corretor</span>
            </div>

            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Venda mais imóveis enquanto a nossa IA cuida do resto.
            </h1>

            <p className="pt-4 text-sm font-semibold uppercase tracking-widest text-primary">
              Para o corretor moderno
            </p>

            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              Automatize seu Whatsapp, qualifique leads 24/7 e
              gerencie seus imóveis e leads em um CRM inteligente feito para quem não quer
              perder tempo com burocracia.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="group rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-base font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(16,185,129,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80"
                asChild
              >
                <a href="/signup" className="inline-flex items-center gap-2">
                  <span>Começar agora</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group rounded-full border border-primary/40 bg-secondary/40 px-8 py-3 text-base font-semibold text-primary transition-all duration-300 hover:bg-secondary/70 hover:border-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                asChild
              >
                <a href="#features" className="inline-flex items-center gap-2">
                  <span>Ver funcionalidades</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Button>
            </div>

            <div className="mt-7 flex items-center gap-4 rounded-full border border-border bg-secondary/35 px-4 py-3 w-fit">
              <div className="flex items-center gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">+120 corretores já automatizando atendimento e qualificação</p>
            </div>
          </div>

          <div className="relative overflow-visible lg:-mr-8 lg:-mt-2">
            <div className="absolute bottom-0 right-6 h-40 w-48 rounded-[44%] bg-secondary/80 blur-[2px]" aria-hidden="true" />
            <div className="absolute bottom-8 right-0 h-44 w-28 rounded-[45%] bg-secondary/70" aria-hidden="true" />

            <div className="relative w-full lg:w-[122%] max-w-none lg:ml-auto lg:translate-x-16 rounded-3xl border border-primary/25 bg-card/70 p-4 shadow-2xl shadow-black/40">
              <div className="relative overflow-hidden rounded-2xl bg-background/80">
                <img
                  src="/crm-print.png"
                  alt="Preview do CRM AIMOB"
                  className="object-cover w-full h-full"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: "3x", label: "Filtro de curiosos com IA" },
              { value: "24/7", label: "Atendimento imediato" },
              { value: "60%", label: "Mais foco no fechamento" },
              { value: "87%", label: "Aumento no engajamento" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <p className="text-3xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
