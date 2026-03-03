import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, UserPlus, Building2, CalendarCheck, Image as ImageIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Importando os hooks e os tipos
import { useLead } from "@/hooks/useLead";
import { useImovel } from "@/hooks/useImovel";
import { useVisita } from "@/hooks/useVisita";
import { Lead, CreateLeadDto, UpdateLeadDto } from "@/types/LeadType";

interface FieldErrors {
  name?: string;
  status?: string;
  instanceName?: string;
}

const statusOptions: { value: Lead["status"]; label: string }[] = [
  { value: "qualificacao_ia", label: "Qualificação IA" },
  { value: "visita_agendada", label: "Visita Agendada" },
  { value: "em_negociacao", label: "Em Negociação" },
  { value: "fechado", label: "Fechado" },
  { value: "perdido", label: "Perdido" },
];

const temperaturaOptions: { value: Lead["temperatura"]; label: string }[] = [
  { value: "hot", label: "🔥 Hot" },
  { value: "warm", label: "🌡️ Warm" },
  { value: "cold", label: "❄️ Cold" },
];

const LeadForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const { leads, fetchAllLead, createLead, updateLead } = useLead();
  const { imoveis, fetchAllImovel, toggleLead } = useImovel(); // <-- Adicionado toggleLead
  const { visitas, fetchAllVisita } = useVisita()

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [aiActive, setAiActive] = useState(true);
  const [threadId, setThreadId] = useState("");
  const [lid, setLid] = useState("");
  const [temperatura, setTemperatura] = useState<Lead["temperatura"] | "">("");
  const [status, setStatus] = useState<Lead["status"] | "">("");
  const [instanceName, setInstanceName] = useState("");

  const [selectedPropertyIds, setSelectedPropertyIds] = useState<number[]>([]);
  const [selectedVisitIds, setSelectedVisitIds] = useState<number[]>([]);

  useEffect(() => {
    fetchAllLead();
    fetchAllImovel();
    fetchAllVisita();
  }, [fetchAllLead, fetchAllImovel, fetchAllVisita]);

  useEffect(() => {
    if (isEditing && leads && leads.length > 0) {
      const existingLead = leads.find((l) => l.id === Number(id));

      if (existingLead) {
        setName(existingLead.name || "");
        setDescription(existingLead.description || "");
        setPhone(existingLead.phone || "");
        setAiActive(existingLead.aiActive ?? true);
        setThreadId(existingLead.threadId || "");
        setLid(existingLead.lid || "");
        setTemperatura(existingLead.temperatura || "");
        setStatus(existingLead.status || "");
        setInstanceName(existingLead.instanceName || "");

        if (existingLead.imoveis) {
          setSelectedPropertyIds(existingLead.imoveis.map(i => i.id));
        }
        if (existingLead.visitas) {
          setSelectedVisitIds(existingLead.visitas.map(v => v.id));
        }
      }
    }
  }, [isEditing, id, leads]);

  useEffect(() => {
    if (isEditing && visitas && visitas.length > 0) {
      const leadVisits = visitas
        .filter((v) => v.lead?.id === Number(id))
        .map((v) => v.id);

      if (leadVisits.length > 0) {
        setSelectedVisitIds((prev) => Array.from(new Set([...prev, ...leadVisits])));
      }
    }
  }, [isEditing, id, visitas]);

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (!name.trim()) errs.name = "Nome é obrigatório";
    if (!status) errs.status = "Selecione o status";
    if (!instanceName.trim() && !isEditing) errs.instanceName = "Instância é obrigatória";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    try {
      setIsSaving(true);

      const payload: CreateLeadDto | UpdateLeadDto = {
        name,
        description,
        phone,
        aiActive,
        threadId,
        lid,
        temperatura: temperatura ? (temperatura as Lead["temperatura"]) : undefined,
        status: status as Lead["status"],
        instanceName,
      };

      if (isEditing) {
        await updateLead(Number(id), payload as UpdateLeadDto);
        toast.success("Lead atualizado com sucesso!");
      } else {
        await createLead(payload as CreateLeadDto);
        toast.success("Lead criado com sucesso!");
      }

      navigate("/leads");
    } catch (error) {
      toast.error("Erro ao salvar o lead. Tente novamente.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const onChangeField = (field: keyof FieldErrors, value: string) => {
    if (field === "name") setName(value);
    if (field === "instanceName") setInstanceName(value);
    if (submitted) {
      setErrors((prev) => {
        const next = { ...prev };
        if (value.trim()) delete next[field];
        return next;
      });
    }
  };

  const toggleProperty = async (propId: number) => {
    setSelectedPropertyIds((prev) =>
      prev.includes(propId) ? prev.filter((p) => p !== propId) : [...prev, propId]
    );

    if (isEditing && id) {
      try {
        await toggleLead(propId, Number(id));
        toast.success("Vínculo atualizado!");
      } catch (error) {
        toast.error("Erro ao vincular/desvincular o imóvel.");
        setSelectedPropertyIds((prev) =>
          prev.includes(propId) ? prev.filter((p) => p !== propId) : [...prev, propId]
        );
      }
    }
  };

  const toggleVisit = (visitId: number) => {
    setSelectedVisitIds((prev) =>
      prev.includes(visitId) ? prev.filter((v) => v !== visitId) : [...prev, visitId]
    );
  };

  const errorClass = "border-destructive focus-visible:ring-destructive";
  const fieldClass = "space-y-2";

  const RequiredDot = () => <span className="text-destructive ml-0.5">*</span>;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <CrmSidebar activeItem="Leads" />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Header */}
          <div className="px-6 py-5 border-b border-border bg-card/50 sticky top-0 z-10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/leads")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  {isEditing ? "Editar Lead" : "Novo Lead"}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {isEditing ? `Editando as informações do lead` : "Preencha as informações do novo lead"}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <UserPlus className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Dados Principais</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className={`${fieldClass} md:col-span-2`}>
                    <Label>Nome<RequiredDot /></Label>
                    <Input
                      placeholder="Nome completo do lead"
                      value={name}
                      onChange={(e) => onChangeField("name", e.target.value)}
                      className={errors.name ? errorClass : ""}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>

                  <div className={`${fieldClass} md:col-span-2`}>
                    <Label>Descrição</Label>
                    <Textarea
                      placeholder="Resumo do perfil, interesses, contexto..."
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>


                  <div className={fieldClass}>
                    <Label>Status<RequiredDot /></Label>
                    <Select
                      value={status}
                      onValueChange={(v) => {
                        setStatus(v as Lead["status"]);
                        if (submitted) setErrors((prev) => { const n = { ...prev }; delete n.status; return n; });
                      }}
                    >
                      <SelectTrigger className={errors.status ? errorClass : ""}>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
                  </div>

                  <div className={fieldClass}>
                    <Label>Temperatura</Label>
                    <Select
                      value={temperatura || "none"}
                      onValueChange={(v) => setTemperatura(v === "none" ? "" : v as Lead["temperatura"])}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {temperaturaOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                        <SelectItem value="none">Não definida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className={fieldClass}>
                    <Label>Telefone</Label>
                    <Input
                      placeholder="+55 84 99999-9999"
                      value={phone}
                      disabled={isEditing}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className={fieldClass}>
                    <Label>Nome da Instância</Label>
                    <Input
                      placeholder="ex: whatsapp-principal"
                      value={instanceName}
                      onChange={(e) => onChangeField("instanceName", e.target.value)}
                      className={errors.instanceName ? errorClass : ""}
                      disabled={true}
                    />
                    {errors.instanceName && <p className="text-xs text-destructive">{errors.instanceName}</p>}
                  </div>

                  <div className={fieldClass}>
                    <Label>Thread ID</Label>
                    <Input
                      disabled={true}
                      placeholder="ID da Inteligência Artificial"
                      value={threadId}
                      onChange={(e) => setThreadId(e.target.value)}
                    />
                  </div>

                  <div className={fieldClass}>
                    <Label>LID</Label>
                    <Input
                      disabled={true}
                      placeholder="Identificador externo (opcional)"
                      value={lid}
                      onChange={(e) => setLid(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border p-3 md:col-span-2 bg-card">
                    <div>
                      <Label className="cursor-pointer" onClick={() => setAiActive(!aiActive)}>IA Ativa</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">Permitir que a IA responda automaticamente</p>
                    </div>
                    <Switch checked={aiActive} onCheckedChange={setAiActive} />
                  </div>
                </div>
              </div>

              <div className="space-y-8">

                <div>
                  <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
                    <Building2 className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Imóveis de Interesse</h2>
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                    {imoveis?.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-6 bg-muted/30 rounded-lg">Nenhum imóvel cadastrado</p>
                    )}
                    {imoveis?.map((prop) => (
                      <label
                        key={prop.id}
                        className={`flex items-center gap-4 rounded-lg border p-3 cursor-pointer transition-colors ${selectedPropertyIds.includes(prop.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-muted-foreground/30 bg-card"
                          }`}
                      >
                        <Checkbox
                          checked={selectedPropertyIds.includes(prop.id)}
                          onCheckedChange={() => toggleProperty(prop.id)}
                        />
                        <div className="w-12 h-10 rounded-md bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{prop.name}</p>
                          {prop.address && <p className="text-xs text-muted-foreground truncate">{prop.address}</p>}
                        </div>
                        {prop.valor && (
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs font-semibold text-primary">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(prop.valor)}
                            </p>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 border-b border-border pb-2 mb-4">
                    <CalendarCheck className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Visitas Associadas</h2>

                  <Button onClick={() => navigate(`/visits/new?leadId=${id}`)} className="bg-leads-accent ml-auto  hover:bg-leads-accent/90 text-leads-accent-foreground">
                    <Plus className="w-4 h-4 mr-1.5" /> Criar Visita
                  </Button>
                  </div>
                  
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                    {(!visitas || visitas.length === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-6 bg-muted/30 rounded-lg">Nenhuma visita cadastrada</p>
                    )}
                    {visitas?.map((visit) => {
                      const statusLabel =
                        visit.status === "agendada" ? "Agendada"
                          : visit.status === "realizada" ? "Realizada"
                            : "Cancelada";

                      const statusColor =
                        visit.status === "agendada" ? "text-primary"
                          : visit.status === "realizada" ? "text-green-500"
                            : "text-muted-foreground";

                      return (
                        <label
                          key={visit.id}
                          className={`flex items-center gap-4 rounded-lg border p-3 cursor-pointer transition-colors ${selectedVisitIds.includes(visit.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/30 bg-card"
                            }`}
                        >
                          <Checkbox
                            checked={selectedVisitIds.includes(visit.id)}
                            onCheckedChange={() => toggleVisit(visit.id)}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <p className="text-sm font-medium text-foreground truncate">
                                {visit.imovel?.name || "Imóvel não informado"}
                              </p>
                              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-background ${statusColor} border border-border`}>
                                {statusLabel}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {visit.data ? format(new Date(visit.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : "Data não definida"}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-border flex items-center gap-3 max-w-7xl mx-auto">
              <Button type="submit" className="gap-2" disabled={isSaving}>
                <Save className="w-4 h-4" />
                {isSaving ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Lead"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/leads")} disabled={isSaving}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadForm;