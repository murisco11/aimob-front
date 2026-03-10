import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Home, DollarSign, User, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useImovel } from "@/hooks/useImovel";

type TabKey = "info" | "financial" | "context" | "owner";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "info", label: "Informações", icon: <Home className="w-4 h-4" /> },
  { key: "financial", label: "Financeiro", icon: <DollarSign className="w-4 h-4" /> },
  { key: "context", label: "Contexto", icon: <FileText className="w-4 h-4" /> },
  { key: "owner", label: "Proprietário", icon: <User className="w-4 h-4" /> },
];

interface FieldErrors {
  name?: string;
  address?: string;
  valor?: string;
}

const PropertyRegister = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const { createImovel, updateImovel, fetchByIdImovel, selectedImovel, isLoading } = useImovel();

  const [activeTab, setActiveTab] = useState<TabKey>("info");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  
  const [quartos, setQuartos] = useState("");
  const [suites, setSuites] = useState("");
  const [banheiros, setBanheiros] = useState("");
  const [vagas, setVagas] = useState("");
  const [area, setArea] = useState("");
  const [andar, setAndar] = useState("");
  
  const [aceitaPets, setAceitaPets] = useState(false);
  const [mobiliado, setMobiliado] = useState(false);
  
  const [valor, setValor] = useState("");
  const [condominio, setCondominio] = useState("");
  const [iptu, setIptu] = useState("");
  const [comissao, setComissao] = useState("");
  
  const [expectativaVenda, setExpectativaVenda] = useState("");
  const [perfilComprador, setPerfilComprador] = useState("");
  const [infoProprietario, setInfoProprietario] = useState("");

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      setIsFetching(true);
      fetchByIdImovel(Number(id)).finally(() => setIsFetching(false));
    }
  }, [id, fetchByIdImovel, isEditing]);

  useEffect(() => {
    if (isEditing && selectedImovel && String(selectedImovel.id) === id) {
      setName(selectedImovel.name || "");
      setAddress(selectedImovel.address || "");
      setDescription(selectedImovel.description || "");
      
      setQuartos(selectedImovel.quartos ? String(selectedImovel.quartos) : "");
      setSuites(selectedImovel.suites ? String(selectedImovel.suites) : "");
      setBanheiros(selectedImovel.banheiros ? String(selectedImovel.banheiros) : "");
      setVagas(selectedImovel.vagas ? String(selectedImovel.vagas) : "");
      setArea(selectedImovel.area ? String(selectedImovel.area) : "");
      setAndar(selectedImovel.andar ? String(selectedImovel.andar) : "");
      
      setAceitaPets(!!selectedImovel.aceitaPets);
      setMobiliado(!!selectedImovel.mobiliado);
      
      setValor(selectedImovel.valor ? selectedImovel.valor.toLocaleString("pt-BR") : "");
      setCondominio(selectedImovel.condominio ? selectedImovel.condominio.toLocaleString("pt-BR") : "");
      setIptu(selectedImovel.iptu ? selectedImovel.iptu.toLocaleString("pt-BR") : "");
      setComissao(selectedImovel.comissao ? String(selectedImovel.comissao) : "");
      
      setExpectativaVenda(selectedImovel.expectativaVenda || "");
      setPerfilComprador(selectedImovel.perfilComprador || "");
      setInfoProprietario(selectedImovel.infoProprietario || "");
    }
  }, [isEditing, selectedImovel, id]);

  const formatCurrency = (raw: string): string => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    const num = parseInt(digits, 10);
    return num.toLocaleString("pt-BR");
  };

  const handleCurrencyChange = (
    setter: (v: string) => void,
    validationField?: keyof FieldErrors
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setter(formatted);
    if (validationField && submitted) {
      setErrors((prev) => {
        const next = { ...prev };
        if (formatted) delete next[validationField];
        else next[validationField] = "Preço é obrigatório";
        return next;
      });
    }
  };

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (!name.trim()) errs.name = "Título é obrigatório";
    else if (name.trim().length > 255) errs.name = "Máximo 255 caracteres";
    
    if (!address.trim()) errs.address = "Endereço é obrigatório";
    else if (address.trim().length > 255) errs.address = "Máximo 255 caracteres";
    
    if (!valor.replace(/\D/g, "")) errs.valor = "Preço é obrigatório";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      if (errs.name || errs.address) setActiveTab("info");
      else if (errs.valor) setActiveTab("financial");
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    try {
      const payload = {
        name,
        address,
        description,
        quartos: Number(quartos) || 0,
        suites: Number(suites) || 0,
        banheiros: Number(banheiros) || 0,
        vagas: Number(vagas) || 0,
        area: area ? Number(area) : undefined,
        andar: andar ? Number(andar) : undefined,
        aceitaPets,
        mobiliado,
        valor: Number(valor.replace(/\D/g, "")) || 0,
        condominio: condominio ? Number(condominio.replace(/\D/g, "")) : undefined,
        iptu: iptu ? Number(iptu.replace(/\D/g, "")) : undefined,
        comissao: comissao ? Number(comissao) : undefined,
        expectativaVenda,
        perfilComprador,
        infoProprietario
      };

      if (isEditing) {
        await updateImovel({...payload, id: Number(id)});
        toast.success("Imóvel atualizado com sucesso!");
        navigate(`/properties/${id}`);
      } else {
        await createImovel(payload);
        toast.success("Imóvel cadastrado com sucesso!");
        navigate("/properties");
      }
    } catch (error) {
      toast.error(isEditing ? "Erro ao atualizar imóvel." : "Erro ao cadastrar imóvel.");
    }
  };

  const onChangeField = (field: keyof FieldErrors, val: string) => {
    if (field === "name") setName(val);
    if (field === "address") setAddress(val);
    if (field === "valor") setValor(val);
    
    if (submitted) {
      setErrors((prev) => {
        const next = { ...prev };
        if (val.trim()) delete next[field];
        else next[field] = `${field === "name" ? "Título" : field === "address" ? "Endereço" : "Preço"} é obrigatório`;
        return next;
      });
    }
  };

  const errorClass = "border-destructive focus-visible:ring-destructive";
  const fieldClass = "space-y-2";

  const RequiredDot = () => (
    <span className="text-destructive ml-0.5">*</span>
  );

  if (isFetching) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <CrmSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  {isEditing ? "Editar Imóvel" : "Cadastrar Imóvel"}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {isEditing ? "Altere as informações do imóvel" : "Preencha as informações do novo imóvel"}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 pt-4">
            <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 pb-20">
            {activeTab === "info" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
                <div className={`${fieldClass} md:col-span-2`}>
                  <Label>Título<RequiredDot /></Label>
                  <Input
                    placeholder="Ex: Apartamento 3 quartos em Ponta Negra"
                    value={name}
                    onChange={(e) => onChangeField("name", e.target.value)}
                    className={errors.name ? errorClass : ""}
                    maxLength={255}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                
                <div className={`${fieldClass} md:col-span-2`}>
                  <Label>Endereço<RequiredDot /></Label>
                  <Input
                    placeholder="Rua, número, bairro, cidade"
                    value={address}
                    onChange={(e) => onChangeField("address", e.target.value)}
                    className={errors.address ? errorClass : ""}
                    maxLength={255}
                  />
                  {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
                </div>

                <div className={fieldClass}>
                  <Label>Área (m²)</Label>
                  <Input type="number" placeholder="120" value={area} onChange={(e) => setArea(e.target.value)} />
                </div>
                
                <div className={fieldClass}>
                  <Label>Andar</Label>
                  <Input type="number" placeholder="8" value={andar} onChange={(e) => setAndar(e.target.value)} />
                </div>

                <div className={fieldClass}>
                  <Label>Quartos</Label>
                  <Input type="number" placeholder="3" value={quartos} onChange={(e) => setQuartos(e.target.value)} />
                </div>

                <div className={fieldClass}>
                  <Label>Suítes</Label>
                  <Input type="number" placeholder="1" value={suites} onChange={(e) => setSuites(e.target.value)} />
                </div>

                <div className={fieldClass}>
                  <Label>Banheiros</Label>
                  <Input type="number" placeholder="2" value={banheiros} onChange={(e) => setBanheiros(e.target.value)} />
                </div>
                
                <div className={fieldClass}>
                  <Label>Vagas de garagem</Label>
                  <Input type="number" placeholder="2" value={vagas} onChange={(e) => setVagas(e.target.value)} />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <Label className="cursor-pointer">Aceita pets</Label>
                  <Switch checked={aceitaPets} onCheckedChange={setAceitaPets} />
                </div>
                
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <Label className="cursor-pointer">Mobiliado</Label>
                  <Switch checked={mobiliado} onCheckedChange={setMobiliado} />
                </div>

                <div className={`${fieldClass} md:col-span-2`}>
                  <Label>Descrição</Label>
                  <Textarea placeholder="Descreva o imóvel com detalhes..." rows={4} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} />
                </div>
              </div>
            )}

            {activeTab === "financial" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
                <div className={fieldClass}>
                  <Label>Valor<RequiredDot /></Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">R$</span>
                    <Input
                      placeholder="1.450.000"
                      value={valor}
                      onChange={handleCurrencyChange(setValor, "valor")}
                      className={`pl-9 ${errors.valor ? errorClass : ""}`}
                      inputMode="numeric"
                    />
                  </div>
                  {errors.valor && <p className="text-xs text-destructive">{errors.valor}</p>}
                </div>
                
                <div className={fieldClass}>
                  <Label>Condomínio <span className="text-muted-foreground font-normal text-xs">(R$/mês)</span></Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">R$</span>
                    <Input
                      placeholder="1.800"
                      value={condominio}
                      onChange={handleCurrencyChange(setCondominio)}
                      className="pl-9"
                      inputMode="numeric"
                    />
                  </div>
                </div>
                
                <div className={fieldClass}>
                  <Label>IPTU <span className="text-muted-foreground font-normal text-xs">(R$/ano)</span></Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">R$</span>
                    <Input
                      placeholder="4.200"
                      value={iptu}
                      onChange={handleCurrencyChange(setIptu)}
                      className="pl-9"
                      inputMode="numeric"
                    />
                  </div>
                </div>
                
                <div className={fieldClass}>
                  <Label>Comissão (%)</Label>
                  <Input type="number" step="0.1" placeholder="6" value={comissao} onChange={(e) => setComissao(e.target.value)} />
                </div>
              </div>
            )}

            {activeTab === "context" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
                <div className={fieldClass}>
                  <Label>Expectativa de venda</Label>
                  <Input placeholder="Ex: 30 a 60 dias" value={expectativaVenda} onChange={(e) => setExpectativaVenda(e.target.value)} />
                </div>
                
                <div className={`${fieldClass} md:col-span-2`}>
                  <Label>Perfil esperado do comprador</Label>
                  <Textarea placeholder="Descreva o perfil ideal: faixa etária, renda, estilo de vida..." rows={3} value={perfilComprador} onChange={(e) => setPerfilComprador(e.target.value)} />
                </div>
              </div>
            )}

            {activeTab === "owner" && (
              <div className="grid grid-cols-1 gap-5 max-w-3xl">
                <div className={fieldClass}>
                  <Label>Contato e Info do proprietário</Label>
                  <Textarea placeholder="Nome, telefone, e-mail, observações..." rows={4} value={infoProprietario} onChange={(e) => setInfoProprietario(e.target.value)} />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mt-8 max-w-3xl">
              <Button type="submit" className="gap-2" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isLoading ? "Salvando..." : (isEditing ? "Salvar Alterações" : "Salvar Imóvel")}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={isLoading}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyRegister;