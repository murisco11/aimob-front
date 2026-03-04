import { Bed, Bath, Maximize, CalendarPlus, CheckCircle2, FileText, Home, Car } from "lucide-react";
import { Property } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Lead } from "@/services/types";
import { useEffect, useState } from "react";
import { Imovel } from "@/types/ImovelType";
import { useNavigate } from "react-router-dom";
import { useLead } from "@/hooks/useLead";

interface PropertyPanelProps {
  leadId: number
}

const statusStyles = {
  active: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warm",
  sold: "bg-muted text-muted-foreground",
};

const PropertyPanel = ({ leadId }: PropertyPanelProps) => {
  const navigate = useNavigate()
  const { selectedLead, fetchByIdLead, isLoading } = useLead();

  useEffect(() => {
    if (leadId) {
      fetchByIdLead(leadId);
    }
  }, [leadId, fetchByIdLead]);

  const imoveis: Imovel[] = selectedLead?.id === leadId ? (selectedLead.imoveis || []) : [];

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-card-foreground">Imóveis ativos do Lead</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{imoveis.length} {imoveis.length === 1 ? "Imóvel" : "Imóveis  "}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
        {imoveis.map((property) => (
          <div key={property.id} className="rounded-lg border border-border p-3 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center">
                  <Home className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground leading-tight">{property.name}</p>
                  <p className="text-[11px] text-muted-foreground">{property.address}</p>
                </div>
              </div>
            </div>
            <p className="text-sm font-semibold text-primary mb-2">{property.valor}</p>
            <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-2">
                <Bed className="w-3.5 h-3.5" />
                {property.quartos} Quartos
              </span>
              <span className="flex items-center gap-2">
                <Car className="w-3.5 h-3.5" />
                {property.vagas} Vagas
              </span>
              <span className="flex items-center gap-2">
                <Bed className="w-3.5 h-3.5" />
                {property.suites} Suítes
              </span>
              <span className="flex items-center gap-2">
                <Bath className="w-3.5 h-3.5" />
                {property.banheiros} Banheiros
              </span>
              <span className="flex items-center gap-2">
                <Maximize className="w-3.5 h-3.5" />
                {property.area} m²
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border space-y-2">
        <Button onClick={() => navigate(`/visits/new?leadId=${leadId}`)} className="w-full justify-start gap-2 h-9 text-xs" variant="default">
          <CalendarPlus className="w-3.5 h-3.5" />
          Marcar Visita
        </Button>
        {/* <Button className="w-full justify-start gap-2 h-9 text-xs" variant="outline">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Marcar como vendido
        </Button> */}

        {/* <Button className="w-full justify-start gap-2 h-9 text-xs" variant="outline">
          <FileText className="w-3.5 h-3.5" />
          Gerar Follow-Up
        </Button> */}
      </div>
    </div>
  );
};

export default PropertyPanel;
