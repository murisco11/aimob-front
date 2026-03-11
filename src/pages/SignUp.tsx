import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCheckout } from "@/hooks/useCheckout";

const SignUp = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    
    const { createAccountAndPay, isLoading } = useCheckout();
    
    const [form, setForm] = useState({ 
        name: "", 
        email: "", 
        phone: "", 
        password: "", 
        confirmPassword: "" 
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
            toast({ title: "Preencha todos os campos", variant: "destructive" });
            return;
        }

        if (form.password !== form.confirmPassword) {
            toast({ title: "As senhas não coincidem", variant: "destructive" });
            return;
        }

        try {
            const checkoutUrl = await createAccountAndPay({
                name: form.name,
                email: form.email,
                phone: form.phone,
                password: form.password,
            });

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            }
        } catch (error: any) {
            toast({
                title: "Erro ao gerar pagamento",
                description: error.response?.data?.message || "Tente novamente em instantes.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
            <div className="w-full max-w-md">
                <button
                    onClick={() => navigate("/pricing")}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Voltar aos planos
                </button>

                <Card className="border shadow-lg">
                    <CardHeader className="text-center pb-2">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Building2 className="h-7 w-7 text-primary" />
                            <span className="text-xl font-bold text-foreground">AIMOB</span>
                        </div>
                        <h1 className="text-xl font-bold text-foreground">Crie sua conta</h1>
                        <p className="text-sm text-muted-foreground">
                            Plano Pro · R$ 79/mês
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input
                                    id="name"
                                    placeholder="João da Silva"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            
                            <div className="space-y-1.5">
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="joao@email.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="phone">Telefone / WhatsApp</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="(11) 99999-9999"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="password">Senha</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Mínimo 6"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Repita a senha"
                                        value={form.confirmPassword}
                                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-5 text-base mt-2"
                                size="lg"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Processando pagamento...
                                    </>
                                ) : (
                                    "Criar Conta e Pagar"
                                )}
                            </Button>
                        </form>
                        <p className="text-xs text-muted-foreground text-center mt-4">
                            Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SignUp;