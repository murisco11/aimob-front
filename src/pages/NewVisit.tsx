import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarIcon, Clock, User, MapPin, FileText } from "lucide-react";
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
import { leads, properties } from "@/data/mockData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

type FieldErrors = Record<string, string>;

const RequiredDot = () => <span className="text-destructive ml-0.5">*</span>;

const NewVisit = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [leadId, setLeadId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (!leadId) errs.leadId = "Selecione um lead";
    if (!propertyId) errs.propertyId = "Selecione um imóvel";
    if (!selectedDate) errs.date = "Selecione uma data";
    if (!time) errs.time = "Informe o horário";
    return errs;
  };

  const handleSave = () => {
    setSubmitted(true);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    toast.success("Visita agendada com sucesso!");
    navigate("/visits");
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
              <h1 className="text-xl font-bold text-foreground">Nova Visita</h1>
              <p className="text-xs text-muted-foreground">Agende uma visita com um lead</p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto space-y-5">
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
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.name} — {lead.neighborhood}
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
                    {properties.map((prop) => (
                      <SelectItem key={prop.id} value={prop.id}>
                        {prop.title} — {prop.address}
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
                Agendar Visita
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewVisit;
