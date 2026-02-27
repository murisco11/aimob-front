import { useParams, useNavigate } from "react-router-dom";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import { properties, leads } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Bed, Bath, Car, Maximize, DollarSign, FileText,
  Brain, CheckCircle2, Home, MapPin, Instagram, Heart, MessageCircle,
  Clock, Image as ImageIcon, Play, CalendarPlus, Users, Megaphone,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  sold: "bg-muted text-muted-foreground",
};

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const property = properties.find((p) => p.id === id);
  const [aiTrained, setAiTrained] = useState(property?.aiTrained ?? false);

  if (!property) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Imóvel não encontrado.</p>
      </div>
    );
  }

  const interestedLeads = leads.filter((l) => property.interestedLeadIds.includes(l.id));

  const handleTrainAI = () => {
    setAiTrained(true);
    toast({
      title: "IA treinada com sucesso!",
      description: `Os dados de "${property.title}" foram enviados para o cérebro da IA.`,
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
            <Badge className={`text-[10px] capitalize ${statusStyles[property.status]}`} variant="outline">
              {property.status}
            </Badge>
          </div>

          {/* Hero */}
          <div className="px-6 pt-5 pb-2">
            <div className="flex flex-col md:flex-row gap-5">
              <div className="w-full md:w-[360px] shrink-0 aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                {property.image ? (
                  <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-foreground">{property.title}</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" /> {property.address}
                </p>
                <p className="text-2xl font-bold text-primary mt-3">{property.price}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                  {[
                    { icon: Bed, label: "Quartos", value: property.beds },
                    { icon: Bed, label: "Suítes", value: property.suites },
                    { icon: Bath, label: "Banheiros", value: property.baths },
                    { icon: Car, label: "Vagas", value: property.garageSpots },
                    { icon: Maximize, label: "Área", value: `${property.sqft} m²` },
                    { icon: DollarSign, label: "Condomínio", value: property.condoFee },
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

                <p className="text-xs text-muted-foreground mt-3">
                  IPTU: {property.iptu}
                </p>

                {/* Train AI button */}
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
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="text-sm font-semibold text-card-foreground mb-2">Descrição Estratégica</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{property.description}</p>
                </div>

                {/* Media Gallery */}
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="text-sm font-semibold text-card-foreground mb-3">Galeria de Mídia</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {property.media.map((m) => (
                      <div key={m.id} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted group cursor-pointer">
                        {m.type === "photo" && m.url ? (
                          <img src={m.url} alt={m.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                            {m.type === "video" ? (
                              <Play className="w-8 h-8 text-muted-foreground/40" />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
                            )}
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <p className="text-[10px] text-white font-medium">{m.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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
                      {interestedLeads.map((lead) => (
                        <button
                          key={lead.id}
                          onClick={() => navigate("/")}
                          className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors text-left"
                        >
                          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-secondary-foreground shrink-0">
                            {lead.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-card-foreground">{lead.name}</p>
                            <p className="text-[11px] text-muted-foreground truncate">{lead.summary}</p>
                          </div>
                          <Badge
                            className={`text-[10px] capitalize shrink-0 ${
                              lead.status === "hot"
                                ? "bg-destructive/10 text-destructive"
                                : lead.status === "warm"
                                ? "bg-warning/10 text-warning"
                                : "bg-info/10 text-info"
                            }`}
                            variant="outline"
                          >
                            {lead.status}
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
                  {property.socialPosts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhum post vinculado a este imóvel.</p>
                  ) : (
                    <div className="space-y-3">
                      {property.socialPosts.map((post) => (
                        <div key={post.id} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                          <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center shrink-0">
                            <Instagram className="w-5 h-5 text-secondary-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-[10px] capitalize">
                                {post.type}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${
                                  post.status === "posted"
                                    ? "bg-success/10 text-success border-success/20"
                                    : "bg-warning/10 text-warning border-warning/20"
                                }`}
                              >
                                {post.status === "posted" ? "Postado" : "Agendado"}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {post.date}
                              </span>
                            </div>
                            <p className="text-sm text-card-foreground">{post.caption}</p>
                            {post.status === "posted" && (
                              <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" /> {post.likes}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3" /> {post.comments}
                                </span>
                                <Button variant="ghost" size="sm" className="h-6 text-[11px] px-2 text-primary">
                                  Ver métricas do post
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Media Gallery duplicate in marketing for sending */}
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="text-sm font-semibold text-card-foreground mb-3">Galeria de Mídia</h3>
                  <p className="text-xs text-muted-foreground mb-3">Fotos e vídeos profissionais para enviar aos clientes.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {property.media.map((m) => (
                      <div key={m.id} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted group cursor-pointer">
                        {m.type === "photo" && m.url ? (
                          <img src={m.url} alt={m.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                            <Play className="w-8 h-8 text-muted-foreground/40" />
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <p className="text-[10px] text-white font-medium">{m.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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
