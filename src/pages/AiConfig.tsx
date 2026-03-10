//            toast({ title: "Atenção", description: "O conteúdo não pode estar vazio.", variant: "destructive" });

//                toast({ title: "Sucesso", description: "Mensagem atualizada.", variant: "success" });


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
    Bot, Thermometer, Database, Users, Loader2, Send, Plus, Pencil
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useAiAssistant } from "@/hooks/useAiAssistant";
import { useAiAssistantFile } from "@/hooks/useAiAssistantFile";
import { useImovel } from "@/hooks/useImovel";
import { useLead } from "@/hooks/useLead";
import { useFirstMessage } from "@/hooks/useFirstMessage";
import { FirstMessage } from "@/types/FirstMessageType";
import { useAuth } from "@/hooks/useAuth";
import { Switch } from "@/components/ui/switch";

const AIConfig = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth()
    const userId = Number(user.id)

    const {
        selectedAiAssistant,
        fetchAiAssistantByUser,
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

    const {
        selectedFirstMessage: selectedFirstMessage,
        fetchAlFirstMessagel: fetchFirstMessages,
        createFirstMessage: createFirstMessage,
        updateFirstMessage: updateFirstMessage,
        deleteFirstMessage: deleteFirstMessage,
        isLoading: isFirstMessageLoading
    } = useFirstMessage();

    const [prompt, setPrompt] = useState("");
    const [temperature, setTemperature] = useState([70]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadPropertyId, setUploadPropertyId] = useState<string>("");

    const [showMsgForm, setShowMsgForm] = useState(false);
    const [newMsgContent, setNewMsgContent] = useState("");
    const [newMsgActive, setNewMsgActive] = useState<boolean>(false);
    const [editingMessageId, setEditingMessageId] = useState<number | null>(null);

    let hasFirstMessage = selectedFirstMessage ? true : false

    useEffect(() => {
        fetchAiAssistantByUser(userId);
        fetchAllImovel();
        fetchAllLead();
        fetchFirstMessages();
        console.log(selectedFirstMessage)
    }, [userId]);

    useEffect(() => {
        if (selectedAiAssistant?.id) {
            fetchFilesByAssistant(selectedAiAssistant.id);
        }
    }, [selectedAiAssistant?.id, fetchFilesByAssistant]);

    useEffect(() => {
        if (selectedAiAssistant) {
            setPrompt(selectedAiAssistant.prompt || "");
            setTemperature([selectedAiAssistant.temperature || 70]);
        }
    }, [selectedAiAssistant]);

    const filteredLeads = leads.filter(f => f.aiActive);

    const handleCancelMsgForm = () => {
        setShowMsgForm(false);
        setNewMsgContent("");
        setNewMsgActive(false);
        setEditingMessageId(null);
    };

    const handleSaveMessage = async () => {
        if (!newMsgContent.trim()) {
            toast({ title: "Atenção", description: "O conteúdo não pode estar vazio.", variant: "destructive" });
            return;
        }

        try {
            if (editingMessageId) {
                await updateFirstMessage(editingMessageId, { content: newMsgContent, isActive: newMsgActive });
                toast({ title: "Sucesso", description: "Mensagem atualizada.", variant: "success" });
            } else {
                if (hasFirstMessage) {
                    toast({ title: "Atenção", description: "Já existe uma mensagem configurada.", variant: "destructive" });
                    return;
                }
                await createFirstMessage({
                    content: newMsgContent,
                    isActive: newMsgActive,
                    userId: userId
                });
                toast({ title: "Sucesso", description: "Mensagem criada.", variant: "success" });
            }
            fetchFirstMessages()
            handleCancelMsgForm();
        } catch (error) {
            toast({ title: "Erro", description: "Falha ao salvar a mensagem.", variant: "destructive" });
        }
    };

    const handleEditMessage = (msg: FirstMessage) => {
        setNewMsgContent(msg.content);
        setNewMsgActive(msg.isActive)
        setEditingMessageId(msg.id);
        setShowMsgForm(true);
    };

    const handleDeleteMessage = async (id: number) => {
        try {
            await deleteFirstMessage(id);
            toast({ title: "Sucesso", description: "Mensagem removida.", variant: "success" });
        } catch (error) {
            toast({ title: "Erro", description: "Falha ao remover a mensagem.", variant: "destructive" });
        }
    };

    const handleDeleteFile = async (idFile: number) => {
        try {
            await deleteFile(idFile);
            toast({ title: "Arquivo removido", description: "O arquivo foi deletado com sucesso.", variant: "success"});
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
            await uploadFile(selectedAiAssistant.id, file, uploadPropertyId);
            toast({ title: "Sucesso", description: `Arquivo ${file.name} enviado.`, variant: "success" });
            await fetchFilesByAssistant(selectedAiAssistant.id);
            setUploadPropertyId("");
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

    const handleSave = async () => {
        try {
            await updateAiAssistant(selectedAiAssistant.id, {
                prompt,
                temperature: temperature[0]
            });
            toast({ title: "Configurações salvas!", description: "IA atualizada com sucesso.", variant: "success" });
        } catch (error) {
            toast({ title: "Erro", description: "Não foi possível salvar as configurações.", variant: "destructive" });
        }
    };

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

                        <section className="bg-card rounded-xl border border-border p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Send className="w-4 h-4 text-primary" />
                                    <h2 className="text-sm font-semibold text-card-foreground">Primeira Mensagem</h2>
                                </div>
                                {!showMsgForm && !hasFirstMessage && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-1.5 text-xs"
                                        onClick={() => setShowMsgForm(true)}
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Nova Mensagem
                                    </Button>
                                )}
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                                Mensagens enviadas automaticamente para o cliente em paralelo à IA. (Apenas 1 permitida).
                            </p>

                            {showMsgForm && (
                                <div className="border border-border rounded-lg p-4 space-y-3 bg-background">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground">Conteúdo da mensagem</Label>
                                        <Textarea
                                            value={newMsgContent}
                                            onChange={(e) => setNewMsgContent(e.target.value)}
                                            placeholder="Digite a mensagem que será enviada automaticamente..."
                                            className="min-h-[100px] resize-y text-sm"
                                            disabled={isFirstMessageLoading}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground">Status da Mensagem</Label>
                                        <Select
                                            value={newMsgActive ? "true" : "false"}
                                            onValueChange={(value) => setNewMsgActive(value === "true")}
                                            disabled={isFirstMessageLoading}
                                        >
                                            <SelectTrigger className="w-[180px] h-9 text-sm">
                                                <SelectValue placeholder="Selecione o status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="true" className="text-success">Ativo</SelectItem>
                                                <SelectItem value="false" className="text-muted-foreground">Desativado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="sm" onClick={handleCancelMsgForm} disabled={isFirstMessageLoading}>
                                            Cancelar
                                        </Button>
                                        <Button size="sm" className="gap-1.5" onClick={handleSaveMessage} disabled={isFirstMessageLoading}>
                                            {isFirstMessageLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                            {editingMessageId ? "Atualizar" : "Adicionar"}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {!showMsgForm && (
                                isFirstMessageLoading && !hasFirstMessage ? (
                                    <div className="flex justify-center py-4">
                                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                    </div>
                                ) : hasFirstMessage ? (
                                    <div className="space-y-1.5">
                                        <div
                                            key={selectedFirstMessage.id}
                                            className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background group"
                                        >
                                            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <Send className="w-4 h-4 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-card-foreground">Mensagem Automática - {selectedFirstMessage.isActive ? "Ativa" : "Desativada"}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{selectedFirstMessage.content}</p>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                    onClick={() => handleEditMessage(selectedFirstMessage)}
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => handleDeleteMessage(selectedFirstMessage.id)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-muted-foreground text-sm">
                                        Nenhuma primeira mensagem configurada.
                                    </div>
                                )
                            )}
                        </section>

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

                        <section className="bg-card rounded-xl border border-border p-5 space-y-4">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" />
                                <h2 className="text-sm font-semibold text-card-foreground">
                                    Leads Ativos com IA ({filteredLeads.length})
                                </h2>
                            </div>

                            {isLeadsLoading ? (
                                <div className="flex justify-center p-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <div className="space-y-1.5">
                                    {filteredLeads.map((lead) => {
                                        const initials = lead.name ? lead.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "L";
                                        const isConversando = lead.aiActive;
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

                    <div className="flex justify-start gap-3 px-6 pb-8">
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