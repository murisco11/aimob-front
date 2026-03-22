import { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import {
    User,
    Plug,
    MessageSquare,
    Webhook,
    Save,
    CheckCircle2,
    XCircle,
    QrCode,
    Copy,
    RefreshCw,
    Smartphone,
    LogOut,
    Ban,
    Trash2,
    Bot // <-- Novo import
} from "lucide-react";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch"; // <-- Novo import
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { useWhatsapp } from "@/hooks/useWhatsapp";
import { useToast } from "@/hooks/use-toast";
import { useBlockedPerson } from "@/hooks/useBlockedPerson";
import { useConfirmStore } from "@/stores/confirmStore"; // <-- Novo import

const tabs = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "integrations", label: "Integrações", icon: Plug },
    { id: "bans", label: "Números banidos", icon: Ban },
] as const;

type TabId = typeof tabs[number]["id"];

const Settings = () => {
    const [activeTab, setActiveTab] = useState<TabId>("profile");
    const { toast } = useToast();
    const { openConfirm } = useConfirmStore(); // <-- Hook de confirmação

    const { user, isLoading: isUserLoading, fetchUser, updateUser } = useUser();

    // Hook de Pessoas Bloqueadas
    const {
        blockedPersons: blockedPersons,
        isLoading: isBlockedLoading,
        fetchAllBlockedPerson: fetchBlockedPersons,
        deleteBlockedPerson: unblockPerson
    } = useBlockedPerson();

    const {
        qrCode,
        status: waStatus,
        isLoading: isWaLoading,
        generateQrCode,
        checkStatus,
        disconnect
    } = useWhatsapp();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setPhone(user.phone || "");
        }
    }, [user]);

    // Busca os números bloqueados sempre que a aba for acessada
    useEffect(() => {
        if (activeTab === "bans") {
            fetchBlockedPersons();
        }
    }, [activeTab, fetchBlockedPersons]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (activeTab === "integrations") {
            checkStatus();

            if (waStatus !== "open") {
                interval = setInterval(() => {
                    checkStatus();
                }, 5000);
            }
        }

        return () => clearInterval(interval);
    }, [activeTab, waStatus, checkStatus]);

    const handleSaveProfile = async () => {
        if (!user) return;

        if (!name.trim()) {
            return toast({
                title: "Atenção",
                description: "O campo Nome Completo é obrigatório.",
                variant: "destructive"
            });
        }

        const unmaskedPhone = phone.replace(/\D/g, "");

        if (!unmaskedPhone || unmaskedPhone.length < 10) {
            return toast({
                title: "Atenção",
                description: "Informe um número de WhatsApp válido.",
                variant: "destructive"
            });
        }

        try {
            await updateUser(user.id, { name, phone });
            toast({
                title: "Sucesso",
                description: "Perfil atualizado com sucesso!"
            });
        } catch (error) {
            toast({
                title: "Erro",
                description: "Erro ao atualizar o perfil.",
                variant: "destructive"
            });
        }
    };

    const handleCopyWebhook = () => {
        const url = `aimob.com.br/webhook/canalpro/${user?.hashId || "carregando..."}`;
        navigator.clipboard.writeText(url);
        toast({
            title: "Copiado!",
            description: "URL do Webhook copiada para a área de transferência."
        });
    };

    const handleUnban = async (id: number) => {
        try {
            await unblockPerson(id);
            toast({
                title: "Sucesso",
                description: "Número desbloqueado com sucesso.",
            });
        } catch (error) {
            toast({
                title: "Erro",
                description: "Falha ao desbloquear o número.",
                variant: "destructive"
            });
        }
    };

    // Nova função para lidar com o toggle da IA
    const handleToggleAi = async (checked: boolean) => {
        if (!user) return;

        if (checked) {
            openConfirm({
                title: "Ativar Assistente de IA Automático",
                description: "Tem certeza que deseja ativar essa função? Quando ativada, TODO NOVO CONTATO que enviar mensagem terá a IA ativada automaticamente para respondê-lo.",
                confirmText: "Sim, ativar IA",
                onConfirm: async () => {
                    try {
                        await updateUser(user.id, { aiActive: true });
                        toast({
                            title: "Sucesso",
                            description: "IA automática ativada com sucesso!",
                            variant: "success"
                        });
                    } catch (error) {
                        toast({
                            title: "Erro",
                            description: "Falha ao ativar a IA automática.",
                            variant: "destructive"
                        });
                    }
                }
            });
        } else {
            try {
                await updateUser(user.id, { aiActive: false });
                toast({
                    title: "Desativado",
                    description: "A IA não será mais ativada automaticamente para novos leads."
                });
            } catch (error) {
                toast({
                    title: "Erro",
                    description: "Falha ao desativar a configuração.",
                    variant: "destructive"
                });
            }
        }
    };

    const renderWaBadge = () => {
        if (waStatus === "open") {
            return (
                <Badge variant="outline" className="gap-1 text-xs bg-primary/10 text-primary border-primary/30">
                    <CheckCircle2 className="w-3 h-3" /> Conectado
                </Badge>
            );
        }
        if (waStatus === "connecting" || qrCode) {
            return (
                <Badge variant="outline" className="gap-1 text-xs bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Aguardando Leitura...
                </Badge>
            );
        }
        return (
            <Badge variant="outline" className="gap-1 text-xs bg-destructive/10 text-destructive border-destructive/30">
                <XCircle className="w-3 h-3" /> Desconectado
            </Badge>
        );
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <CrmSidebar activeItem="Settings" />

            <div className="flex-1 flex flex-col min-w-0">
                <MobileHeader />

                <div className="flex-1 flex overflow-hidden">
                    <div className="w-[220px] shrink-0 border-r border-border p-4 hidden md:block">
                        <h2 className="text-lg font-semibold text-foreground mb-1">Configurações</h2>
                        <p className="text-xs text-muted-foreground mb-6">Gerencie seu CRM</p>

                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                                        activeTab === tab.id
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                        <div className="flex gap-2 mb-6 md:hidden">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                        activeTab === tab.id
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    <tab.icon className="w-3.5 h-3.5" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="max-w-2xl">
                            {/* ABA DE PERFIL */}
                            {activeTab === "profile" && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">Perfil</h3>
                                        <p className="text-sm text-muted-foreground">Suas informações de acesso e contato</p>
                                    </div>

                                    <Card className="border-border">
                                        <CardContent className="p-6 space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Nome Completo <span className="text-destructive">*</span></Label>
                                                    <Input
                                                        id="name"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        disabled={isUserLoading}
                                                        placeholder="Digite seu nome"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">E-mail</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={user?.email || ""}
                                                        disabled
                                                        className="bg-muted"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">Telefone (WhatsApp) <span className="text-destructive">*</span></Label>
                                                    <InputMask
                                                        mask="(99) 99999-9999"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        disabled={isUserLoading}
                                                    >
                                                        {(inputProps: any) => (
                                                            <Input
                                                                {...inputProps}
                                                                id="phone"
                                                                type="tel"
                                                                placeholder="(00) 00000-0000"
                                                            />
                                                        )}
                                                    </InputMask>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="instanceName">Nome da Instância</Label>
                                                    <Input
                                                        id="instanceName"
                                                        value={user?.instanceName || "Não configurada"}
                                                        disabled
                                                        className="bg-muted"
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="flex justify-end">
                                        <Button onClick={handleSaveProfile} disabled={isUserLoading} className="gap-2">
                                            <Save className="w-4 h-4" />
                                            {isUserLoading ? "Salvando..." : "Salvar Alterações"}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* ABA DE BANIDOS */}
                            {activeTab === "bans" && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">Números banidos</h3>
                                        <p className="text-sm text-muted-foreground">Gerencie os números que você baniu</p>
                                    </div>

                                    <Card className="border-border overflow-hidden">
                                        <CardContent className="p-0">
                                            {isBlockedLoading ? (
                                                <div className="p-8 flex flex-col items-center justify-center text-muted-foreground">
                                                    <RefreshCw className="w-6 h-6 animate-spin mb-2" />
                                                    <span className="text-sm">Carregando números...</span>
                                                </div>
                                            ) : blockedPersons.length === 0 ? (
                                                <div className="p-8 flex flex-col items-center justify-center text-muted-foreground">
                                                    <Ban className="w-8 h-8 opacity-20 mb-3" />
                                                    <p className="text-sm">Nenhum número foi banido ainda.</p>
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-border">
                                                    {blockedPersons.map((person) => (
                                                        <div key={person.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                                                                    <Ban className="w-4 h-4 text-destructive" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-sm text-foreground">{person.number}</p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        Banido em: {new Date(person.createdAt).toLocaleDateString("pt-BR")}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleUnban(person.id)}
                                                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Desbloquear
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* ABA DE INTEGRAÇÕES */}
                            {activeTab === "integrations" && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">Integrações</h3>
                                        <p className="text-sm text-muted-foreground">Conecte seus canais de comunicação e automação</p>
                                    </div>

                                    {/* NOVO CARD: ATIVAÇÃO AUTOMÁTICA DA IA */}
                                    <Card className="border-border">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <Bot className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-sm">Assistente de IA</CardTitle>
                                                        <CardDescription>Ativar Inteligência Artificial para novos leads</CardDescription>
                                                    </div>
                                                </div>
                                                <Switch
                                                    // Substitua `user?.aiActive` pela propriedade real do seu user
                                                    checked={user?.aiActive || false}
                                                    onCheckedChange={handleToggleAi}
                                                    disabled={isUserLoading}
                                                />
                                            </div>
                                        </CardHeader>
                                    </Card>

                                    <Card className="border-border">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <MessageSquare className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-sm">WhatsApp</CardTitle>
                                                        <CardDescription>Escaneie o QR Code para conectar</CardDescription>
                                                    </div>
                                                </div>
                                                {renderWaBadge()}
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl bg-muted/30">
                                                {waStatus === "open" ? (
                                                    <div className="flex flex-col items-center text-center space-y-3">
                                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                                            <Smartphone className="w-8 h-8 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground">Aparelho Conectado!</p>
                                                            <p className="text-xs text-muted-foreground mt-1">Seu WhatsApp está pronto para enviar e receber mensagens.</p>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                                                            onClick={async () => {
                                                                await disconnect();
                                                                toast({
                                                                    title: "Desconectado",
                                                                    description: "Seu WhatsApp foi desvinculado com sucesso.",
                                                                });
                                                            }}
                                                        >
                                                            {isWaLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                                                            Desconectar Aparelho
                                                        </Button>
                                                    </div>
                                                ) : qrCode ? (
                                                    <div className="flex flex-col items-center text-center">
                                                        <img
                                                            src={qrCode.startsWith('data:image') ? qrCode : `data:image/png;base64,${qrCode}`}
                                                            alt="WhatsApp QR Code"
                                                            className="w-48 h-48 rounded-lg shadow-sm mb-4" />
                                                        <p className="text-sm text-muted-foreground">
                                                            Abra o WhatsApp no celular, vá em "Aparelhos Conectados" e escaneie o código acima.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <QrCode className="w-16 h-16 text-muted-foreground mb-4" />
                                                        <p className="text-sm text-muted-foreground mb-4 text-center">
                                                            Clique no botão abaixo para gerar o QR Code de conexão.
                                                        </p>
                                                        <Button
                                                            variant="outline"
                                                            onClick={generateQrCode}
                                                            disabled={isWaLoading}
                                                            className="gap-2"
                                                        >
                                                            {isWaLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
                                                            {isWaLoading ? "Gerando..." : "Gerar QR Code"}
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-border">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                                                        <Webhook className="w-5 h-5 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-sm">Webhook (Canal Pro)</CardTitle>
                                                        <CardDescription>URL exclusiva para envio de eventos externos</CardDescription>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="gap-1 text-xs bg-primary/10 text-green-100 border-primary/30">
                                                    <CheckCircle2 className="w-3 h-3" /> Inserir no Canal Pro
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <Label htmlFor="webhook-url">Sua URL de Webhook</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        id="webhook-url"
                                                        value={`aimob.com.br/webhook/canalpro/${user?.hashId || ""}`}
                                                        readOnly
                                                        className="bg-muted font-mono text-xs"
                                                    />
                                                    <Button variant="secondary" onClick={handleCopyWebhook} className="shrink-0 gap-2">
                                                        <Copy className="w-4 h-4" />
                                                        Copiar
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;