import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import { properties } from "@/data/mockData";
import { Home, MapPin, Bed, Bath, Car, Search, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  sold: "bg-muted text-muted-foreground border-border",
};

const Properties = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <CrmSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Header */}
          <div className="px-6 py-5 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-foreground">Imóveis</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {properties.length} imóveis cadastrados
                </p>
              </div>
              <Button className="gap-2 h-9 text-xs shrink-0" onClick={() => navigate("/properties/new")}>
                <Plus className="w-3.5 h-3.5" />
                Novo Imóvel
              </Button>
            </div>

            <div className="flex gap-3 mt-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar imóvel..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2 h-9">
                <Filter className="w-3.5 h-3.5" />
                Filtros
              </Button>
            </div>
          </div>

          {/* Grid */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((property) => (
              <button
                key={property.id}
                onClick={() => navigate(`/properties/${property.id}`)}
                className="text-left bg-card rounded-xl border border-border overflow-hidden hover:border-primary/40 hover:shadow-md transition-all group"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  {property.image ? (
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-10 h-10 text-muted-foreground/40" />
                    </div>
                  )}
                  <Badge
                    className={`absolute top-2 right-2 text-[10px] capitalize border ${statusStyles[property.status]}`}
                    variant="outline"
                  >
                    {property.status}
                  </Badge>
                  {property.aiTrained && (
                    <Badge className="absolute top-2 left-2 text-[10px] bg-primary/90 text-primary-foreground border-0">
                      IA Treinada
                    </Badge>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-sm font-semibold text-card-foreground leading-tight">
                    {property.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {property.address}
                  </p>
                  <p className="text-base font-bold text-primary mt-2">{property.price}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3 h-3" />
                      {property.beds}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-3 h-3" />
                      {property.baths}
                    </span>
                    <span className="flex items-center gap-1">
                      <Car className="w-3 h-3" />
                      {property.garageSpots}
                    </span>
                    <span className="text-muted-foreground/60">
                      {property.sqft} m²
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;
