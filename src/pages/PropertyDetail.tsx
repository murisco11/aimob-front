import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  ArrowLeft, Bed, Bath, Car, Maximize, DollarSign, FileText,
  Brain, CheckCircle2, Home, MapPin, Image as ImageIcon,
  CalendarPlus, Users, Loader2, Upload,
  MoreVertical, Trash2, Edit, House, Refrigerator, Dog, Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useImovel } from "@/hooks/useImovel";
import { useMidia } from "@/hooks/useMidia";
import { useLead } from "@/hooks/useLead";
import { useChat } from "@/hooks/useChat"; 

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useConfirmStore } from "@/stores/confirmStore";

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

  const { selectedImovel: imovel, isLoading, fetchByIdImovel, deleteImovel } = useImovel();
  const { createMidia, isLoading: isUploading, deleteMidia } = useMidia();
  const { leads, fetchAllLead } = useLead();
  const { openConfirm } = useConfirmStore()
  const { sendMessage } = useChat();

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [selectedMediaToShare, setSelectedMediaToShare] = useState<any>(null);
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [isSendingToLeads, setIsSendingToLeads] = useState(false);

  const [aiTrained] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      fetchByIdImovel(Number(id));
    }
    fetchAllLead();
  }, [id, fetchByIdImovel, fetchAllLead]);

  const handleSendMediaClick = (midia: any) => {
    setSelectedMediaToShare(midia);
    setSelectedLeads([]);

    setTimeout(() => {
      setIsLeadModalOpen(true);
    }, 150);
  };

  const toggleLeadSelection = (leadId: number) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const confirmSendMediaToLeads = async () => {
    if (!selectedMediaToShare || selectedLeads.length === 0) return;

    setIsSendingToLeads(true);

    try {
      const leadsToSend = leads.filter(l => selectedLeads.includes(l.id));
      let sucessoCount = 0;

      const promessasDeEnvio = leadsToSend.map(async (lead) => {
        const conversaId = lead.conversas?.[0]?.id;

        if (!conversaId) {
          toast({
            title: "Aviso",
            description: `O lead ${lead.name} não possui um chat ativo.`,
            variant: "destructive"
          });
          return;
        }

        try {
          await sendMessage({
            conversaId: conversaId,
            text: ``,
            media: {
              type: 'image',
              base64: selectedMediaToShare.base64Data,
              fileName: `imovel_${imovel?.id}_foto.jpg`
            },
            quotedMessageId: undefined
          });
          sucessoCount++;
        } catch (err) {
          console.error(`Erro ao enviar para o lead ${lead.name}:`, err);
        }
      });

      await Promise.all(promessasDeEnvio);

      if (sucessoCount > 0) {
        toast({ title: "Mídia Enviada", description: `Enviada com sucesso para ${sucessoCount} lead(s)!` });
      }

      setIsLeadModalOpen(false);
      setSelectedMediaToShare(null);
      setSelectedLeads([]);
    } catch (error) {
      console.error(error);
      toast({ title: "Erro", description: "Falha ao enviar a mídia.", variant: "destructive" });
    } finally {
      setIsSendingToLeads(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !imovel) return;

    try {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpeg';
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(",")[1];

        await createMidia({ base64Data, extension, imovelId: imovel.id });

        toast({ title: "Mídia adicionada", description: "Imagem enviada com sucesso!" });
        if (id) fetchByIdImovel(Number(id));
      };
    } catch (error) {
      toast({ title: "Erro", description: "Ocorreu um erro ao enviar a imagem.", variant: "destructive" });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteMedia = async (idMidia: number) => {
    try {
      await deleteMidia(idMidia);
      toast({ title: "Mídia removida", description: "Imagem removida com sucesso!" });
      if (id) fetchByIdImovel(Number(id));
    } catch (error) {
      toast({ title: "Erro", description: "Ocorreu um erro ao remover a imagem.", variant: "destructive" });
    }
  }

  const handleDeleteImovel = () => {
    setTimeout(async () => {
      try {
        await openConfirm({
          title: "Excluir Imóvel",
          description: `Tem certeza que deseja excluir permanentemente o imóvel? Esta ação não pode ser desfeita.`,
          confirmText: "Sim, Excluir",
          onConfirm: async () => {
            await deleteImovel(Number(id));
            toast({
              title: "Sucesso",
              description: "Imóvel deletado com sucesso",
            });
            navigate("/properties")
          }
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao deletar imóvel",
          variant: "destructive"
        });
        console.error("Delete error:", error);
      }
    }, 150);
  }

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

  const coverMedia = imovel.midias && imovel.midias.length > 0 ? imovel.midias[0] : null;
  const coverImageSrc = coverMedia?.base64Data ? `data:image/jpeg;base64,${coverMedia.base64Data}` : null;
  const statusKey = imovel.isActive ? "active" : "inactive";
  const interestedLeads = imovel.leads || [];
  const socialPosts = (imovel as any).posts || [];

  const handleTrainAI = () => navigate("/ai");
  const handleVisit = () => navigate(`/visits/new?imovelId=${id}`);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <CrmSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />
        <div className="flex-1 overflow-y-auto scrollbar-thin">

          <div className="px-6 py-4 border-b border-border flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/properties")} className="gap-1.5 text-xs">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </Button>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <Badge className={`text-[10px] capitalize border ${statusStyles[statusKey]}`} variant="outline">
                {imovel.isActive ? "Ativo" : "Inativo"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-[10px] gap-1"
                onClick={() => navigate(`/properties/edit/${imovel.id}`)}
              >
                <Edit className="w-3 h-3" /> Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-destructive focus:text-destructive focus:bg-destructive/10 px-2 text-[10px] gap-1"
                onClick={handleDeleteImovel}
              >
                <Trash2 className="w-3 h-3" /> Deletar
              </Button>
            </div>
          </div>

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
                    { icon: House, label: "Condomínio", value: formatCurrency(imovel.condominio) },
                    { icon: DollarSign, label: "Comissão", value: `${imovel.comissao} %` },
                    { icon: Refrigerator, label: "Mobiliado", value: imovel.mobiliado ? "Sim" : "Não" },
                    { icon: Dog, label: "Aceita Pet", value: imovel.aceitaPets ? "Sim" : "Não" },
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
                  <p className="text-xs text-muted-foreground mt-3">IPTU: {formatCurrency(imovel.iptu)}</p>
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
                  <Button size="sm" variant="outline" onClick={handleVisit} className="gap-2 text-xs">
                    <CalendarPlus className="w-3.5 h-3.5" /> Agendar Visita
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="info" className="gap-1.5 text-xs"><FileText className="w-3.5 h-3.5" /> Informações</TabsTrigger>
                <TabsTrigger value="leads" className="gap-1.5 text-xs"><Users className="w-3.5 h-3.5" /> Leads Interessados</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-5">
                {imovel.description && (
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h3 className="text-sm font-semibold text-card-foreground mb-2">Descrição Estratégica</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{imovel.description}</p>
                  </div>
                )}
                {imovel.infoProprietario && (
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h3 className="text-sm font-semibold text-card-foreground mb-2">Informações do Proprietário</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{imovel.infoProprietario}</p>
                  </div>
                )}
                {imovel.expectativaVenda && (
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h3 className="text-sm font-semibold text-card-foreground mb-2">Expectativa de venda</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{imovel.expectativaVenda}</p>
                  </div>
                )}

                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-card-foreground">Galeria de Mídia</h3>
                    <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                      {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      Adicionar Foto
                    </Button>
                  </div>

                  {imovel.midias && imovel.midias.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {imovel.midias.map((m: any) => {
                        const imgSrc = m.base64Data ? `data:image/jpeg;base64,${m.base64Data}` : null;
                        return (
                          <div key={m.id} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted group border border-border">
                            {imgSrc ? (
                              <img src={imgSrc} alt={`Mídia ${m.id}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                                <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
                              </div>
                            )}

                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="secondary" size="icon" className="h-7 w-7 bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                                    onSelect={() => handleDeleteMedia(m.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Remover</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onSelect={() => handleSendMediaClick(m)}
                                  >
                                    <Send className="mr-2 h-4 w-4" />
                                    <span>Enviar para Lead</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhuma mídia cadastrada para este imóvel.</p>
                  )}
                </div>
              </TabsContent>

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

            </Tabs>
          </div>
        </div>
      </div>

      <Dialog open={isLeadModalOpen} onOpenChange={setIsLeadModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar Mídia</DialogTitle>
            <DialogDescription>
              Selecione os leads que devem receber esta imagem do imóvel.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[300px] overflow-y-auto space-y-2 mt-2 pr-2 scrollbar-thin">
            {leads.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum lead encontrado.</p>
            ) : (
              leads.map((lead: any) => {
                const isSelected = selectedLeads.includes(lead.id);
                const hasChat = lead.conversas && lead.conversas.length > 0;

                return (
                  <div
                    key={lead.id}
                    onClick={() => hasChat && toggleLeadSelection(lead.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${!hasChat
                      ? 'opacity-50 cursor-not-allowed bg-muted/50'
                      : isSelected
                        ? 'border-primary bg-primary/5 cursor-pointer'
                        : 'border-border hover:border-primary/30 cursor-pointer'
                      }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold shrink-0 uppercase">
                      {lead.name?.substring(0, 2) || "US"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{lead.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{lead.phone || "Sem telefone"}</p>
                      {!hasChat && <p className="text-[10px] text-destructive mt-0.5">Sem chat ativo</p>}
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                  </div>
                )
              })
            )}
          </div>

          <DialogFooter className="mt-4 gap-2 sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setIsLeadModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={confirmSendMediaToLeads}
              disabled={selectedLeads.length === 0 || isSendingToLeads}
              className="gap-2"
            >
              {isSendingToLeads ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Enviar para {selectedLeads.length} Lead(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default PropertyDetail;