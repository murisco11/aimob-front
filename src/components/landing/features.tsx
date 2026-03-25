import { Brain, Smartphone, Building2, LineChart, DollarSign, Calendar1 } from "lucide-react"
import { Calendar } from "../ui/calendar"

interface Feature {
  icon: typeof Brain
  title: string
  description: string
  badge?: string
}

const features: Feature[] = [
  {
    icon: Brain,
    title: "Ecossistema de Vendas (WhatsApp, Canal Pro e IA)",
    description:
      "A inteligência artificial trabalha em paralelo com seu número de WhatsApp e seus leads do Canal Pro. O robô atende de forma humanizada, filtra os curiosos e entrega apenas clientes com real intenção de compra no seu funil.",
  },
  {
    icon: Calendar1,
    title: "Agendamento e Controle de Visitas",
    description:
      "Elimine o vaivém de mensagens para marcar horários. Organize sua agenda, acompanhe o status de cada visitação aos imóveis e otimize seu tempo focando em quem já está pronto para dar o próximo passo.",
  },
  {
    icon: DollarSign,
    title: "Documentos e Transações",
    description:
      "Descomplique a burocracia do fechamento. Centralize propostas, contratos e o recebimento de documentação dos clientes em um ambiente seguro, acompanhando cada etapa da transação até a assinatura final.",
    badge: "DIFERENCIAL EXCLUSIVO",
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
