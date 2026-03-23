import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Pro",
    subtitle: "CRM + IA Completa",
    price: "R$ 119",
    period: "/mês",
    description: "Para quem quer o pacote completo de CRM e inteligência artificial",
    features: [
      "Automação no Whatsapp",
      "Inteligência Artificial",
      "Gerenciar visitas",
      "Módulo de transações",
      "Armazenar documentos",
      "CRM completo com estrutura de leads",
      "Qualificação automática após atendimento",
      "Mensagens ilimitadas"
    ],
    cta: "Começar agora",
    highlighted: true,
  },
]

export function Pricing() {
  return (
    <section className="relative px-6 py-24" id="pricing">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Planos
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Invista no que traz resultado
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Escolha o plano ideal para o momento do seu negócio. Todos com 7 dias grátis.
          </p>
        </div>

        <div className="mx-auto mt-5 h-px w-28 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="mt-16 flex justify-center overflow-visible">
          {plans.map((plan) => (
            <div key={plan.name} className="relative w-full max-w-md">
              {plan.highlighted && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/30">
                  Mais popular
                </span>
              )}

              <div
                className={`relative flex flex-col overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 ${plan.highlighted
                  ? "bg-gradient-to-b from-primary/10 to-card shadow-xl shadow-primary/20"
                  : "bg-card/55 shadow-lg shadow-black/15"
                  }`}>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.subtitle}</p>
                </div>

                <div className="mt-5">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {plan.description}
                </p>

                <ul className="mt-6 flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-2">
                  <Button
                    className="w-full rounded-full"
                    variant={plan.highlighted ? "default" : "outline"}
                    size="lg"
                    asChild
                  >
                    <a href="/signup">{plan.cta}</a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
