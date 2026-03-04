import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import { Home, MapPin, Bed, Bath, Car, Search, Plus, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Importe o hook de onde você o salvou (ajuste o caminho se necessário)
import { useImovel } from "@/hooks/useImovel"; 

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  inactive: "bg-muted text-muted-foreground border-border",
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const Properties = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  
  // Pegando os dados, estado de loading e a função de fetch do seu hook
  const { imoveis, isLoading, fetchAllImovel } = useImovel();

  // Busca os imóveis quando a tela é montada
  useEffect(() => {
    fetchAllImovel();
  }, [fetchAllImovel]);

  // Filtra usando as propriedades reais (name e address)
  const filtered = (imoveis || []).filter(
    (imovel) =>
      imovel.name.toLowerCase().includes(search.toLowerCase()) ||
      (imovel.address && imovel.address.toLowerCase().includes(search.toLowerCase()))
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
                  {imoveis ? imoveis.length : 0} imóveis cadastrados
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

          {/* Grid ou Loading */}
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((imovel) => {
                // Pega a primeira mídia do array
                const primeiraMidia = imovel.midias && imovel.midias.length > 0 ? imovel.midias[0] : null;
                
                const coverImageBase64 = primeiraMidia?.base64Data 
                  ? `data:image/jpeg;base64,${primeiraMidia.base64Data}` 
                  : null;

                const statusKey = imovel.isActive ? "active" : "inactive";

                return (
                  <button
                    key={imovel.id}
                    onClick={() => navigate(`/properties/${imovel.id}`)}
                    className="text-left bg-card rounded-xl border border-border overflow-hidden hover:border-primary/40 hover:shadow-md transition-all group flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] w-full bg-muted overflow-hidden shrink-0">
                      {coverImageBase64 ? (
                        <img
                          src={coverImageBase64}
                          alt={imovel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Home className="w-10 h-10 text-muted-foreground/40" />
                        </div>
                      )}
                      <Badge
                        className={`absolute top-2 right-2 text-[10px] capitalize border ${statusStyles[statusKey]}`}
                        variant="outline"
                      >
                        {imovel.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>

                    {/* Info */}
                    <div className="p-4 flex-1 flex flex-col">
                      <p className="text-sm font-semibold text-card-foreground leading-tight line-clamp-2">
                        {imovel.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {imovel.address || "Endereço não informado"}
                      </p>
                      
                      <div className="mt-auto pt-3">
                        <p className="text-base font-bold text-primary">
                          {formatCurrency(imovel.valor)}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Bed className="w-3 h-3" />
                            {imovel.quartos}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="w-3 h-3" />
                            {imovel.banheiros}
                          </span>
                          <span className="flex items-center gap-1">
                            <Car className="w-3 h-3" />
                            {imovel.vagas}
                          </span>
                          <span className="text-muted-foreground/60">
                            {imovel.area ? `${imovel.area} m²` : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;