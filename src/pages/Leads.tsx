import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Plus, Instagram, MessageCircle, Globe, MessageSquare, Clock, ChevronRight, Phone, Home, Sparkles, LayoutGrid, List, Calendar, PenBox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import LeadStatusBadge from "@/components/crm/LeadStatusBadge";
import { useLead } from "@/hooks/useLead";
import { Lead } from "@/types/LeadType";
import { VisitaStatus } from "@/types/VisitaType";

const pipelineColumns: { stage: Lead["status"]; label: string; color: string }[] = [
  { stage: "qualificacao_ia", label: "Qualificação IA", color: "bg-info" },
  { stage: "visita_agendada", label: "Visita Agendada", color: "bg-warning" },
  { stage: "em_negociacao", label: "Em Negociação", color: "bg-leads-accent" },
  { stage: "fechado", label: "Fechado/Ganho", color: "bg-success" },
  { stage: "perdido", label: "Perdido", color: "bg-destructive" },
];

const originIcon = (instanceName?: string) => {
  if (instanceName?.toLowerCase().includes("insta")) return <Instagram className="w-3.5 h-3.5 text-pink-400" />;
  if (instanceName?.toLowerCase().includes("site")) return <Globe className="w-3.5 h-3.5 text-info" />;
  return <MessageCircle className="w-3.5 h-3.5 text-leads-accent" />;
};

const getInitials = (name?: string) => {
  if (!name) return "L";
  return name.substring(0, 2).toUpperCase();
};

