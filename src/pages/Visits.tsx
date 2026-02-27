import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CalendarIcon,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  XCircle,
  CalendarPlus,
} from "lucide-react";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { visits } from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusConfig = {
  scheduled: { label: "Agendada", icon: CalendarIcon, className: "bg-info/15 text-info border-info/30" },
  completed: { label: "Concluída", icon: CheckCircle2, className: "bg-success/15 text-success border-success/30" },
  cancelled: { label: "Cancelada", icon: XCircle, className: "bg-destructive/15 text-destructive border-destructive/30" },
};

const Visits = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date("2026-02-14"));

  const visitDates = useMemo(() => {
    const dates = new Set<string>();
    visits.forEach((v) => dates.add(v.date));
    return dates;
  }, []);

  const filteredVisits = useMemo(() => {
    if (!selectedDate) return visits;
    return visits.filter((v) => isSameDay(parseISO(v.date), selectedDate));
  }, [selectedDate]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <CrmSidebar activeItem="Visits" />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />

        <div className="flex-1 flex overflow-hidden">
          {/* Left: Calendar */}
          <div className="w-full md:w-[340px] xl:w-[360px] shrink-0 overflow-y-auto border-r border-border scrollbar-thin">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-foreground mb-1">Visitas</h2>
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

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {[
                  { label: "Agendadas", value: visits.filter((v) => v.status === "scheduled").length, color: "text-info" },
                  { label: "Concluídas", value: visits.filter((v) => v.status === "completed").length, color: "text-success" },
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
          </div>

          {/* Center: Visits for selected date */}
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
              {filteredVisits.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <CalendarIcon className="w-10 h-10 mb-3 opacity-40" />
                  <p className="text-sm">Nenhuma visita neste dia</p>
                </div>
              ) : (
                <div className="space-y-3 pr-3">
                  {filteredVisits.map((visit) => {
                    const config = statusConfig[visit.status];
                    const StatusIcon = config.icon;
                    return (
                      <Card key={visit.id} className="border-border hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/?leadId=${visit.leadId}`)}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                                {visit.leadAvatar}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{visit.leadName}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {visit.time}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline" className={cn("text-[11px] gap-1", config.className)}>
                              <StatusIcon className="w-3 h-3" />
                              {config.label}
                            </Badge>
                          </div>

                          <div className="bg-muted/50 rounded-lg p-3 mb-3">
                            <p className="text-sm font-medium text-foreground">{visit.propertyTitle}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              {visit.propertyAddress}
                            </p>
                          </div>

                          {visit.notes && (
                            <p className="text-xs text-muted-foreground italic">"{visit.notes}"</p>
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
