import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CalendarIcon,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  XCircle,
  CalendarPlus,
  Loader2
} from "lucide-react";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useVisita } from "@/hooks/useVisita"; 

const statusConfig = {
  agendada: { label: "Agendada", icon: CalendarIcon, className: "bg-info/15 text-info border-info/30" },
  realizada: { label: "Concluída", icon: CheckCircle2, className: "bg-success/15 text-success border-success/30" },
  cancelada: { label: "Cancelada", icon: XCircle, className: "bg-destructive/15 text-destructive border-destructive/30" },
};

const Visits = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { visitas, isLoading, fetchAllVisita } = useVisita();

  useEffect(() => {
    fetchAllVisita();
  }, [fetchAllVisita]);

  const visitDates = useMemo(() => {
    const dates = new Set<string>();
    if (visitas) {
      visitas.forEach((v) => {
        if (v.data) {
          dates.add(format(new Date(v.data), "yyyy-MM-dd"));
        }
      });
    }
    return dates;
  }, [visitas]);

  const filteredVisits = useMemo(() => {
    if (!visitas) return [];
    if (!selectedDate) return visitas;
    
    return visitas.filter((v) => {
      if (!v.data) return false;
      return isSameDay(new Date(v.data), selectedDate);
    });
  }, [selectedDate, visitas]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <CrmSidebar activeItem="Visits" />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />

        <div className="flex-1 flex overflow-hidden">
          <div className="w-full md:w-[340px] xl:w-[360px] shrink-0 overflow-y-auto border-r border-border scrollbar-thin">
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-semibold text-foreground">Visitas</h2>
                <Button size="sm" className="gap-1.5 md:hidden" onClick={() => navigate("/visits/new")}>
                  <CalendarPlus className="w-4 h-4" />
                  Nova Visita
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Gerencie suas visitas e reuniões com leads</p>

              <Card className="border-border">
                <CardContent className="p-0 flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    locale={ptBR}
                    className="p-3 pointer-events-auto"
                    modifiers={{ hasVisit: (date) => visitDates.has(format(date, "yyyy-MM-dd")) }}
                    modifiersClassNames={{ hasVisit: "font-bold underline underline-offset-4 decoration-primary" }}
                  />
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-2 mt-4">
                {[
                  { label: "Agendadas", value: visitas?.filter((v) => v.status === "agendada").length || 0, color: "text-info" },
                  { label: "Concluídas", value: visitas?.filter((v) => v.status === "realizada").length || 0, color: "text-success" },
                ].map((stat) => (
                  <Card key={stat.label} className="border-border">
                    <CardContent className="p-3 text-center">
                      <p className={cn("text-xl font-bold", stat.color)}>{stat.value}</p>
                      <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Visit list visible on mobile below the calendar */}
            <div className="md:hidden border-t border-border">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  {selectedDate
                    ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR })
                    : "Todas as visitas"}
                  <span className="ml-2 text-muted-foreground font-normal text-xs">{filteredVisits.length} visita{filteredVisits.length !== 1 ? "s" : ""}</span>
                </h3>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <span className="text-sm">Carregando...</span>
                  </div>
                ) : filteredVisits.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <CalendarIcon className="w-8 h-8 mb-2 opacity-40" />
                    <p className="text-sm">Nenhuma visita neste dia</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredVisits.map((visit) => {
                      const config = statusConfig[visit.status] || statusConfig.agendada;
                      const StatusIcon = config.icon;
                      const leadName = visit.lead?.name || "Lead não identificado";
                      const propertyName = visit.imovel?.name || "Imóvel não especificado";
                      const visitTime = visit.data ? format(new Date(visit.data), "HH:mm") : "--:--";
                      return (
                        <Card
                          key={visit.id}
                          className="border-border hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => navigate(`/visits/${visit.id}`)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-foreground truncate flex-1">{leadName}</p>
                              <Badge variant="outline" className={cn("text-[10px] gap-1 ml-2 shrink-0", config.className)}>
                                <StatusIcon className="w-3 h-3" />
                                {config.label}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{propertyName}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />{visitTime}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-1 flex-col min-w-0 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {selectedDate
                    ? format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR })
                    : "Todas as visitas"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {filteredVisits.length} visita{filteredVisits.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Button size="sm" className="gap-1.5" onClick={() => navigate("/visits/new")}>
                <CalendarPlus className="w-4 h-4" />
                Nova Visita
              </Button>
            </div>

            <ScrollArea className="flex-1">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Loader2 className="w-8 h-8 mb-3 animate-spin text-primary" />
                  <p className="text-sm">Carregando visitas...</p>
                </div>
              ) : filteredVisits.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <CalendarIcon className="w-10 h-10 mb-3 opacity-40" />
                  <p className="text-sm">Nenhuma visita neste dia</p>
                </div>
              ) : (
                <div className="space-y-3 pr-3">
                  {filteredVisits.map((visit) => {
                    const config = statusConfig[visit.status] || statusConfig.agendada;
                    const StatusIcon = config.icon;
                    
                    const leadName = visit.lead?.name || "Lead não identificado";
                    const leadInitials = visit.lead?.name ? visit.lead.name.substring(0, 2).toUpperCase() : <User className="w-4 h-4" />;
                    const propertyName = visit.imovel?.name || "Imóvel não especificado";
                    const propertyAddress = visit.imovel?.address || "Endereço não disponível";
                    const visitTime = visit.data ? format(new Date(visit.data), "HH:mm") : "--:--";

                    return (
                      <Card 
                        key={visit.id} 
                        className="border-border hover:shadow-md transition-shadow cursor-pointer" 
                        onClick={() => navigate(`/visits/${visit.id}`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                                {leadInitials}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{leadName}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {visitTime}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className={cn("text-[11px] gap-1", config.className)}>
                              <StatusIcon className="w-3 h-3" />
                              {config.label}
                            </Badge>
                          </div>

                          <div className="bg-muted/50 rounded-lg p-3 mb-3">
                            <p className="text-sm font-medium text-foreground">{propertyName}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 min-w-3" />
                              <span className="truncate">{propertyAddress}</span>
                            </p>
                          </div>

                          {visit.descricao && (
                            <p className="text-xs text-muted-foreground italic">"{visit.descricao}"</p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visits;