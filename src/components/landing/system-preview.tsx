"use client"

import { Bot, User, ArrowRight, Home, TrendingUp, MessageSquare, BarChart3, Users, Calendar, DollarSign, FileText, LayoutDashboard } from "lucide-react"

function InstagramMockup() {
  const messages = [
    { from: "user", text: "Oi, vi o apartamento no Jardins. Ainda disponível?" },
    { from: "ai", text: "Olá! Sim, o apartamento no Jardins está disponível. São 120m², 3 quartos, 2 vagas. O valor é R$ 850.000. Quer agendar uma visita?" },
    { from: "user", text: "Sim! Pode ser sábado?" },
    { from: "ai", text: "Perfeito! Agendei sua visita para sábado às 10h. Vou enviar o endereço e os detalhes por WhatsApp. Qual seu número?" },
  ]

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-400">
          <MessageSquare className="h-4 w-4 text-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">WhatsApp</p>
          <p className="text-xs text-muted-foreground">IA respondendo automaticamente</p>
        </div>
        <span className="ml-auto rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
          Online
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.from === "user" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`flex max-w-[85%] items-start gap-2 rounded-2xl px-4 py-2.5 text-sm ${msg.from === "user"
                ? "bg-secondary text-secondary-foreground"
                : "bg-primary/20 text-foreground"
                }`}
            >
              {msg.from === "user" && (
                <User className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              )}
              <span>{msg.text}</span>
              {msg.from === "ai" && (
                <img src="/logo.png" alt="AI" className="mt-0.5 h-3.5 w-auto object-contain shrink-0" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ModulesMockup() {
  const modules = [
    { label: "Leads", desc: "Gestão de contatos", icon: Users, color: "text-blue-500", bg: "bg-blue-500/20" },
    { label: "Imóveis", desc: "Catálogo completo", icon: Home, color: "text-orange-500", bg: "bg-orange-500/20" },
    { label: "Documentos", desc: "Contratos e arquivos", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/20" },
    { label: "Transações", desc: "Controle financeiro", icon: DollarSign, color: "text-yellow-500", bg: "bg-yellow-500/20" },
    { label: "Calendário", desc: "Agendamentos automáticos", icon: Calendar, color: "text-purple-500", bg: "bg-purple-500/20" },
    { label: "Inteligência Artificial", desc: "Auto-atendimento", icon: Bot, color: "text-primary", bg: "bg-primary/20" },
  ]

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
          <LayoutDashboard className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Módulos do Sistema</p>
          <p className="text-xs text-muted-foreground">Tudo que sua imobiliária precisa</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {modules.map((mod) => (
          <div
            key={mod.label}
            className="flex items-center gap-3 rounded-xl bg-secondary/30 px-4 py-3 transition-colors hover:bg-secondary/50"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${mod.bg}`}>
              <mod.icon className={`h-5 w-5 ${mod.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{mod.label}</p>
              <p className="text-xs text-muted-foreground">{mod.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SystemPreview() {
  return (
    <section className="relative px-6 py-24" id="system">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Veja em ação
          </p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Sua IA atendendo no Instagram enquanto o CRM se atualiza sozinho
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Enquanto a IA conversa com seus leads, o CRM qualifica, classifica
            e organiza tudo automaticamente.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="animate-float">
            <InstagramMockup />
          </div>
          <div className="animate-float" style={{ animationDelay: "1s" }}>
            <ModulesMockup />
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="/signup"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-foreground"
          >
            Começar agora
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  )
}
