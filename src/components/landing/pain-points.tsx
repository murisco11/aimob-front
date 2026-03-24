import { Clock, ShieldCheck, Share2 } from "lucide-react"

const items = [
  {
    icon: Clock,
    title: "Disponibilidade total",
    description:
      "Sua IA trabalha enquanto você dorme. Garanta atendimento imediato e não deixe nenhum cliente esfriar esperando na fila.",
  },
  {
    icon: ShieldCheck,
    title: "Gestão automática",
    description:
      "Esqueça o trabalho manual. Cada novo contato é avaliado, qualificado e categorizado direto no seu funil de vendas.",
  },
  {
    icon: Share2,
    title: "Tudo em um só lugar",
    description:
      "CANAL PRO e WhatsApp integrados diretamente ao seu CRM. Controle toda a sua operação em uma única tela, sem alternar entre apps.",
  },
]

export function PainPoints() {
  return (
    <section className="relative px-6 py-32" id="why">
      <div className="pointer-events-none absolute inset-0 section-glow-top" />
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            A vantagem competitiva
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Por que corretores de elite estão automatizando?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            O mercado imobiliário é veloz. A agilidade no primeiro contato é o que define quem fecha negócio.
          </p>
        </div>

        <div className="mx-auto mt-8 h-px w-32 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          {items.map((item, idx) => (
            <div
              key={item.title}
              className="group relative rounded-3xl bg-card/55 p-8 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-6">
                <div className="flex-none">
                  <span className="text-4xl font-light leading-none tracking-tight text-primary">{String(idx + 1).padStart(2, '0')}</span>
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