const Leads = () => {
  const navigate = useNavigate();
  const { leads, fetchAllLead, updateLead, isLoading } = useLead();
  const [searchParams] = useSearchParams();
  const preSelectedLeadId = searchParams.get("leadId")
  const [search, setSearch] = useState("");
  const [filterTemp, setFilterTemp] = useState<string>("all");
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [selectedLeadData, setSelectedLeadData] = useState<Lead | null>(null);
  const [dragOverStage, setDragOverStage] = useState<Lead["status"] | null>(null);

  useEffect(() => {
    fetchAllLead();
  }, [fetchAllLead]);

  useEffect(() => {
    if (preSelectedLeadId && leads.length > 0) {
      const leadEncontrado = leads.find((l) => l.id === Number(preSelectedLeadId));

      if (leadEncontrado) {
        setSelectedLeadData(leadEncontrado);
      }
    }
  }, [preSelectedLeadId, leads]);

  const filtered = leads.filter((l) => {
    if (search && !l.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterTemp !== "all" && l.temperatura !== filterTemp) return false;
    return true;
  });

  const getLeadsByStage = (stage: Lead["status"]) => filtered.filter((l) => l.status === stage);

  const handleDragStart = (e: React.DragEvent, leadId: number) => {
    e.dataTransfer.setData("text/plain", String(leadId));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, stage: Lead["status"]) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = async (e: React.DragEvent, stage: Lead["status"]) => {
    e.preventDefault();
    setDragOverStage(null);
    const leadId = Number(e.dataTransfer.getData("text/plain"));

    try {
      await updateLead(leadId, { status: stage });
    } catch (error) {
      console.error("Erro ao mover card", error);
    }
  };

  return (
    <div className="flex h-screen dark bg-background text-foreground">
      <CrmSidebar activeItem="Leads" />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />

        <header className="border-b border-border px-4 md:px-6 py-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-secondary border-border"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={filterTemp} onValueChange={setFilterTemp}>
                <SelectTrigger className="w-[120px] bg-secondary border-border">
                  <SelectValue placeholder="Temperatura" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center rounded-lg border border-border bg-secondary p-0.5">
                <button
                  onClick={() => setView("kanban")}
                  className={`p-1.5 rounded-md transition-colors ${view === "kanban" ? "bg-leads-accent text-leads-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-leads-accent text-leads-accent-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <Button onClick={() => navigate("/leads/new")} className="bg-leads-accent  hover:bg-leads-accent/90 text-leads-accent-foreground">
                <Plus className="w-4 h-4 mr-1.5" /> Criar Lead
              </Button>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">Carregando leads...</div>
        ) : (
          <div className="flex-1 overflow-auto">
            {view === "kanban" ? (
              <div className="flex gap-4 p-4 md:p-6 w-max min-h-full">
                {pipelineColumns.map((col) => {
                  const stageLeads = getLeadsByStage(col.stage);
                  return (
                    <div
                      key={col.stage}
                      className={`w-[280px] shrink-0 flex flex-col rounded-xl p-2 transition-colors ${dragOverStage === col.stage ? "bg-leads-accent/10 ring-1 ring-leads-accent/40" : ""}`}
                      onDragOver={(e) => handleDragOver(e, col.stage)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, col.stage)}
                    >
                      <div className="flex items-center gap-2 mb-3 px-1">
                        <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                        <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
                        <span className="ml-auto text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{stageLeads.length}</span>
                      </div>
                      <div className="space-y-3 flex-1">
                        {stageLeads.map((lead) => (
                          <div
                            key={lead.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, lead.id)}
                            onClick={() => setSelectedLeadData(lead)}
                            className="w-full text-left rounded-xl border border-border bg-card p-3.5 hover:border-leads-accent/50 transition-colors cursor-grab active:cursor-grabbing group"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-foreground">
                                {getInitials(lead.name)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                              </div>
                              {originIcon(lead.instanceName)}
                            </div>

                            <div className="mb-2">
                              <LeadStatusBadge status={lead.temperatura || "cold"} />
                            </div>

                            {lead.description && (
                              <p className="text-xs text-muted-foreground italic mb-3 line-clamp-2">
                                <span className="text-leads-accent font-medium not-italic">Resumo: </span>
                                {lead.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-2">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {new Date(lead.updatedAt).toLocaleDateString()}
                              </span>
                              {lead.aiActive && (
                                <span className="flex items-center gap-1 text-leads-accent">
                                  <Sparkles className="w-3.5 h-3.5" /> IA Ativa
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 md:p-6">
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Nome</TableHead>
                        <TableHead className="text-muted-foreground">Origem</TableHead>
                        <TableHead className="text-muted-foreground">Status (Etapa)</TableHead>
                        <TableHead className="text-muted-foreground">Temperatura</TableHead>
                        <TableHead className="text-muted-foreground">Resumo</TableHead>
                        <TableHead />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((lead) => (
                        <TableRow
                          key={lead.id}
                          onClick={() => setSelectedLeadData(lead)}
                          className="border-border cursor-pointer hover:bg-secondary/50"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-[11px] font-semibold">
                                {getInitials(lead.name)}
                              </div>
                              <span className="font-medium text-sm">{lead.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{originIcon(lead.instanceName)}</TableCell>
                          <TableCell>
                            <span className="text-xs text-muted-foreground">
                              {pipelineColumns.find((c) => c.stage === lead.status)?.label || lead.status}
                            </span>
                          </TableCell>
                          <TableCell><LeadStatusBadge status={lead.temperatura || "cold"} /></TableCell>
                          <TableCell className="max-w-[200px]">
                            <p className="text-xs text-muted-foreground italic truncate">{lead.description || "Sem resumo"}</p>
                          </TableCell>
                          <TableCell><ChevronRight className="w-4 h-4 text-muted-foreground" /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Sheet open={!!selectedLeadData} onOpenChange={(open) => !open && setSelectedLeadData(null)}>
        <SheetContent className="dark bg-card border-border w-full sm:max-w-md p-0 overflow-y-auto">
          {selectedLeadData && (
            <LeadDetailPanel
              lead={selectedLeadData}
              onOpenChat={(leadId) => {navigate(`/?chatId=${selectedLeadData.conversas[0].id}`);} }
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

function LeadDetailPanel({ lead, onOpenChat }: { lead: Lead; onOpenChat: (leadId: number) => void }) {
  const currentStageLabel = pipelineColumns.find((c) => c.stage === lead.status)?.label;

  const navigate = useNavigate()
  const imoveis = lead.imoveis || [];
  const visitas = lead.visitas || [];

  const getVisitaStatusColor = (status: VisitaStatus) => {
    switch (status) {
      case "realizada": return "bg-success text-success-foreground";
      case "agendada": return "bg-warning text-warning-foreground";
      case "cancelada": return "bg-destructive text-destructive-foreground";
      default: return "bg-secondary text-foreground";
    }
  };

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="p-5 pb-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-leads-accent/20 text-leads-accent flex items-center justify-center text-lg font-bold">
            {getInitials(lead.name)}
          </div>
          <div>
            <SheetTitle className="text-foreground text-lg">{lead.name}</SheetTitle>
            <div className="flex items-center gap-2 mt-0.5">
              {originIcon(lead.instanceName)}
              <LeadStatusBadge status={lead.temperatura || "cold"} />
              <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full ml-1">
                {currentStageLabel}
              </span>
            </div>
          </div>
        </div>
      </SheetHeader>

      <ScrollArea className="flex-1 px-5 mt-4">
        <section className="space-y-2 mb-5">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contato</h4>
          {lead.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-3.5 h-3.5 text-leads-accent" /> {lead.phone}
            </div>
          )}
        </section>

        <Separator className="bg-border mb-5" />

        <section className="mb-5">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-leads-accent" /> Perfil & Notas
          </h4>
          <div className="rounded-lg bg-secondary/80 border border-border p-3 space-y-1.5 text-sm">
            <p><span className="text-muted-foreground">Inteligência Artificial:</span> <span className="font-medium">{lead.aiActive ? "Ativada" : "Desativada"}</span></p>
            <p className="text-muted-foreground text-xs mt-2">{lead.description ? lead.description : "Nenhum resumo disponível."}</p>
          </div>
        </section>

        <Separator className="bg-border mb-5" />

        <section className="mb-5">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-leads-accent" /> Imóveis Vinculados ({imoveis.length})
          </h4>
          {imoveis.length > 0 ? (
            <div className="space-y-3">
              {imoveis.map((imovel) => (
                <div key={imovel.id} className="rounded-lg border border-border overflow-hidden bg-card/50">
                  <div className="p-3">
                    <p className="font-medium text-sm">{imovel.name || `Imóvel #${imovel.id}`}</p>
                    {imovel.address && <p className="text-xs text-muted-foreground">{imovel.address}</p>}
                    {imovel.valor && <p className="text-sm font-semibold text-leads-accent mt-1">R$ {imovel.valor}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic bg-secondary/50 p-3 rounded-lg border border-dashed border-border text-center">
              Nenhum imóvel vinculado a este lead.
            </p>
          )}
        </section>

        <Separator className="bg-border mb-5" />

        <section className="mb-8">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-leads-accent" /> Histórico de Visitas ({visitas.length})
          </h4>
          {visitas.length > 0 ? (
            <div className="space-y-3">
              {visitas.map((visita) => (
                <div key={visita.id} className="rounded-lg border border-border p-3 bg-card/50 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{visita.name || `Visita #${visita.id}`}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {new Date(visita.data).toLocaleDateString()} às {new Date(visita.data).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <Badge variant="secondary" className={`text-[10px] ${getVisitaStatusColor(visita.status)}`}>
                      {visita.status.charAt(0).toUpperCase() + visita.status.slice(1)}
                    </Badge>
                  </div>
                  {visita.descricao && (
                    <p className="text-xs text-muted-foreground italic border-t border-border/50 pt-2 mt-2">
                      {visita.descricao}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic bg-secondary/50 p-3 rounded-lg border border-dashed border-border text-center">
              Nenhuma visita registrada.
            </p>
          )}
        </section>

      </ScrollArea>

      <div className="p-4 border-t border-border flex gap-2">
        <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-secondary" onClick={() => onOpenChat(lead.id)}>
          <MessageSquare className="w-4 h-4 mr-1.5" /> Abrir Chat
        </Button>
        <Button onClick={() => navigate(`/leads/${lead.id}`)} className="flex-1 bg-leads-accent hover:bg-leads-accent/90 text-leads-accent-foreground">
          <PenBox className="w-4 h-4 mr-1.5" /> Editar
        </Button>
      </div>
    </div>
  );
}

export default Leads;