import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Brain, Upload, Trash2, FileText, MessageCircle, Save,
    Bot, Thermometer, Database, Users, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Importando todos os nossos Hooks reais
import { useAiAssistant } from "@/hooks/useAiAssistant";
import { useAiAssistantFile } from "@/hooks/useAiAssistantFile";
import { useImovel } from "@/hooks/useImovel";
import { useLead } from "@/hooks/useLead";

const AIConfig = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const ASSISTANT_ID = 1;

    const {
        selectedAiAssistant,
        fetchByIdAiAssistant,
        updateAiAssistant,
        uploadFile,
        isLoading: isSaving
    } = useAiAssistant();

    const {
        files,
        fetchFilesByAssistant,
        deleteFile,
        isLoading: isFilesLoading
    } = useAiAssistantFile();

    const {
        imoveis,
        fetchAllImovel,
        isLoading: isImoveisLoading
    } = useImovel();

    const {
        leads,
        fetchAllLead,
        isLoading: isLeadsLoading
    } = useLead();

    // Estados locais para os formulários
    const [prompt, setPrompt] = useState("");
    const [temperature, setTemperature] = useState([70]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadPropertyId, setUploadPropertyId] = useState<string>("");

    // Busca inicial de todos os dados
    useEffect(() => {
        fetchByIdAiAssistant(ASSISTANT_ID);
        fetchFilesByAssistant(ASSISTANT_ID);
        fetchAllImovel();
        fetchAllLead();
    }, [fetchByIdAiAssistant, fetchFilesByAssistant, fetchAllImovel, fetchAllLead]);

    // Sincroniza o estado local quando a IA é carregada
    useEffect(() => {
        if (selectedAiAssistant) {
            setPrompt(selectedAiAssistant.prompt || "");
            setTemperature([selectedAiAssistant.temperature || 70]);
        }
    }, [selectedAiAssistant]);

    // ====== Ações de Arquivo ======
    const handleDeleteFile = async (idFile: number) => {
        try {
            await deleteFile(idFile);
            toast({ title: "Arquivo removido", description: "O arquivo foi deletado com sucesso." });
        } catch (error) {
            toast({ title: "Erro", description: "Não foi possível remover o arquivo.", variant: "destructive" });
        }
    };

    const processFile = async (file: File) => {
        if (!uploadPropertyId) {
            toast({ title: "Atenção", description: "Selecione um imóvel antes de enviar.", variant: "destructive" });
            return;
        }

        try {
            await uploadFile(ASSISTANT_ID, file);
            toast({ title: "Sucesso", description: `Arquivo ${file.name} enviado.` });
            await fetchFilesByAssistant(ASSISTANT_ID);
            setUploadPropertyId(""); // Limpa seleção
        } catch (error) {
            toast({ title: "Erro", description: "Falha ao enviar arquivo.", variant: "destructive" });
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    // ====== Salvar Configurações ======
    const handleSave = async () => {
        try {
            await updateAiAssistant(ASSISTANT_ID, {
                prompt,
                temperature: temperature[0]
            });
            toast({ title: "Configurações salvas!", description: "IA atualizada com sucesso." });
        } catch (error) {
            toast({ title: "Erro", description: "Não foi possível salvar as configurações.", variant: "destructive" });
        }
    };

    // Lógica visual da Temperatura
    const displayTemp = (temperature[0] / 100).toFixed(2);
    const tempLabel = temperature[0] <= 30
        ? "Mais Preciso / Focado"
        : temperature[0] <= 70
            ? "Equilibrado"
            : "Mais Criativo / Conversacional";

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <CrmSidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <MobileHeader />
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                    <div className="px-6 py-5 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-foreground">Inteligência Artificial</h1>
                                <p className="text-xs text-muted-foreground">
                                    Configure o comportamento do assistente virtual e gerencie a base de conhecimento.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 py-6 space-y-8 max-w-4xl">
                        {/* ===== Section 1: Comportamento ===== */}
                        <section className="bg-card rounded-xl border border-border p-5 space-y-5">
                            <div className="flex items-center gap-2">
                                <MessageCircle className="w-4 h-4 text-primary" />
                                <h2 className="text-sm font-semibold text-card-foreground">Comportamento da IA</h2>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ai-prompt" className="text-xs text-muted-foreground">
                                    Prompt de Sistema
                                </Label>
                                <Textarea
                                    id="ai-prompt"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="min-h-[160px] resize-y text-sm"
                                    placeholder="Defina as instruções de comportamento da IA..."
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Thermometer className="w-4 h-4 text-primary" />
                                    <Label className="text-xs text-muted-foreground">Temperatura (Criatividade)</Label>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Slider
                                        value={temperature}
                                        onValueChange={setTemperature}
                                        min={0}
                                        max={100}
                                        step={1}
                                        className="flex-1"
                                    />
                                    <span className="text-sm font-mono font-semibold text-foreground w-10 text-right">
                                        {displayTemp}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[10px] text-muted-foreground">
                                    <span>🎯 Preciso</span>
                                    <span className="text-xs font-medium text-primary">{tempLabel}</span>
                                    <span>🎨 Criativo</span>
                                </div>
                            </div>
                        </section>

                        {/* ===== Section 2: Base de Conhecimento ===== */}
                        <section className="bg-card rounded-xl border border-border p-5 space-y-5">
                            <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-primary" />
                                <h2 className="text-sm font-semibold text-card-foreground">Base de Conhecimento</h2>
                            </div>

                            <div className="space-y-3">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex-1">
                                        <Label className="text-xs text-muted-foreground mb-1.5 block">Imóvel relacionado</Label>
                                        <Select value={uploadPropertyId} onValueChange={setUploadPropertyId}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={isImoveisLoading ? "Carregando..." : "Selecione o imóvel..."} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {imoveis.map((imovel) => (
                                                    <SelectItem key={imovel.id} value={String(imovel.id)}>
                                                        {imovel.name} {imovel.address && `— ${imovel.address}`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div
                                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                                        }`}
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Arraste PDFs aqui ou <span className="text-primary font-medium">clique para enviar</span>
                                    </p>
                                    <p className="text-[11px] text-muted-foreground/60 mt-1">PDF, até 10MB por arquivo</p>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept=".pdf"
                                        onChange={handleFileSelect}
                                    />
                                </div>
                            </div>

                            {/* Lista de Arquivos */}
                            {isFilesLoading ? (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                files.length > 0 && (
                                    <div className="space-y-1.5">
                                        {files.map((file) => (
                                            <div
                                                key={file.id}
                                                className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-background group"
                                            >
                                                <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center shrink-0">
                                                    <FileText className="w-4 h-4 text-secondary-foreground" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-card-foreground truncate">{file.fileName}</p>
                                                    <p className="text-[11px] text-muted-foreground">
                                                        {file.imovel ? <span className="text-primary">{file.imovel.name}</span> : "Sem imóvel vinculado"}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                                                    onClick={() => handleDeleteFile(file.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                        </section>

                        {/* ===== Section 3: Leads em Atendimento ===== */}
                        <section className="bg-card rounded-xl border border-border p-5 space-y-4">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" />
                                <h2 className="text-sm font-semibold text-card-foreground">
                                    Leads ({leads.length})
                                </h2>
                            </div>

                            {isLeadsLoading ? (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <div className="space-y-1.5">
                                    {leads.map((lead) => {
                                        const initials = lead.name ? lead.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "L";

                                        // Verifica se a IA está ativa para o Lead
                                        const isConversando = lead.aiActive;

                                        // Pega o primeiro imóvel caso exista na array
                                        const linkedImovel = lead.imoveis && lead.imoveis.length > 0 ? lead.imoveis[0].name : null;

                                        return (
                                            <div
                                                key={lead.id}
                                                className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-background cursor-pointer hover:border-primary/30 transition-colors"
                                                onClick={() => navigate(`/?leadId=${lead.id}`)}
                                            >
                                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-secondary-foreground shrink-0">
                                                    {initials}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-card-foreground">{lead.name}</p>
                                                    <p className="text-[11px] text-muted-foreground">
                                                        {lead.phone || "Sem telefone"}
                                                        {linkedImovel && <span> · <span className="text-primary">{linkedImovel}</span></span>}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[10px] gap-1.5 shrink-0 ${isConversando
                                                        ? "text-success border-success/30"
                                                        : "text-muted-foreground border-border"
                                                        }`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${isConversando ? "bg-success" : "bg-muted-foreground/40"}`}
                                                    />
                                                    {isConversando ? "Conversando" : "Aguardando"}
                                                </Badge>
                                            </div>
                                        );
                                    })}
                                    {leads.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-4">Nenhum lead encontrado.</p>
                                    )}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Footer actions */}
                    <div className="flex justify-end gap-3 px-6 pb-8">
                        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                            Cancelar
                        </Button>
                        <Button size="sm" className="gap-1.5" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            {isSaving ? "Salvando..." : "Salvar Configurações"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIConfig;