import { Brain, Smartphone, Building2, LineChart } from "lucide-react"

interface Feature {
  icon: typeof Brain
  title: string
  description: string
  badge?: string
}

const features: Feature[] = [
  {
    icon: Brain,
    title: "Qualificação por IA",
    description:
      "O robô separa os curiosos dos reais compradores. Cada lead recebe um score inteligente baseado em comportamento e intenção real de compra.",
  },
  {
    icon: Smartphone,
    title: "WhatsApp & Insta no App",
    description:
      "Continue usando seu celular normalmente enquanto a IA trabalha em paralelo. Respostas humanizadas e personalizadas 24/7.",
    badge: "DIFERENCIAL EXCLUSIVO",
  },
  {
    icon: Building2,
    title: "Gestão de Imóveis",
    description:
      "Seus posts do Insta conectados diretamente aos dados das suas propriedades. Atualize um e o outro sincroniza automaticamente.",
  },
  {
    icon: LineChart,
    title: "Relatórios de ROI",
    description:
      "Saiba exatamente qual anúncio está trazendo comissão. Dashboards em tempo real com métricas que importam.",
  },
]

export function Features() {
  return (
    <section className="relative px-6 py-24" id="features">
      <div className="pointer-events-none absolute inset-0 section-glow-right" />
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Funcionalidades
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tudo que você precisa em uma plataforma
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Ferramentas integradas para transformar seu processo de vendas de imóveis.
          </p>
        </div>

        <div className="mx-auto mt-5 h-px w-28 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="mx-auto mt-12 max-w-5xl rounded-3xl bg-card/55 p-6 shadow-xl shadow-black/20 sm:p-8">
          <ul className="divide-y divide-border/40">
            {features.map((feature) => (
              <li key={feature.title} className="grid gap-4 py-6 sm:grid-cols-[52px_1fr] sm:gap-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                    {feature.badge && (
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-primary">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
