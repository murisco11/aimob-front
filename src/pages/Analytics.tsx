import { useState } from "react";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Bot,
  Flame,
  DollarSign,
  Target,
  Clock,
  MessageSquare,
  UserX,
  Lightbulb,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

const leadSourceData = [
  { name: "Instagram Direct", leads: 87, color: "#10b981" },
  { name: "WhatsApp", leads: 124, color: "#34d399" },
  { name: "Landing Page", leads: 53, color: "#3b82f6" },
];

const funnelData = [
  { stage: "Total Leads", value: 264, fill: "#10b981" },
  { stage: "AI Qualified", value: 142, fill: "#34d399" },
  { stage: "Visitas", value: 31, fill: "#6ee7b7" },
  { stage: "Fechados", value: 8, fill: "#a7f3d0" },
];

const visitsOverTime = [
  { week: "Sem 1", visits: 5, revenue: 120000 },
  { week: "Sem 2", visits: 8, revenue: 280000 },
  { week: "Sem 3", visits: 12, revenue: 350000 },
  { week: "Sem 4", visits: 9, revenue: 520000 },
];

const pieColors = ["#10b981", "#34d399", "#3b82f6"];

const KpiCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: any;
  trend?: "up" | "down";
  trendValue?: string;
}) => (
  <Card className="bg-slate-900/80 border-slate-800/60 hover:border-emerald-500/30 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.15)] transition-all duration-300 group">
    <CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-slate-50">{value}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          {trend && trendValue && (
            <div className="flex items-center gap-1">
              {trend === "up" ? (
                <TrendingUp className="w-3 h-3 text-emerald-400" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-400" />
              )}
              <span className={`text-xs font-medium ${trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
          <Icon className="w-5 h-5 text-emerald-400" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-medium text-slate-100">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const Analytics = () => {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      <CrmSidebar />
      <main className="flex-1 overflow-auto">
        <MobileHeader />
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-50">Analytics & ROI</h1>
              <p className="text-sm text-slate-400 mt-1">Visão geral do desempenho — Últimos 30 dias</p>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
              Atualizado agora
            </Badge>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              title="Valor do Pipeline"
              value="R$ 1.2M"
              subtitle="Comissões em negociação"
              icon={DollarSign}
              trend="up"
              trendValue="+18% vs. mês anterior"
            />
            <KpiCard
              title="Taxa de Conversão"
              value="12%"
              subtitle="Leads → Visita agendada"
              icon={Target}
              trend="up"
              trendValue="+3.2pp"
            />
            <KpiCard
              title="Tempo Economizado (IA)"
              value="32 Horas"
              subtitle="Esta semana"
              icon={Bot}
              trend="up"
              trendValue="Equivalente a R$ 4.800"
            />
            <KpiCard
              title="Leads Hot Ativos"
              value="14"
              subtitle="Flagged pela IA"
              icon={Flame}
              trend="up"
              trendValue="+5 esta semana"
            />
          </div>

          {/* Charts + AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Charts Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Lead Source */}
              <Card className="bg-slate-900/80 border-slate-800/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    Origem dos Leads
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={leadSourceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            dataKey="leads"
                            stroke="none"
                          >
                            {leadSourceData.map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {leadSourceData.map((source) => (
                        <div key={source.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: source.color }} />
                            <span className="text-sm text-slate-300">{source.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-slate-100">{source.leads}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Funnel */}
              <Card className="bg-slate-900/80 border-slate-800/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    Funil de Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3 py-2">
                    {funnelData.map((stage, i) => {
                      const pct = (stage.value / funnelData[0].value) * 100;
                      return (
                        <div key={stage.stage} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">{stage.stage}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-100">{stage.value}</span>
                              {i > 0 && (
                                <span className="text-xs text-slate-500">
                                  ({Math.round((stage.value / funnelData[i - 1].value) * 100)}%)
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${pct}%`, backgroundColor: stage.fill }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Visits Over Time */}
              <Card className="bg-slate-900/80 border-slate-800/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                    Visitas por Semana
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={visitsOverTime}>
                        <defs>
                          <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="visits" stroke="#10b981" strokeWidth={2} fill="url(#greenGradient)" name="Visitas" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights Column */}
            <div className="space-y-6">
              <Card className="bg-slate-900/80 border-slate-800/60 hover:border-emerald-500/30 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-emerald-400" />
                    ROI do Agente IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                      <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-xl font-bold text-slate-50">1.240</p>
                        <p className="text-xs text-slate-400">Mensagens tratadas automaticamente</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                      <UserX className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-xl font-bold text-slate-50">85</p>
                        <p className="text-xs text-slate-400">Leads curiosos filtrados</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                      <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-xl font-bold text-slate-50">32h</p>
                        <p className="text-xs text-slate-400">Horas economizadas esta semana</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Suggestion */}
              <Card className="bg-gradient-to-br from-emerald-500/10 to-slate-900/80 border-emerald-500/20">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Lightbulb className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Insight da IA</p>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        Leads do <span className="text-emerald-400 font-medium">Instagram</span> convertem{" "}
                        <span className="text-emerald-400 font-medium">2x mais rápido</span> que leads da Landing Page
                        este mês. Considere aumentar o orçamento de Meta Ads.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Properties */}
              <Card className="bg-slate-900/80 border-slate-800/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-emerald-400" />
                    Imóveis Mais Procurados
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "Apt. Ponta Negra", views: 47, leads: 12 },
                    { name: "Cobertura Capim Macio", views: 38, leads: 8 },
                    { name: "Casa Lagoa Nova", views: 29, leads: 5 },
                  ].map((p) => (
                    <div key={p.name} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40">
                      <div>
                        <p className="text-sm font-medium text-slate-200">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.views} views · {p.leads} leads</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
