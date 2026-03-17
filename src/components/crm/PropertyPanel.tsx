import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bed, Bath, Maximize, CalendarPlus,
    Home, Car, Calendar, Clock, MapPin
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Imovel } from "@/types/ImovelType";
import { useLead } from "@/hooks/useLead";
import { formatCurrency } from "@/utils/formatCurrency";
import {Visita} from "@/types/VisitaType.ts";

interface PropertyPanelProps {
    leadId: number
}


const PropertyPanel = ({ leadId }: PropertyPanelProps) => {
    const navigate = useNavigate();
    const { selectedLead, fetchByIdLead, isLoading } = useLead();

    useEffect(() => {
        if (leadId) {
            fetchByIdLead(leadId);
        }
    }, [leadId, fetchByIdLead]);

    // Extraindo imóveis e visitas do lead selecionado
    const imoveis: Imovel[] = selectedLead?.id === leadId ? (selectedLead.imoveis || []) : [];
    const visitas: Visita[] = selectedLead?.id === leadId ? (selectedLead.visitas || []) : [];

    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col h-full w-full">
            <div className="px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-card-foreground">Interesses e Visitas</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                    {imoveis.length} {imoveis.length === 1 ? "imóvel" : "imóveis"} • {visitas.length} {visitas.length === 1 ? "visita" : "visitas"}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">

                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Imóveis ({imoveis.length})
                    </h3>

                    {imoveis.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic text-center py-2 bg-muted/30 rounded-lg border border-dashed border-border">Nenhum imóvel vinculado.</p>
                    ) : (
                        <div className="space-y-3">
                            {imoveis.map((property) => (
                                <div onClick={() => navigate(`/properties/${property.id}`)} key={property.id}
                                     className="rounded-lg cursor-pointer border border-border p-3 hover:bg-muted/50 hover:border-primary/30 transition-colors">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center shrink-0">
                                                <Home className="w-4 h-4 text-secondary-foreground" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-card-foreground leading-tight line-clamp-1">{property.name}</p>
                                                <p className="text-[11px] text-muted-foreground line-clamp-1">{property.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold text-primary mb-2">{formatCurrency(property.valor)}</p>
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-[11px] text-muted-foreground">
                                        <span className="flex items-center gap-2">
                                            <Bed className="w-3.5 h-3.5" /> {property.quartos} Quartos
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Car className="w-3.5 h-3.5" /> {property.vagas} Vagas
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Bath className="w-3.5 h-3.5" /> {property.banheiros} Banh.
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Maximize className="w-3.5 h-3.5" /> {property.area} m²
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        Visitas Agendadas ({visitas.length})
                    </h3>

                    {visitas.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic text-center py-2 bg-muted/30 rounded-lg border border-dashed border-border">Nenhuma visita agendada.</p>
                    ) : (
                        <div className="space-y-3">
                            {visitas.map((visita) => (
                                <div key={visita.id} className="rounded-lg border border-border p-3 bg-muted/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                                            <Calendar className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-card-foreground">
                                                {/* Usando o date-fns que discutimos antes! */}
                                                {format(new Date(visita.data), "dd 'de' MMMM", { locale: ptBR })}
                                            </p>
                                            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {format(new Date(visita.data), "HH:mm", { locale: ptBR })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-border/50">
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 line-clamp-1">
                                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                                            {visita.imovel?.name || "Imóvel não especificado"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            <div className="p-4 border-t border-border space-y-2 bg-card">
                <Button
                    onClick={() => navigate(`/visits/new?leadId=${leadId}`)}
                    className="w-full justify-start gap-2 h-9 text-xs"
                    variant="default"
                >
                    <CalendarPlus className="w-3.5 h-3.5" />
                    Marcar Visita
                </Button>
            </div>
        </div>
    );
};

export default PropertyPanel;