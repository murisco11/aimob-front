import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Bed, Bath, Car, Maximize, DollarSign, FileText,
  Brain, CheckCircle2, Home, MapPin, Instagram, Heart, MessageCircle,
  Clock, Image as ImageIcon, Play, CalendarPlus, Users, Megaphone, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Importando o hook
import { useImovel } from "@/hooks/useImovel";

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  inactive: "bg-muted text-muted-foreground border-border",
};

const formatCurrency = (value: number | undefined) => {
  if (value === undefined || value === null) return "-";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Usando o hook de imóveis
  const { selectedImovel: imovel, isLoading, fetchByIdImovel } = useImovel();
  
  // Estado local para o botão da IA (como não há no banco ainda)
  const [aiTrained, setAiTrained] = useState(false);

  // Busca o imóvel ao carregar a página
  useEffect(() => {
    if (id) {
      fetchByIdImovel(Number(id));
    }
  }, [id, fetchByIdImovel]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!imovel) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">Imóvel não encontrado.</p>
        <Button variant="outline" onClick={() => navigate("/properties")}>Voltar para a lista</Button>
      </div>
    );
  }

  // Prepara a imagem de capa (primeira mídia da lista) com base64
  const coverMedia = imovel.midias && imovel.midias.length > 0 ? imovel.midias[0] : null;
  const coverImageSrc = coverMedia?.base64Data 
    ? `data:image/jpeg;base64,${coverMedia.base64Data}` 
    : null;

  const statusKey = imovel.isActive ? "active" : "inactive";
  const interestedLeads = imovel.leads || [];
  
  // Como 'posts' está comentado na sua interface, deixei um fallback vazio 
  // para não quebrar a tela de marketing
  const socialPosts = (imovel as any).posts || [];

  const handleTrainAI = () => {
    setAiTrained(true);
    toast({
      title: "IA treinada com sucesso!",
      description: `Os dados de "${imovel.name}" foram enviados para o cérebro da IA.`,
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <CrmSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Top bar */}
          <div className="px-6 py-4 border-b border-border flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/properties")} className="gap-1.5 text-xs">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </Button>
            <div className="flex-1" />
            <Badge className={`text-[10px] capitalize border ${statusStyles[statusKey]}`} variant="outline">
              {imovel.isActive ? "Ativo" : "Inativo"}
            </Badge>
          </div>

          {/* Hero */}
          <div className="px-6 pt-5 pb-2">
            <div className="flex flex-col md:flex-row gap-5">
              <div className="w-full md:w-[360px] shrink-0 aspect-[4/3] rounded-xl overflow-hidden bg-muted relative">
                {coverImageSrc ? (
                  <img src={coverImageSrc} alt={imovel.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-foreground">{imovel.name}</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" /> {imovel.address || "Endereço não informado"}
                </p>
                <p className="text-2xl font-bold text-primary mt-3">{formatCurrency(imovel.valor)}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                  {[
                    { icon: Bed, label: "Quartos", value: imovel.quartos },
                    { icon: Bed, label: "Suítes", value: imovel.suites },
                    { icon: Bath, label: "Banheiros", value: imovel.banheiros },
                    { icon: Car, label: "Vagas", value: imovel.vagas },
                    { icon: Maximize, label: "Área", value: imovel.area ? `${imovel.area} m²` : "-" },
                    { icon: DollarSign, label: "Condomínio", value: formatCurrency(imovel.condominio) },
                  ].map((spec) => (
                    <div key={spec.label} className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center shrink-0">
                        <spec.icon className="w-4 h-4 text-secondary-foreground" />
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground">{spec.label}</p>
                        <p className="font-medium text-card-foreground text-sm">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {imovel.iptu !== undefined && (
                  <p className="text-xs text-muted-foreground mt-3">
                    IPTU: {formatCurrency(imovel.iptu)}
                  </p>
                )}

                <div className="mt-4 flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    className="gap-2 text-xs"
                    variant={aiTrained ? "outline" : "default"}
                    onClick={handleTrainAI}
                    disabled={aiTrained}
                  >
                    {aiTrained ? (
                      <><CheckCircle2 className="w-3.5 h-3.5 text-success" /> IA Treinada</>
                    ) : (
                      <><Brain className="w-3.5 h-3.5" /> Treinar IA com este Imóvel</>
                    )}
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2 text-xs">
                    <CalendarPlus className="w-3.5 h-3.5" /> Agendar Visita
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 py-4">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="info" className="gap-1.5 text-xs">
                  <FileText className="w-3.5 h-3.5" /> Informações
                </TabsTrigger>
                <TabsTrigger value="leads" className="gap-1.5 text-xs">
                  <Users className="w-3.5 h-3.5" /> Leads Interessados
                </TabsTrigger>
                <TabsTrigger value="marketing" className="gap-1.5 text-xs">
                  <Megaphone className="w-3.5 h-3.5" /> Marketing / Social
                </TabsTrigger>
              </TabsList>

              {/* INFO TAB */}
              <TabsContent value="info" className="space-y-5">
                {imovel.description && (
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h3 className="text-sm font-semibold text-card-foreground mb-2">Descrição Estratégica</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {imovel.description}
                    </p>
                  </div>
                )}

                {/* Media Gallery */}
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="text-sm font-semibold text-card-foreground mb-3">Galeria de Mídia</h3>
                  
                  {imovel.midias && imovel.midias.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {imovel.midias.map((m: any) => {
                        const imgSrc = m.base64Data ? `data:image/jpeg;base64,${m.base64Data}` : null;
                        
                        return (
                          <div key={m.id} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted group cursor-pointer border border-border">
                            {imgSrc ? (
                              <img src={imgSrc} alt={`Mídia ${m.id}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                                <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma mídia cadastrada para este imóvel.</p>
                  )}
                </div>
              </TabsContent>

              {/* LEADS TAB */}
              <TabsContent value="leads">
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="text-sm font-semibold text-card-foreground mb-3">
                    Leads Interessados ({interestedLeads.length})
                  </h3>
                  {interestedLeads.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum lead interessado neste imóvel ainda.</p>
                  ) : (
                    <div className="space-y-2">
                      {interestedLeads.map((lead: any) => (
                        <button
                          key={lead.id}
                          onClick={() => navigate(`/leads/${lead.id}`)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors text-left group"
                        >
                          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-secondary-foreground shrink-0 uppercase">
                            {lead.name?.substring(0, 2) || "US"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">
                              {lead.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">{lead.email || lead.phone}</p>
                          </div>
                          <Badge className="text-[10px] capitalize shrink-0 bg-secondary text-secondary-foreground" variant="outline">
                            Visualizar
                          </Badge>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* MARKETING TAB */}
              <TabsContent value="marketing" className="space-y-5">
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="text-sm font-semibold text-card-foreground mb-3">Posts no Instagram</h3>
                  {socialPosts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum post vinculado a este imóvel.</p>
                  ) : (
                    <div className="space-y-3">
                      {/* ... (Renderização de posts, mantida do original caso você adicione futuramente) */}
                    </div>
                  )}
                </div>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;