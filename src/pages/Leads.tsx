import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Instagram, MessageCircle, Globe, MessageSquare, Clock, ChevronRight, Phone, Mail, Home, Sparkles, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import LeadStatusBadge from "@/components/crm/LeadStatusBadge";
import { leads as initialLeads, properties, type Lead, type PipelineStage } from "@/data/mockData";

const pipelineColumns: { stage: PipelineStage; label: string; color: string }[] = [
  { stage: "new", label: "Novos Leads", color: "bg-muted-foreground" },
  { stage: "ai_qualifying", label: "Qualificação IA", color: "bg-info" },
  { stage: "visit_scheduled", label: "Visita Agendada", color: "bg-warning" },
  { stage: "negotiating", label: "Em Negociação", color: "bg-leads-accent" },
  { stage: "closed", label: "Fechado/Ganho", color: "bg-success" },
];

const originIcon = (origin: Lead["origin"]) => {
  switch (origin) {
    case "instagram": return <Instagram className="w-3.5 h-3.5 text-pink-400" />;
    case "whatsapp": return <MessageCircle className="w-3.5 h-3.5 text-leads-accent" />;
    case "landing_page": return <Globe className="w-3.5 h-3.5 text-info" />;
  }
};

const Leads = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterOrigin, setFilterOrigin] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadsData, setLeadsData] = useState<Lead[]>(initialLeads);
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);

  const filtered = leadsData.filter((l) => {
    if (search && !l.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterOrigin !== "all" && l.origin !== filterOrigin) return false;
    if (filterStatus !== "all" && l.status !== filterStatus) return false;
    return true;
  });

  const getLeadsByStage = (stage: PipelineStage) => filtered.filter((l) => l.pipelineStage === stage);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData("text/plain", leadId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("text/plain");
    setLeadsData((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, pipelineStage: stage } : l))
    );
    setDragOverStage(null);
  };

  const getProperty = (id?: string) => id ? properties.find((p) => p.id === id) : undefined;

  return (
    <div className="flex h-screen dark bg-background text-foreground">
      <CrmSidebar activeItem="Leads" />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />

        {/* Header */}
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
              <Select value={filterOrigin} onValueChange={setFilterOrigin}>
                <SelectTrigger className="w-[130px] bg-secondary border-border">
                  <Filter className="w-3.5 h-3.5 mr-1.5" />
                  <SelectValue placeholder="Origem" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">Todas Origens</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="landing_page">Landing Page</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[120px] bg-secondary border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                </SelectContent>
              </Select>

              {/* View toggle */}
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

              <Button className="bg-leads-accent hover:bg-leads-accent/90 text-leads-accent-foreground">
                <Plus className="w-4 h-4 mr-1.5" /> Add Lead
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <ScrollArea className="flex-1">
          {view === "kanban" ? (
            <div className="flex gap-4 p-4 md:p-6 min-w-max">
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
                          onClick={() => setSelectedLead(lead)}
                          className="w-full text-left rounded-xl border border-border bg-card p-3.5 hover:border-leads-accent/50 transition-colors cursor-grab active:cursor-grabbing group"
                        >
                          {/* Card header */}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-foreground">
                              {lead.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                            </div>
                            {originIcon(lead.origin)}
                          </div>
                          {/* Temperature badge */}
                          <div className="mb-2">
                            <LeadStatusBadge status={lead.status} />
                          </div>
                          {/* AI insight */}
                          <p className="text-xs text-muted-foreground italic mb-3 line-clamp-2">
                            <span className="text-leads-accent font-medium not-italic">AI Summary: </span>
                            {lead.summary}
                          </p>
                          {/* Footer */}
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {lead.lastMessageTime}
                            </span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-leads-accent">
                              <MessageSquare className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      ))}
                      {stageLeads.length === 0 && (
                        <div className="text-center py-8 text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                          Nenhum lead
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="p-4 md:p-6">
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground">Nome</TableHead>
                      <TableHead className="text-muted-foreground">Origem</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-muted-foreground">Etapa</TableHead>
                      <TableHead className="text-muted-foreground">AI Summary</TableHead>
                      <TableHead className="text-muted-foreground">Última msg</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((lead) => (
                      <TableRow
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="border-border cursor-pointer hover:bg-secondary/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-[11px] font-semibold">{lead.avatar}</div>
                            <span className="font-medium text-sm">{lead.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{originIcon(lead.origin)}</TableCell>
                        <TableCell><LeadStatusBadge status={lead.status} /></TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {pipelineColumns.find((c) => c.stage === lead.pipelineStage)?.label}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <p className="text-xs text-muted-foreground italic truncate">{lead.summary}</p>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{lead.lastMessageTime}</TableCell>
                        <TableCell><ChevronRight className="w-4 h-4 text-muted-foreground" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Slide-out Detail Panel */}
      <Sheet open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <SheetContent className="dark bg-card border-border w-full sm:max-w-md p-0 overflow-y-auto">
          {selectedLead && (
            <LeadDetailPanel lead={selectedLead} property={getProperty(selectedLead.propertyId)} onOpenChat={(leadId) => navigate(`/?leadId=${leadId}`)} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

/* ────────── Lead Detail Panel ────────── */
function LeadDetailPanel({ lead, property, onOpenChat }: { lead: Lead; property?: (typeof properties)[0]; onOpenChat: (leadId: string) => void }) {
  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="p-5 pb-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-leads-accent/20 text-leads-accent flex items-center justify-center text-lg font-bold">
            {lead.avatar}
          </div>
          <div>
            <SheetTitle className="text-foreground text-lg">{lead.name}</SheetTitle>
            <div className="flex items-center gap-2 mt-0.5">
              {originIcon(lead.origin)}
              <LeadStatusBadge status={lead.status} />
            </div>
          </div>
        </div>
      </SheetHeader>

      <ScrollArea className="flex-1 px-5">
        {/* Contact info */}
        <section className="space-y-2 mb-5">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contato</h4>
          {lead.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-3.5 h-3.5 text-leads-accent" /> {lead.phone}
            </div>
          )}
          {lead.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-3.5 h-3.5 text-leads-accent" /> {lead.email}
            </div>
          )}
        </section>

        <Separator className="bg-border mb-5" />

        {/* AI Profile */}
        <section className="mb-5">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-leads-accent" /> Perfil IA
          </h4>
          <div className="rounded-lg bg-secondary/80 border border-border p-3 space-y-1.5 text-sm">
            <p><span className="text-muted-foreground">Orçamento:</span> <span className="font-medium">{lead.budget}</span></p>
            <p><span className="text-muted-foreground">Bairro:</span> <span className="font-medium">{lead.neighborhood}</span></p>
            <p className="text-muted-foreground italic text-xs mt-2">{lead.summary}</p>
            {lead.notes && <p className="text-muted-foreground text-xs mt-1">📝 {lead.notes}</p>}
          </div>
        </section>

        <Separator className="bg-border mb-5" />

        {/* Property interest */}
        {property && (
          <section className="mb-5">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-leads-accent" /> Imóvel de Interesse
            </h4>
            <div className="rounded-lg border border-border overflow-hidden">
              <img src={property.image} alt={property.title} className="w-full h-32 object-cover" />
              <div className="p-3">
                <p className="font-medium text-sm">{property.title}</p>
                <p className="text-xs text-muted-foreground">{property.address}</p>
                <p className="text-sm font-semibold text-leads-accent mt-1">{property.price}</p>
              </div>
            </div>
          </section>
        )}

        <Separator className="bg-border mb-5" />

        {/* Timeline */}
        <section className="mb-8">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Timeline</h4>
          <div className="relative pl-5 space-y-4">
            <div className="absolute left-[7px] top-1.5 bottom-1.5 w-px bg-border" />
            <TimelineItem date={lead.enteredAt} label="Lead entrou no sistema" color="bg-muted-foreground" />
            {lead.qualifiedAt && (
              <TimelineItem date={lead.qualifiedAt} label="IA qualificou o lead" color="bg-leads-accent" />
            )}
            <TimelineItem
              date="Agora"
              label={`Etapa atual: ${pipelineColumns.find((c) => c.stage === lead.pipelineStage)?.label}`}
              color="bg-leads-accent"
              active
            />
          </div>
        </section>
      </ScrollArea>

      {/* Footer actions */}
      <div className="p-4 border-t border-border flex gap-2">
        <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-secondary" onClick={() => onOpenChat(lead.id)}>
          <MessageSquare className="w-4 h-4 mr-1.5" /> Abrir Chat
        </Button>
        <Button className="flex-1 bg-leads-accent hover:bg-leads-accent/90 text-leads-accent-foreground">
          <Phone className="w-4 h-4 mr-1.5" /> Ligar
        </Button>
      </div>
    </div>
  );
}

function TimelineItem({ date, label, color, active }: { date: string; label: string; color: string; active?: boolean }) {
  return (
    <div className="relative flex items-start gap-3">
      <div className={`absolute -left-5 top-1 w-3.5 h-3.5 rounded-full border-2 border-card ${color} ${active ? "ring-2 ring-leads-accent/30" : ""}`} />
      <div>
        <p className="text-sm text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">{date}</p>
      </div>
    </div>
  );
}

export default Leads;
