import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      console.log("Pagamento confirmado! ID da Sessão:", sessionId);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <div className="flex items-center gap-2 mb-8">
        <Building2 className="h-7 w-7 text-primary" />
        <span className="text-xl font-bold text-foreground">AIMOB</span>
      </div>

      <div className="rounded-full bg-primary/10 p-5 mb-6">
        <CheckCircle2 className="h-16 w-16 text-primary" />
      </div>

      <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2">
        Pagamento Aprovado!
      </h1>
      <p className="text-lg text-foreground mb-1">
        Bem-vindo ao <span className="font-bold">AIMOB</span> 🎉
      </p>
      <p className="text-muted-foreground max-w-sm mb-8">
        Sua conta foi criada com sucesso. Você já pode começar a organizar seus leads e fechar mais negócios.
      </p>

      <Button
        size="lg"
        className="py-5 px-8 text-base"
        onClick={() => navigate("/")}
      >
        Acessar meu Painel
      </Button>
    </div>
  );
};

export default Success;