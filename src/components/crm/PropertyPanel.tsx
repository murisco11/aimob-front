import { Bed, Bath, Maximize, CalendarPlus, CheckCircle2, FileText, Home } from "lucide-react";
import { Property } from "@/data/mockData";
import { Button } from "@/components/ui/button";

interface PropertyPanelProps {
  properties: Property[];
}

const statusStyles = {
  active: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warm",
  sold: "bg-muted text-muted-foreground",
};

const PropertyPanel = ({ properties }: PropertyPanelProps) => {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-card-foreground">Active Properties</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{properties.length} listings</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
        {properties.map((property) => (
          <div key={property.id} className="rounded-lg border border-border p-3 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center">
                  <Home className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground leading-tight">{property.title}</p>
                  <p className="text-[11px] text-muted-foreground">{property.address}</p>
                </div>
              </div>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full capitalize ${statusStyles[property.status]}`}>
                {property.status}
              </span>
            </div>
            <p className="text-sm font-semibold text-primary mb-2">{property.price}</p>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{property.beds} bed</span>
              <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{property.baths} bath</span>
              <span className="flex items-center gap-1"><Maximize className="w-3 h-3" />{property.sqft} ft²</span>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-border space-y-2">
        <Button className="w-full justify-start gap-2 h-9 text-xs" variant="default">
          <CalendarPlus className="w-3.5 h-3.5" />
          Schedule Visit
        </Button>
        <Button className="w-full justify-start gap-2 h-9 text-xs" variant="outline">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Mark as Sold
        </Button>
        <Button className="w-full justify-start gap-2 h-9 text-xs" variant="outline">
          <FileText className="w-3.5 h-3.5" />
          Generate Follow-up Script
        </Button>
      </div>
    </div>
  );
};

export default PropertyPanel;
