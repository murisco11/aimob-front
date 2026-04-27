import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { resetPassword, error: authError } = useAuth();

    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast({
                title: "Erro de Token",
                description: "O link de recuperação parece inválido ou expirou.",
                variant: "destructive"
            });
            return;
        }

        if (password.length < 6) {
            toast({
                title: "Senha fraca",
                description: "A senha deve ter no mínimo 6 caracteres.",
                variant: "destructive"
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: "Senhas divergentes",
                description: "As senhas digitadas não coincidem.",
                variant: "destructive"
            });
            return;
        }

        try {
            setIsLoading(true);
            // Chamada feita através do hook
            await resetPassword(token, password);

            setIsSuccess(true);
            toast({
                title: "Sucesso!",
                description: "Sua nova senha foi salva.",
                variant: "success"
            });
        } catch (err: any) {
            toast({
                title: "Erro ao redefinir",
                description: err.response?.data?.message || authError || "O link pode ter expirado. Tente solicitar um novo.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="h-screen flex items-center justify-center p-6 bg-background">
                <div className="w-full max-w-sm text-center space-y-6">
                    <div className="flex justify-center">
                        <CheckCircle2 className="w-16 h-16 text-primary animate-in zoom-in duration-300" />
                    </div>
                    <h2 className="text-2xl font-bold">Senha Redefinida!</h2>
                    <p className="text-muted-foreground">
                        Sua senha foi alterada com sucesso. Agora você já pode acessar o sistema com suas novas credenciais.
                    </p>
                    <Button onClick={() => navigate("/login")} className="w-full">
                        Ir para o Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex items-center justify-center p-6 bg-background">
            <div className="w-full max-w-sm space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold">Nova Senha</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                        Crie uma nova senha segura para sua conta AIMOB
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Nova Senha</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processando...
                            </>
                        ) : (
                            "Redefinir Senha"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;