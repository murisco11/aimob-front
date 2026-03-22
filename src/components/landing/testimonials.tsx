import { Star } from "lucide-react"

const testimonials = [
  {
    text: "Meu maior medo era perder meu WhatsApp normal. Que nada! Continuo usando meu app no celular e a IA faz o 'filtro grosso' sozinha. Sensacional, não muda minha rotina.",
    name: "Miguel S.",
    title: "Corretor Independente (Faturou 300k+)",
    initials: "MS",
  },
  {
    text: "Em 30 dias, o sistema recuperou duas vendas de alto padrão que chegaram de madrugada. Só essas comissões já pagaram o sistema por uns 5 anos. O ROI é absurdo.",
    name: "Ana Paula R.",
    title: "Especialista em Jardins",
    initials: "AP",
  },
  {
    text: "O resumo que a IA faz antes de eu entrar na conversa é o que mais gosto. Já chego sabendo o orçamento e o que o cliente quer, sem perder tempo com perguntas básicas.",
    name: "Ricardo L.",
    title: "Gestor de Lançamentos",
    initials: "RL",
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="relative px-6 py-24" id="testimonials">
      <div className="pointer-events-none absolute inset-0 section-glow-left" />
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Prova Social
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Quem usa, não fica mais sem.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Veja o que corretores que automatizaram estão falando.
          </p>
        </div>

        <div className="mx-auto mt-5 h-px w-28 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group flex flex-col rounded-3xl bg-card/50 p-8 shadow-lg shadow-black/15 transition-all duration-300 hover:-translate-y-1"
            >
              <Stars />
              <blockquote className="mt-5 flex-1 text-pretty leading-relaxed text-muted-foreground">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3 pt-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
