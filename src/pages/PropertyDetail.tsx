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
    MoreVertical, Trash2, Edit, House, Refrigerator, Dog, Send,
    CheckSquare, Circle, Search, Rows3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useImovel } from "@/hooks/useImovel";
import { useMidia } from "@/hooks/useMidia";
import { useLead } from "@/hooks/useLead";
import { useChat } from "@/hooks/useChat";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useConfirmStore } from "@/stores/confirmStore";
import { ExpandableImage } from "@/components/ExpandableImage";
import { MidiaGalleryReorder } from "@/components/MidiaGalleryReorder";

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
    const { uploadMidia, isLoading: isUploading, deleteMidia, reorderMidias } = useMidia();
    const { leads, fetchAllLead } = useLead();
    const { openConfirm } = useConfirmStore();
    const { sendMessage } = useChat();

    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
    const [selectedMediaToShare, setSelectedMediaToShare] = useState<any[]>([]);
    const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
    const [isSendingToLeads, setIsSendingToLeads] = useState(false);
    const [leadSearch, setLeadSearch] = useState("");

    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedMediaIds, setSelectedMediaIds] = useState<number[]>([]);

    const [aiTrained] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (id) {
            fetchByIdImovel(Number(id));
        }
        fetchAllLead();
    }, [id, fetchByIdImovel, fetchAllLead]);


    const toggleMediaSelection = (mediaId: number) => {
        setSelectedMediaIds((prev) =>
            prev.includes(mediaId) ? prev.filter(id => id !== mediaId) : [...prev, mediaId]
        );
    };

    const handleSendSingleMediaClick = (midia: any) => {
        setSelectedMediaToShare([midia]);
        setSelectedLeads([]);
        setLeadSearch("");
        setTimeout(() => setIsLeadModalOpen(true), 150);
    };

    const handleBulkSendClick = () => {
        if (!imovel?.midias) return;
        const mediaObjects = imovel.midias.filter((m: any) => selectedMediaIds.includes(m.id));
        setSelectedMediaToShare(mediaObjects);
        setSelectedLeads([]);
        setLeadSearch("");
        setIsLeadModalOpen(true);
    };

    const handleBulkDeleteClick = () => {
        if (selectedMediaIds.length === 0) return;
        openConfirm({
            title: "Excluir Mídias",
            description: `Tem certeza que deseja excluir ${selectedMediaIds.length} mídia(s)? Esta ação não pode ser desfeita.`,
            confirmText: "Sim, Excluir",
            onConfirm: async () => {
                try {
                    await Promise.all(selectedMediaIds.map(mediaId => deleteMidia(mediaId)));
                    toast({ title: "Sucesso", description: "Mídias deletadas com sucesso!", variant: "success" });

                    setSelectedMediaIds([]);
                    setIsSelectionMode(false);
                    if (id) fetchByIdImovel(Number(id));
                } catch (error) {
                    toast({ title: "Erro", description: "Ocorreu um erro ao remover as imagens.", variant: "destructive" });
                }
            }
        });
    };

    // --- RESTANTE DAS FUNÇÕES ---

    const toggleLeadSelection = (leadId: number) => {
        setSelectedLeads((prev) =>
            prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
        );
    };

    const confirmSendMediaToLeads = async () => {
        if (selectedMediaToShare.length === 0 || selectedLeads.length === 0) return;

        setIsSendingToLeads(true);

        try {
            const leadsToSend = leads.filter(l => selectedLeads.includes(l.id));
            let enviosRealizados = 0;
            const promessasDeEnvio: Promise<any>[] = [];

            for (const lead of leadsToSend) {
                const conversaId = lead.conversas?.[0]?.id;
                if (!conversaId) {
                    toast({
                        title: "Aviso",
                        description: `O lead ${lead.name} não possui um chat ativo.`,
                        variant: "destructive"
                    });
                    continue;
                }

                for (const media of selectedMediaToShare) {
                    const promise = sendMessage({
                        conversaId: conversaId,
                        text: ``,
                        media: {
                            type: 'image',
                            base64: media.base64Data,
                            fileName: `imovel_${imovel?.id}_foto_${media.id}.jpg`
                        },
                        quotedMessageId: undefined
                    }).then(() => enviosRealizados++);

                    promessasDeEnvio.push(promise);
                }
            }

            await Promise.all(promessasDeEnvio);

            if (enviosRealizados > 0) {
                toast({
                    title: "Mídia(s) Enviada(s)",
                    description: `Foram realizados ${enviosRealizados} envios com sucesso!`,
                    variant: "success"
                });
            }

            setIsLeadModalOpen(false);
            setSelectedMediaToShare([]);
            setSelectedLeads([]);
            setIsSelectionMode(false);
            setSelectedMediaIds([]);

        } catch (error) {
            console.error(error);
            toast({ title: "Erro", description: "Falha ao enviar a(s) mídia(s).", variant: "destructive" });
        } finally {
            setIsSendingToLeads(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0 || !imovel) return;

        try {
            const uploadPromises = Array.from(files).map(file => uploadMidia(file, imovel.id));
            await Promise.all(uploadPromises);

            toast({
                title: files.length > 1 ? "Mídias adicionadas" : "Mídia adicionada",
                description: files.length > 1 ? `${files.length} imagens enviadas com sucesso!` : "Imagem enviada com sucesso!",
                variant: "success"
            });

            if (id) fetchByIdImovel(Number(id));

        } catch (error) {
            toast({
                title: "Erro",
                description: "Ocorreu um erro ao enviar as imagens.",
                variant: "destructive"
            });
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDeleteSingleMedia = async (idMidia: number) => {
        try {
            await deleteMidia(idMidia);
            toast({ title: "Mídia removida", description: "Imagem removida com sucesso!", variant: "success" });
            if (id) fetchByIdImovel(Number(id));
        } catch (error) {
            toast({ title: "Erro", description: "Ocorreu um erro ao remover a imagem.", variant: "destructive" });
        }
    };

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
                            variant: "success"
                        });
                        navigate("/properties");
                    }
                });
            } catch (error) {
                toast({
                    title: "Erro",
                    description: "Erro ao deletar imóvel",
                    variant: "destructive"
                });
            }
        }, 150);
    };

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
    const coverImageSrc = coverMedia?.url;
    const statusKey = imovel.isActive ? "active" : "inactive";
    const interestedLeads = imovel.leads || [];

    const handleTrainAI = () => navigate("/ai");
    const handleVisit = () => navigate(`/visits/new?imovelId=${id}`);

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <CrmSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <MobileHeader />
                <div className="flex-1 overflow-y-auto scrollbar-thin">

                    <div className="px-6 py-4 border-b border-border flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate("/properties")}
                            className="gap-1.5 text-xs">
                            <ArrowLeft className="w-4 h-4" /> Voltar
                        </Button>
                        <div className="flex-1" />
                        <div className="flex items-center gap-2">
                            <Badge className={`text-[10px] capitalize border ${statusStyles[statusKey]}`}
                                variant="outline">
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
                            <div
                                className="w-full md:w-[360px] shrink-0 aspect-[4/3] rounded-xl overflow-hidden bg-muted relative">
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
                                        {
                                            icon: Bed,
                                            label: "Quartos",
                                            value: imovel.quartos ? imovel.quartos : "Não informado"
                                        },
                                        {
                                            icon: Bed,
                                            label: "Suítes",
                                            value: imovel.suites ? imovel.suites : "Não informado"
                                        },
                                        {
                                            icon: Bath,
                                            label: "Banheiros",
                                            value: imovel.banheiros ? imovel.banheiros : "Não informado"
                                        },
                                        {
                                            icon: Car,
                                            label: "Vagas",
                                            value: imovel.vagas ? imovel.vagas : "Não informado"
                                        },
                                        { icon: Maximize, label: "Área", value: imovel.area ? `${imovel.area} m²` : "-" },
                                        { icon: House, label: "Condomínio", value: formatCurrency(imovel.condominio) },
                                        {
                                            icon: DollarSign,
                                            label: "Comissão",
                                            value: imovel.comissao ? `${imovel.comissao} %` : "Não informado"
                                        },
                                        {
                                            icon: Refrigerator,
                                            label: "Mobiliado",
                                            value: imovel.mobiliado ? "Sim" : "Não"
                                        },
                                        { icon: Dog, label: "Aceita Pet", value: imovel.aceitaPets ? "Sim" : "Não" },
                                    ].map((spec) => (
                                        <div key={spec.label} className="flex items-center gap-2 text-sm">
                                            <div
                                                className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center shrink-0">
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
                                <TabsTrigger value="info" className="gap-1.5 text-xs"><FileText
                                    className="w-3.5 h-3.5" /> Informações</TabsTrigger>
                                <TabsTrigger value="leads" className="gap-1.5 text-xs"><Users
                                    className="w-3.5 h-3.5" /> Leads Interessados</TabsTrigger>
                            </TabsList>

                            <TabsContent value="info" className="space-y-5">
                                {imovel.description && (
                                    <div className="bg-card rounded-xl border border-border p-5">
                                        <h3 className="text-sm font-semibold text-card-foreground mb-2">Descrição
                                            Estratégica</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{imovel.description}</p>
                                    </div>
                                )}
                                {imovel.infoProprietario && (
                                    <div className="bg-card rounded-xl border border-border p-5">
                                        <h3 className="text-sm font-semibold text-card-foreground mb-2">Informações do
                                            Proprietário</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{imovel.infoProprietario}</p>
                                    </div>
                                )}
                                {imovel.expectativaVenda && (
                                    <div className="bg-card rounded-xl border border-border p-5">
                                        <h3 className="text-sm font-semibold text-card-foreground mb-2">Expectativa de
                                            venda</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{imovel.expectativaVenda}</p>
                                    </div>
                                )}

                                <div className="bg-card rounded-xl border border-border p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                        <h3 className="text-sm font-semibold text-card-foreground">Galeria de Mídia</h3>

                                        <div className="flex flex-wrap items-center gap-2">
                                            <input type="file" className="hidden" ref={fileInputRef} accept="image/*" multiple onChange={handleFileUpload} />

                                            {isSelectionMode ? (
                                                <>
                                                    <span className="text-xs text-muted-foreground font-medium mr-2">
                                                        {selectedMediaIds.length} selecionada(s)
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="gap-1.5 text-xs"
                                                        disabled={selectedMediaIds.length === 0}
                                                        onClick={handleBulkDeleteClick}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" /> Excluir
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        className="gap-1.5 text-xs"
                                                        disabled={selectedMediaIds.length === 0}
                                                        onClick={handleBulkSendClick}
                                                    >
                                                        <Send className="w-3.5 h-3.5" /> Enviar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="gap-1.5 text-xs"
                                                        onClick={() => {
                                                            setIsSelectionMode(false);
                                                            setSelectedMediaIds([]);
                                                        }}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="gap-1.5 text-xs"
                                                        onClick={() => setIsReorderModalOpen(true)}
                                                        disabled={!imovel.midias || imovel.midias.length <= 1}
                                                    >
                                                        <Rows3 className="w-3.5 h-3.5" /> Reordenar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="gap-1.5 text-xs"
                                                        onClick={() => setIsSelectionMode(true)}
                                                        disabled={!imovel.midias || imovel.midias.length === 0}
                                                    >
                                                        <CheckSquare className="w-3.5 h-3.5" /> Selecionar Múltiplas
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="gap-1.5 text-xs"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        disabled={isUploading}
                                                    >
                                                        {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                                        Adicionar Foto
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {imovel.midias && imovel.midias.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {imovel.midias.map((m: any) => {
                                                const imgSrc = m?.url;
                                                const isSelected = selectedMediaIds.includes(m.id);

                                                return (
                                                    <div
                                                        key={m.id}
                                                        className={`relative aspect-[4/3] rounded-lg overflow-hidden bg-muted group border transition-all ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                                                            }`}
                                                    >
                                                        {imgSrc ? (
                                                            isSelectionMode ? (
                                                                <img
                                                                    src={imgSrc}
                                                                    alt="Galeria"
                                                                    className={`w-full h-full object-cover cursor-pointer transition-opacity ${isSelected ? 'opacity-60' : 'hover:opacity-90'}`}
                                                                    onClick={() => toggleMediaSelection(m.id)}
                                                                />
                                                            ) : (
                                                                <ExpandableImage
                                                                    src={imgSrc}
                                                                    alt="Galeria"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            )
                                                        ) : (
                                                            <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                                                                <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
                                                            </div>
                                                        )}

                                                        {isSelectionMode && (
                                                            <div
                                                                className="absolute top-2 left-2 z-10 cursor-pointer"
                                                                onClick={() => toggleMediaSelection(m.id)}
                                                            >
                                                                {isSelected ? (
                                                                    <CheckCircle2 className="w-5 h-5 text-primary bg-background rounded-full" />
                                                                ) : (
                                                                    <Circle className="w-5 h-5 text-white bg-black/20 rounded-full" />
                                                                )}
                                                            </div>
                                                        )}

                                                        {!isSelectionMode && (
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
                                                                            onSelect={() => handleDeleteSingleMedia(m.id)}
                                                                        >
                                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                                            <span>Remover</span>
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            className="cursor-pointer"
                                                                            onSelect={() => handleSendSingleMediaClick(m)}
                                                                        >
                                                                            <Send className="mr-2 h-4 w-4" />
                                                                            <span>Enviar para Lead</span>
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
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

                            <TabsContent value="leads">
                                <div className="bg-card rounded-xl border border-border p-5">
                                    <h3 className="text-sm font-semibold text-card-foreground mb-3">
                                        Leads Interessados ({interestedLeads.length})
                                    </h3>
                                    {interestedLeads.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">Nenhum lead interessado neste
                                            imóvel ainda.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {interestedLeads.map((lead: any) => (
                                                <button
                                                    key={lead.id}
                                                    onClick={() => navigate(`/leads/${lead.id}`)}
                                                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors text-left group"
                                                >
                                                    <div
                                                        className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-secondary-foreground shrink-0 uppercase">
                                                        {lead.name?.substring(0, 2) || "US"}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors">
                                                            {lead.name}
                                                        </p>
                                                        <p className="text-[11px] text-muted-foreground truncate">{lead.email || lead.phone}</p>
                                                    </div>
                                                    <Badge
                                                        className="text-[10px] capitalize shrink-0 bg-secondary text-secondary-foreground"
                                                        variant="outline">
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
                        <DialogTitle>Enviar Mídia(s)</DialogTitle>
                        <DialogDescription>
                            Selecione os leads que devem receber {selectedMediaToShare.length === 1 ? "esta imagem" : `as ${selectedMediaToShare.length} imagens selecionadas`}.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Searchbar */}
                    <div className="relative mt-2 mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={leadSearch}
                            onChange={(e) => setLeadSearch(e.target.value)}
                            placeholder="Buscar lead..."
                            className="w-full pl-9 pr-3 py-2 text-sm bg-muted rounded-md border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        />
                    </div>

                    <div className="max-h-[260px] overflow-y-auto space-y-2 pr-2 scrollbar-thin">
                        {(() => {
                            const filteredLeads = leads.filter((l: any) =>
                                l.name?.toLowerCase().includes(leadSearch.toLowerCase())
                            );
                            if (filteredLeads.length === 0) return (
                                <p className="text-sm text-muted-foreground text-center py-4">Nenhum lead encontrado.</p>
                            );
                            return filteredLeads.map((lead: any) => {
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
                                );
                            });
                        })()}
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
                            {isSendingToLeads ? <Loader2 className="w-4 h-4 animate-spin" /> :
                                <Send className="w-4 h-4" />}
                            Enviar para {selectedLeads.length} Lead(s)
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isReorderModalOpen} onOpenChange={setIsReorderModalOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Reordenar Mídias</DialogTitle>
                        <DialogDescription>
                            Arraste as mídias para reordenar. A ordem será atualizada automaticamente.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 max-h-[500px] overflow-y-auto">
                        {imovel?.midias && imovel.midias.length > 0 && (
                            <MidiaGalleryReorder
                                midias={imovel.midias}
                                onReorder={async (orderedMidias) => {
                                    await reorderMidias(imovel.id, orderedMidias);
                                    if (id) fetchByIdImovel(Number(id));
                                }}
                                onDelete={deleteMidia}
                            />
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsReorderModalOpen(false)}>
                            Fechar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default PropertyDetail;