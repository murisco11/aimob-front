import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, Save, Home, DollarSign, User, FileText } from "lucide-react";
import { toast } from "sonner";

type TabKey = "info" | "financial" | "context" | "owner";

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "info", label: "Informações", icon: <Home className="w-4 h-4" /> },
  { key: "financial", label: "Financeiro", icon: <DollarSign className="w-4 h-4" /> },
  { key: "context", label: "Contexto", icon: <FileText className="w-4 h-4" /> },
  { key: "owner", label: "Proprietário", icon: <User className="w-4 h-4" /> },
];

interface FieldErrors {
  title?: string;
  address?: string;
  propertyType?: string;
  price?: string;
}

const PropertyRegister = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>("info");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  // Info fields
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [description, setDescription] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [area, setArea] = useState("");
  const [floor, setFloor] = useState("");
  const [parkingSpots, setParkingSpots] = useState("");
  const [acceptsPets, setAcceptsPets] = useState(false);
  const [furnished, setFurnished] = useState(false);

  // Financial
  const [price, setPrice] = useState("");
  const [condoFee, setCondoFee] = useState("");
  const [iptu, setIptu] = useState("");

  const formatCurrency = (raw: string): string => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return "";
    const number = parseInt(digits, 10);
    return number.toLocaleString("pt-BR");
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
  const [commission, setCommission] = useState("");

  // Context
  const [publicationStatus, setPublicationStatus] = useState("");
  const [expectedProfile, setExpectedProfile] = useState("");
  const [saleExpectation, setSaleExpectation] = useState("");

  // Owner
  const [ownerContact, setOwnerContact] = useState("");

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (!title.trim()) errs.title = "Título é obrigatório";
    else if (title.trim().length > 150) errs.title = "Máximo 150 caracteres";
    if (!address.trim()) errs.address = "Endereço é obrigatório";
    else if (address.trim().length > 250) errs.address = "Máximo 250 caracteres";
    if (!propertyType) errs.propertyType = "Selecione o tipo";
    if (!price.replace(/\D/g, "")) errs.price = "Preço é obrigatório";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      // Navigate to the tab with the first error
      if (errs.title || errs.address || errs.propertyType) {
        setActiveTab("info");
      } else if (errs.price) {
        setActiveTab("financial");
      }
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    toast.success("Imóvel cadastrado com sucesso!");
    navigate("/properties");
  };

  // Re-validate on change when already submitted
  const onChangeField = (field: keyof FieldErrors, value: string) => {
    if (field === "title") setTitle(value);
    if (field === "address") setAddress(value);
    if (field === "price") setPrice(value);
    if (submitted) {
      setErrors((prev) => {
        const next = { ...prev };
        if (value.trim()) delete next[field];
        else next[field] = `${field === "title" ? "Título" : field === "address" ? "Endereço" : "Preço"} é obrigatório`;
        return next;
      });
    }
  };

  const onChangePropertyType = (value: string) => {
    setPropertyType(value);
    if (submitted) {
      setErrors((prev) => {
        const next = { ...prev };
        if (value) delete next.propertyType;
        else next.propertyType = "Selecione o tipo";
        return next;
      });
    }
  };

  const errorClass = "border-destructive focus-visible:ring-destructive";
  const fieldClass = "space-y-2";

  const RequiredDot = () => (
    <span className="text-destructive ml-0.5">*</span>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <CrmSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Header */}
          <div className="px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigate("/properties")}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Cadastrar Imóvel</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Preencha as informações do novo imóvel
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {activeTab === "info" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
                <div className={`${fieldClass} md:col-span-2`}>
                  <Label>Título<RequiredDot /></Label>
                  <Input
                    placeholder="Ex: Apartamento 3 quartos em Ponta Negra"
                    value={title}
                    onChange={(e) => onChangeField("title", e.target.value)}
                    className={errors.title ? errorClass : ""}
                    maxLength={150}
                  />
                  {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                </div>
                <div className={`${fieldClass} md:col-span-2`}>
                  <Label>Endereço<RequiredDot /></Label>
                  <Input
                    placeholder="Rua, número, bairro, cidade"
                    value={address}
                    onChange={(e) => onChangeField("address", e.target.value)}
                    className={errors.address ? errorClass : ""}
                    maxLength={250}
                  />
                  {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
                </div>
                <div className={fieldClass}>
                  <Label>Tipo do imóvel<RequiredDot /></Label>
                  <Select value={propertyType} onValueChange={onChangePropertyType}>
                    <SelectTrigger className={errors.propertyType ? errorClass : ""}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartamento</SelectItem>
                      <SelectItem value="house">Casa</SelectItem>
                      <SelectItem value="commercial">Comercial</SelectItem>
                      <SelectItem value="land">Terreno</SelectItem>
                      <SelectItem value="studio">Studio/Kitnet</SelectItem>
                      <SelectItem value="penthouse">Cobertura</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.propertyType && <p className="text-xs text-destructive">{errors.propertyType}</p>}
                </div>
                <div className={fieldClass}>
                  <Label>Área (m²)</Label>
                  <Input type="number" placeholder="120" value={area} onChange={(e) => setArea(e.target.value)} />
                </div>
                <div className={fieldClass}>
                  <Label>Quartos</Label>
                  <Input type="number" placeholder="3" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
                </div>
                <div className={fieldClass}>
                  <Label>Banheiros</Label>
                  <Input type="number" placeholder="2" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
                </div>
                <div className={fieldClass}>
                  <Label>Andar</Label>
                  <Input type="number" placeholder="8" value={floor} onChange={(e) => setFloor(e.target.value)} />
                </div>
                <div className={fieldClass}>
                  <Label>Vagas de garagem</Label>
                  <Input type="number" placeholder="2" value={parkingSpots} onChange={(e) => setParkingSpots(e.target.value)} />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <Label className="cursor-pointer">Aceita pets</Label>
                  <Switch checked={acceptsPets} onCheckedChange={setAcceptsPets} />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <Label className="cursor-pointer">Mobiliado</Label>
                  <Switch checked={furnished} onCheckedChange={setFurnished} />
                </div>
                <div className={`${fieldClass} md:col-span-2`}>
                  <Label>Descrição</Label>
                  <Textarea placeholder="Descreva o imóvel com detalhes..." rows={4} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} />
                </div>
                <div className={`${fieldClass} md:col-span-2`}>
                  <Label>Fotos</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-primary/40 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Arraste fotos ou clique para enviar</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG até 10MB cada</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "financial" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
                <div className={fieldClass}>
                  <Label>Preço<RequiredDot /></Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">R$</span>
                    <Input
                      placeholder="1.450.000"
                      value={price}
                      onChange={handleCurrencyChange(setPrice, "price")}
                      className={`pl-9 ${errors.price ? errorClass : ""}`}
                      inputMode="numeric"
                    />
                  </div>
                  {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                </div>
                <div className={fieldClass}>
                  <Label>Condomínio <span className="text-muted-foreground font-normal text-xs">(R$/mês)</span></Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">R$</span>
                    <Input
                      placeholder="1.800"
                      value={condoFee}
                      onChange={handleCurrencyChange(setCondoFee)}
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
                  <Input type="number" step="0.5" placeholder="6" value={commission} onChange={(e) => setCommission(e.target.value)} />
                </div>
              </div>
            )}

            {activeTab === "context" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
                <div className={fieldClass}>
                  <Label>Status de publicação</Label>
                  <Select value={publicationStatus} onValueChange={setPublicationStatus}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="sold">Vendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className={fieldClass}>
                  <Label>Expectativa de venda</Label>
                  <Input placeholder="Ex: 30 a 60 dias" value={saleExpectation} onChange={(e) => setSaleExpectation(e.target.value)} />
                </div>
                <div className={`${fieldClass} md:col-span-2`}>
                  <Label>Perfil esperado do comprador</Label>
                  <Textarea placeholder="Descreva o perfil ideal: faixa etária, renda, estilo de vida..." rows={3} value={expectedProfile} onChange={(e) => setExpectedProfile(e.target.value)} />
                </div>
              </div>
            )}

            {activeTab === "owner" && (
              <div className="grid grid-cols-1 gap-5 max-w-3xl">
                <div className={fieldClass}>
                  <Label>Contato do proprietário</Label>
                  <Textarea placeholder="Nome, telefone, e-mail, observações..." rows={4} value={ownerContact} onChange={(e) => setOwnerContact(e.target.value)} />
                </div>
              </div>
            )}

            {/* Footer actions */}
            <div className="flex items-center gap-3 mt-8 max-w-3xl">
              <Button type="submit" className="gap-2">
                <Save className="w-4 h-4" />
                Salvar Imóvel
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/properties")}>
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
