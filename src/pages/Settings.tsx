import { useState } from "react";
import {
  User,
  Bot,
  Plug,
  Camera,
  MessageSquare,
  Instagram,
  Webhook,
  Save,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "profile", label: "Perfil", icon: User },
  { id: "ai", label: "Inteligência Artificial", icon: Bot },
  { id: "integrations", label: "Integrações", icon: Plug },
] as const;

type TabId = typeof tabs[number]["id"];

const Settings = () => {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [aiAutopilot, setAiAutopilot] = useState(true);
  const [autonomyLevel, setAutonomyLevel] = useState([60]);
  const [systemPrompt, setSystemPrompt] = useState(
    "Você é Miguel, um corretor de imóveis de luxo em Natal/RN. Seja cordial, profissional e sempre destaque os diferenciais dos imóveis. Responda em português brasileiro."
  );

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <CrmSidebar activeItem="Settings" />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />

        <div className="flex-1 flex overflow-hidden">
          {/* Left: Tab Navigation */}
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

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            {/* Mobile tab selector */}
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
              {/* TAB 1: Profile */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Perfil & Negócio</h3>
                    <p className="text-sm text-muted-foreground">Informações do corretor e da empresa</p>
                  </div>

                  {/* Avatar */}
                  <Card className="border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
                          <Camera className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Foto de perfil</p>
                          <p className="text-xs text-muted-foreground mb-2">JPG, PNG ou WebP. Máx 2MB.</p>
                          <Button variant="outline" size="sm">Upload</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border">
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome do Corretor</Label>
                          <Input id="name" defaultValue="João Reis" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="agency">Imobiliária / Marca</Label>
                          <Input id="agency" defaultValue="Reis Imóveis Premium" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone (WhatsApp)</Label>
                          <Input id="phone" defaultValue="+55 84 99999-0000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail</Label>
                          <Input id="email" type="email" defaultValue="joao@reisimoveis.com.br" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button className="gap-2">
                      <Save className="w-4 h-4" />
                      Salvar Alterações
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB 2: AI & Automation */}
              {activeTab === "ai" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Inteligência Artificial</h3>
                    <p className="text-sm text-muted-foreground">Configure o comportamento do agente de IA</p>
                  </div>

                  {/* Global Toggle */}
                  <Card className="border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Ativar IA Autopilot</p>
                            <p className="text-xs text-muted-foreground">Permite que a IA responda leads automaticamente</p>
                          </div>
                        </div>
                        <Switch checked={aiAutopilot} onCheckedChange={setAiAutopilot} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* System Prompt */}
                  <Card className="border-border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Prompt do Sistema / Contexto Base</CardTitle>
                      <CardDescription>Instruções que a IA seguirá ao conversar com leads</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        rows={6}
                        className="resize-none"
                        placeholder="Ex: Você é Miguel, um corretor de imóveis de luxo..."
                      />
                      <p className="text-[11px] text-muted-foreground mt-2">{systemPrompt.length} caracteres</p>
                    </CardContent>
                  </Card>

                  {/* Autonomy Level */}
                  <Card className="border-border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Nível de Autonomia</CardTitle>
                      <CardDescription>Controle o quanto a IA age por conta própria</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Slider
                        value={autonomyLevel}
                        onValueChange={setAutonomyLevel}
                        max={100}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Apenas sugerir respostas</span>
                        <span>Responder automaticamente</span>
                      </div>
                      <p className="text-sm text-foreground font-medium text-center">
                        {autonomyLevel[0] <= 30
                          ? "🔵 Modo Assistente — Apenas sugere"
                          : autonomyLevel[0] <= 70
                          ? "🟡 Modo Híbrido — Responde com aprovação"
                          : "🟢 Modo Autopilot — Responde automaticamente"}
                      </p>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button className="gap-2">
                      <Save className="w-4 h-4" />
                      Salvar Alterações
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB 3: Integrations */}
              {activeTab === "integrations" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Integrações</h3>
                    <p className="text-sm text-muted-foreground">Conecte seus canais de comunicação e automação</p>
                  </div>

                  {/* WhatsApp */}
                  <Card className="border-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-sm">WhatsApp (Evolution API)</CardTitle>
                            <CardDescription>Envio e recebimento de mensagens</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="gap-1 text-xs bg-primary/10 text-primary border-primary/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Conectado
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label htmlFor="wa-key">Instance Key</Label>
                        <Input id="wa-key" defaultValue="evo_inst_a1b2c3d4e5f6" type="password" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Instagram */}
                  <Card className="border-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <Instagram className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <CardTitle className="text-sm">Instagram Direct</CardTitle>
                            <CardDescription>Mensagens do Instagram Business</CardDescription>
                          </div>
                        </div>
                        <Badge variant="outline" className="gap-1 text-xs bg-destructive/10 text-destructive border-destructive/30">
                          <XCircle className="w-3 h-3" />
                          Desconectado
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="gap-2">
                        <Instagram className="w-4 h-4" />
                        Conectar Conta Meta
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Webhooks */}
                  <Card className="border-border">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Webhook className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-sm">Webhooks (n8n)</CardTitle>
                          <CardDescription>Automação de fluxos externos</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="webhook-in">Incoming Webhook URL</Label>
                        <Input id="webhook-in" placeholder="https://n8n.seudominio.com/webhook/..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="webhook-out">Outgoing Webhook URL</Label>
                        <Input id="webhook-out" placeholder="https://n8n.seudominio.com/webhook/..." />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button className="gap-2">
                      <Save className="w-4 h-4" />
                      Salvar Alterações
                    </Button>
                  </div>
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
