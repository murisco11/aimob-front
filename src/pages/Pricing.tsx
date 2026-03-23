import { useNavigate } from "react-router-dom";
import { Check, Building2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const benefits = [
  "Automação no Whatsapp",
  "Inteligência Artificial",
  "Gerenciar visitas",
  "Módulo de transações",
  "Armazenar documentos",
  "CRM completo com estrutura de leads",
  "Qualificação automática após atendimento",
  "Mensagens ilimitadas"
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <img src="/logo.png" alt="AIMOB CRM" className="h-8 w-auto object-contain" />
        <span className="text-2xl font-bold tracking-tight text-foreground">AIMOB</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-foreground mb-2">
        O CRM feito para corretores que vendem mais
      </h1>
      <p className="text-muted-foreground text-center max-w-lg mb-10">
        Simplifique sua rotina, organize seus leads e feche mais negócios com a plataforma nº1 para corretores autônomos.
      </p>

      {/* Pricing Card */}
      <Card className="w-full max-w-md border-2 border-primary shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mx-auto mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Mais popular
          </div>
          <h2 className="text-2xl font-bold text-foreground">Plano Pro</h2>
          <p className="text-muted-foreground text-sm">Para quem quer o pacote completo de CRM e inteligência artificial</p>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-end justify-center gap-1 mb-6">
            <span className="text-muted-foreground text-lg">R$</span>
            <span className="text-5xl font-extrabold text-foreground leading-none">119</span>
            <span className="text-muted-foreground text-lg">/mês</span>
          </div>
          <ul className="text-left space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-foreground">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full text-base py-5"
            size="lg"
            onClick={() => navigate("/signup")}
          >
            Assinar Agora
          </Button>
        </CardFooter>
      </Card>

      <p className="text-xs text-muted-foreground mt-6 text-center">
        Cancele quando quiser. Sem fidelidade. Sem surpresas.
      </p>
    </div>
  );
};

export default Pricing;
