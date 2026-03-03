import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, CalendarIcon, Clock, User, MapPin, FileText, Activity } from "lucide-react";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Importando os hooks da sua aplicação
import { useVisita } from "@/hooks/useVisita";
import { useLead } from "@/hooks/useLead";
import { useImovel } from "@/hooks/useImovel";
import { VisitaStatus, CreateVisitaDto, UpdateVisitaDto } from "@/types/VisitaType"; // Ajuste os caminhos
import { useConfirmStore } from "@/stores/confirmStore";

type FieldErrors = Record<string, string>;

const RequiredDot = () => <span className="text-destructive ml-0.5">*</span>;

const VisitForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const [searchParams] = useSearchParams();
  const preSelectedLeadId = searchParams.get("leadId");
  const { visitas, createVisita, updateVisita, deleteVisita } = useVisita();
  const { leads, fetchAllLead } = useLead();
  const { imoveis, fetchAllImovel } = useImovel();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [leadId, setLeadId] = useState(preSelectedLeadId || "");
  const [propertyId, setPropertyId] = useState("");
  const { openConfirm } = useConfirmStore();
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<VisitaStatus>("agendada");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchAllLead();
    fetchAllImovel();
  }, [fetchAllLead, fetchAllImovel]);

  useEffect(() => {
    if (isEditing && visitas) {
      const visitToEdit = visitas.find((v) => v.id === Number(id));

      if (visitToEdit) {
        setLeadId(visitToEdit.lead?.id?.toString() || "");
        setPropertyId(visitToEdit.imovel?.id?.toString() || "");
        setNotes(visitToEdit.descricao || "");
        setStatus(visitToEdit.status);

        if (visitToEdit.data) {
          const dateObj = new Date(visitToEdit.data);
          setSelectedDate(dateObj);
          setTime(format(dateObj, "HH:mm"));
        }
      }
    }
  }, [isEditing, id, visitas]);

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (!leadId) errs.leadId = "Selecione um lead";
    if (!propertyId) errs.propertyId = "Selecione um imóvel";
    if (!selectedDate) errs.date = "Selecione uma data";
    if (!time) errs.time = "Informe o horário";
    return errs;
  };
  const handleDelete = async () => {
    try {
      await openConfirm({
        title: "Excluir Lead",
        description: `Tem certeza que deseja excluir permanentemente a visita? Esta ação não pode ser desfeita.`,
        confirmText: "Sim, Excluir",
        onConfirm: async () => {
          await deleteVisita(Number(id));
          toast.success("Visita excluída com sucesso!");
          navigate("/visits");
        }
      });
    } catch (error) {
      toast.error("Erro ao excluir a visita. Tente novamente.");
      console.error("Delete error:", error);
    }
  };

  const handleSave = async () => {
    setSubmitted(true);
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const [hours, minutes] = time.split(":");
      const finalDate = new Date(selectedDate!);
      finalDate.setHours(Number(hours), Number(minutes), 0, 0);

      const leadSelecionado = leads?.find(l => l.id === Number(leadId));
      const imovelSelecionado = imoveis?.find(i => i.id === Number(propertyId));

      const payload: CreateVisitaDto | UpdateVisitaDto = {
        name: `Visita: ${leadSelecionado?.name} - ${imovelSelecionado?.name}`,
        data: finalDate.toISOString(),
        descricao: notes,
        status: status,
        lead: Number(leadId),
        imovel: Number(propertyId),
        user: 1,
      };

      if (isEditing) {
        await updateVisita(Number(id), payload as UpdateVisitaDto);
        toast.success("Visita atualizada com sucesso!");
      } else {
        await createVisita(payload as CreateVisitaDto);
        toast.success("Visita agendada com sucesso!");
      }

      navigate("/visits");
    } catch (error) {
      toast.error("Erro ao salvar a visita. Tente novamente.");
      console.error(error);
    }
  };

  const fieldError = (field: string) =>
    submitted && errors[field] ? (
      <p className="text-xs text-destructive mt-1">{errors[field]}</p>
    ) : null;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <CrmSidebar activeItem="Visits" />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate("/visits")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {isEditing ? "Editar Visita" : "Nova Visita"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {isEditing ? "Atualize os dados do agendamento" : "Agende uma visita com um lead"}
              </p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto space-y-5">
            {/* Status Selection - Mostra apenas se estiver editando */}
            {isEditing && (
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    Status da Visita
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={status} onValueChange={(value) => setStatus(value as VisitaStatus)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agendada">Agendada</SelectItem>
                      <SelectItem value="realizada">Realizada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

            {/* Lead Selection */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Lead
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label className="text-xs text-muted-foreground">
                  Selecionar lead <RequiredDot />
                </Label>
                <Select value={leadId} onValueChange={setLeadId}>
                  <SelectTrigger className={cn("mt-1", submitted && errors.leadId && "border-destructive")}>
                    <SelectValue placeholder="Escolha um lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads?.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id.toString()}>
                        {lead.name} {lead.phone ? `— ${lead.phone}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldError("leadId")}
              </CardContent>
            </Card>

            {/* Property Selection */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Imóvel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label className="text-xs text-muted-foreground">
                  Selecionar imóvel <RequiredDot />
                </Label>
                <Select value={propertyId} onValueChange={setPropertyId}>
                  <SelectTrigger className={cn("mt-1", submitted && errors.propertyId && "border-destructive")}>
                    <SelectValue placeholder="Escolha um imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    {imoveis?.map((prop) => (
                      <SelectItem key={prop.id} value={prop.id.toString()}>
                        {prop.name} {prop.address ? `— ${prop.address}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldError("propertyId")}
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  Data e Horário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Data <RequiredDot />
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full mt-1 justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground",
                            submitted && errors.date && "border-destructive"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Selecionar data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          locale={ptBR}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldError("date")}
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Horário <RequiredDot />
                    </Label>
                    <div className="relative mt-1">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className={cn("pl-9", submitted && errors.time && "border-destructive")}
                      />
                    </div>
                    {fieldError("time")}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Ex: Lead quer ver a varanda e a vista do mar..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3 justify-end pb-6">
              <Button variant="outline" onClick={() => navigate("/visits")}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {isEditing ? "Salvar Alterações" : "Agendar Visita"}
              </Button>
              {isEditing && (
                <div className="mr-auto">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    Excluir Visita
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitForm;