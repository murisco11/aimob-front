import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
// authService removido daqui

const Login = () => {
  const navigate = useNavigate();
  // Puxando o requestPasswordReset do hook
  const { login, requestPasswordReset, isLoading: authLoading, error } = useAuth();
  const { toast } = useToast();
  const [view, setView] = useState<"login" | "register" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Mantido caso você use para outros fluxos (como register futuro)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const isLoginMode = view === "login";
  const isForgotMode = view === "forgot";
  const loading = authLoading || isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || (!isForgotMode && !password)) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isForgotMode) {
        setIsLoading(true);

        // Chamando direto do Hook agora
        await requestPasswordReset(email);

        toast({
          title: "Link enviado!",
          description: "Se o e-mail estiver cadastrado, você receberá as instruções em breve.",
          variant: "success",
        });
        setView("login");
      } else {
        await login({ email, password });
        toast({
          title: "Sucesso",
          description: "Login realizado com sucesso!",
          variant: "success",
        });
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast({
        title: isForgotMode ? "Erro ao solicitar" : "Erro ao fazer login",
        description: err.response?.data?.message || error || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative bg-card items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="relative z-10 max-w-md text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-5xl font-bold text-foreground">
              AIMOB CRM + IA + Meta Business
            </span>
          </div>
          <h1 className="text-2xl text-primary font-bold leading-tight mb-4">
            Gerencie seus imóveis e leads com inteligência
          </h1>
          <p className="text-muted-foreground text-lg">
            CRM imobiliário com IA integrada para qualificação automática de leads, transações e agendamento de visitas.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-sm flex flex-col items-center">

          <div className="flex flex-col items-center mb-2">
            <img
              src="/logo.png"
              alt="AIMOB CRM"
              className="h-[155px] w-auto object-contain"
            />
            <span className="lg:hidden text-xl font-bold text-foreground mt-2">AIMOB CRM</span>
          </div>

          <div className="w-full text-center mb-6">
            <h2 className="text-3xl font-bold text-foreground">
              {isForgotMode ? "Recuperar senha" : isLoginMode ? "Bem-vindo(a) de volta!" : "Criar conta"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isForgotMode
                ? "Insira seu e-mail para receber o link de redefinição"
                : isLoginMode
                  ? "Entre com suas credenciais para acessar o seu CRM"
                  : "Preencha os dados para começar a usar o CRM"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            {view === "register" && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10"
                  disabled={loading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
                disabled={loading}
                required
              />
            </div>

            {!isForgotMode && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  {isLoginMode && (
                    <button
                      type="button"
                      onClick={() => setView("forgot")}
                      className="text-xs text-primary hover:underline"
                      disabled={loading}
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 pr-10"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full h-10 mt-2" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isForgotMode ? "Enviar link" : isLoginMode ? "Entrar" : "Criar conta"}
            </Button>

            {isForgotMode && (
              <Button
                type="button"
                variant="ghost"
                className="w-full gap-2"
                onClick={() => setView("login")}
                disabled={loading}
              >
                <ArrowLeft className="w-4 h-4" /> Voltar para o login
              </Button>
            )}
          </form>

          {!isForgotMode && (
            <p className="text-sm text-center text-muted-foreground mt-6">
              {isLoginMode ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
              <button
                onClick={() => isLoginMode ? navigate("/pricing") : setView("login")}
                className="text-primary font-medium hover:underline"
                disabled={loading}
              >
                {isLoginMode ? "Cadastre-se" : "Entre aqui"}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;