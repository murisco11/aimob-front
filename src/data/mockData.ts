export type PipelineStage = "new" | "ai_qualifying" | "visit_scheduled" | "negotiating" | "closed";

export interface Lead {
  id: string;
  name: string;
  avatar: string;
  origin: "instagram" | "whatsapp" | "landing_page";
  status: "hot" | "warm" | "cold";
  summary: string;
  budget: string;
  neighborhood: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  pipelineStage: PipelineStage;
  phone?: string;
  email?: string;
  propertyId?: string;
  enteredAt: string;
  qualifiedAt?: string;
  notes?: string;
}

export interface Message {
  id: string;
  sender: "lead" | "agent" | "ai";
  text: string;
  time: string;
}

export interface PropertySocialPost {
  id: string;
  platform: "instagram" | "facebook";
  type: "post" | "reel";
  thumbnail: string;
  caption: string;
  likes: number;
  comments: number;
  status: "posted" | "scheduled";
  date: string;
}

export interface PropertyMedia {
  id: string;
  type: "photo" | "video";
  url: string;
  label: string;
}

export interface Property {
  id: string;
  title: string;
  address: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  status: "active" | "pending" | "sold";
  suites: number;
  garageSpots: number;
  condoFee: string;
  iptu: string;
  description: string;
  interestedLeadIds: string[];
  socialPosts: PropertySocialPost[];
  media: PropertyMedia[];
  aiTrained: boolean;
}

export const leads: Lead[] = [
  {
    id: "1",
    name: "Marina Costa",
    avatar: "MC",
    origin: "instagram",
    status: "hot",
    summary: "Busca 3 quartos em Ponta Negra, pronta para fechar",
    budget: "R$ 1.2M – R$ 1.8M",
    neighborhood: "Ponta Negra",
    lastMessage: "Podemos agendar visita neste fim de semana?",
    lastMessageTime: "2 min ago",
    unread: 3,
    pipelineStage: "visit_scheduled",
    phone: "+55 84 99912-3456",
    email: "marina.costa@email.com",
    propertyId: "1",
    enteredAt: "2026-01-28",
    qualifiedAt: "2026-01-30",
    notes: "Muito interessada na cobertura. Quer fechar rápido.",
  },
  {
    id: "2",
    name: "Ricardo Almeida",
    avatar: "RA",
    origin: "whatsapp",
    status: "hot",
    summary: "Investidor, busca 2 unidades para renda em Capim Macio",
    budget: "R$ 800K – R$ 1.2M (x2)",
    neighborhood: "Capim Macio",
    lastMessage: "Qual o ROI da unidade em Capim Macio?",
    lastMessageTime: "15 min ago",
    unread: 1,
    pipelineStage: "negotiating",
    phone: "+55 84 99876-5432",
    email: "ricardo.almeida@invest.com",
    propertyId: "2",
    enteredAt: "2026-01-15",
    qualifiedAt: "2026-01-18",
    notes: "Investidor experiente. Quer proposta formal com projeção de ROI.",
  },
  {
    id: "3",
    name: "Fernanda Lima",
    avatar: "FL",
    origin: "instagram",
    status: "warm",
    summary: "Primeira compra, precisa orientação de financiamento em Lagoa Nova",
    budget: "R$ 450K – R$ 600K",
    neighborhood: "Lagoa Nova",
    lastMessage: "Você conhece um bom corretor de financiamento?",
    lastMessageTime: "1 hr ago",
    unread: 0,
    pipelineStage: "ai_qualifying",
    phone: "+55 84 99834-1122",
    email: "fernanda.lima@gmail.com",
    propertyId: "4",
    enteredAt: "2026-02-05",
    qualifiedAt: "2026-02-07",
  },
  {
    id: "4",
    name: "Carlos Mendes",
    avatar: "CM",
    origin: "whatsapp",
    status: "warm",
    summary: "Mudando de SP, explorando bairros em Capim Macio",
    budget: "R$ 900K – R$ 1.5M",
    neighborhood: "Capim Macio / Ponta Negra",
    lastMessage: "Como é o trânsito saindo de Capim Macio?",
    lastMessageTime: "3 hrs ago",
    unread: 0,
    pipelineStage: "ai_qualifying",
    phone: "+55 11 99999-8888",
    propertyId: "3",
    enteredAt: "2026-02-01",
  },
  {
    id: "5",
    name: "Ana Beatriz",
    avatar: "AB",
    origin: "landing_page",
    status: "cold",
    summary: "Navegando casualmente, sem urgência. Interesse em Lagoa Nova.",
    budget: "R$ 300K – R$ 500K",
    neighborhood: "Lagoa Nova",
    lastMessage: "Só curiosidade sobre preços em Lagoa Nova",
    lastMessageTime: "2 days ago",
    unread: 0,
    pipelineStage: "new",
    email: "anab@hotmail.com",
    enteredAt: "2026-02-12",
  },
  {
    id: "6",
    name: "Paulo Henrique",
    avatar: "PH",
    origin: "whatsapp",
    status: "cold",
    summary: "Consultou uma vez, sem retorno",
    budget: "Não informado",
    neighborhood: "Niterói",
    lastMessage: "Obrigado pelas informações",
    lastMessageTime: "5 days ago",
    unread: 0,
    pipelineStage: "new",
    enteredAt: "2026-02-08",
  },
  {
    id: "7",
    name: "Juliana Oliveira",
    avatar: "JO",
    origin: "instagram",
    status: "hot",
    summary: "Quer apart 2 quartos perto da praia de Ponta Negra",
    budget: "R$ 500K – R$ 750K",
    neighborhood: "Ponta Negra",
    lastMessage: "Adorei o vídeo do apart! Podemos agendar visita?",
    lastMessageTime: "30 min ago",
    unread: 2,
    pipelineStage: "visit_scheduled",
    phone: "+55 84 99901-7788",
    email: "juliana.o@gmail.com",
    propertyId: "3",
    enteredAt: "2026-02-02",
    qualifiedAt: "2026-02-04",
    notes: "Veio pelo Reels. Muito engajada.",
  },
  {
    id: "8",
    name: "Thiago Santos",
    avatar: "TS",
    origin: "landing_page",
    status: "warm",
    summary: "Interessado em lançamento em Capim Macio para morar",
    budget: "R$ 600K – R$ 900K",
    neighborhood: "Capim Macio",
    lastMessage: "Tem previsão de entrega?",
    lastMessageTime: "6 hrs ago",
    unread: 0,
    pipelineStage: "negotiating",
    phone: "+55 84 99855-6644",
    email: "thiago.s@outlook.com",
    propertyId: "2",
    enteredAt: "2026-01-20",
    qualifiedAt: "2026-01-25",
  },
  {
    id: "9",
    name: "Camila Ribeiro",
    avatar: "CR",
    origin: "whatsapp",
    status: "hot",
    summary: "Fechou negócio! Comprou unidade em Ponta Negra.",
    budget: "R$ 700K",
    neighborhood: "Ponta Negra",
    lastMessage: "Documentação está pronta?",
    lastMessageTime: "1 day ago",
    unread: 0,
    pipelineStage: "closed",
    phone: "+55 84 99877-3344",
    email: "camila.r@gmail.com",
    propertyId: "1",
    enteredAt: "2026-01-10",
    qualifiedAt: "2026-01-12",
    notes: "Negócio fechado em 2 semanas. Cliente referência.",
  },
];

export const messages: Message[] = [
  { id: "1", sender: "lead", text: "Hi! I saw your listing on Instagram for the apartment in Ipanema. Is it still available?", time: "10:30 AM" },
  { id: "2", sender: "agent", text: "Hi Marina! Yes, the Ipanema unit is still available. It's a beautiful 3-bedroom with ocean views. Would you like to schedule a visit?", time: "10:32 AM" },
  { id: "3", sender: "lead", text: "That sounds perfect! What's the asking price?", time: "10:33 AM" },
  { id: "4", sender: "ai", text: "Auto-reply: The asking price is R$ 1.45M. I've attached the full listing details including floor plans and building amenities.", time: "10:33 AM" },
  { id: "5", sender: "lead", text: "That's within my budget. I'd love to see it in person.", time: "10:35 AM" },
  { id: "6", sender: "agent", text: "Great! I have availability this Saturday at 10 AM or 2 PM. Which works better for you?", time: "10:38 AM" },
  { id: "7", sender: "lead", text: "Saturday at 2 PM would be great!", time: "10:40 AM" },
  { id: "8", sender: "lead", text: "Can we schedule a visit this weekend?", time: "10:42 AM" },
];

export interface Visit {
  id: string;
  leadId: string;
  leadName: string;
  leadAvatar: string;
  propertyTitle: string;
  propertyAddress: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  hasRecording: boolean;
  recordingDuration?: string;
  notes?: string;
}

export const visits: Visit[] = [
  {
    id: "v1",
    leadId: "1",
    leadName: "Marina Costa",
    leadAvatar: "MC",
    propertyTitle: "Ocean View Penthouse",
    propertyAddress: "Rua Vinícius de Moraes, Ipanema",
    date: "2026-02-14",
    time: "14:00",
    status: "scheduled",
    hasRecording: false,
    notes: "Lead quer ver a varanda e a vista do mar",
  },
  {
    id: "v2",
    leadId: "2",
    leadName: "Ricardo Almeida",
    leadAvatar: "RA",
    propertyTitle: "Modern Studio",
    propertyAddress: "Av. Atlântica, Copacabana",
    date: "2026-02-14",
    time: "10:00",
    status: "completed",
    hasRecording: true,
    recordingDuration: "23:45",
    notes: "Interessado no ROI. Pediu proposta formal.",
  },
  {
    id: "v3",
    leadId: "4",
    leadName: "Carlos Mendes",
    leadAvatar: "CM",
    propertyTitle: "Garden Duplex",
    propertyAddress: "Rua Voluntários da Pátria, Botafogo",
    date: "2026-02-15",
    time: "11:00",
    status: "scheduled",
    hasRecording: false,
  },
  {
    id: "v4",
    leadId: "3",
    leadName: "Fernanda Lima",
    leadAvatar: "FL",
    propertyTitle: "Renovated Classic",
    propertyAddress: "Rua Conde de Bonfim, Tijuca",
    date: "2026-02-12",
    time: "15:30",
    status: "completed",
    hasRecording: true,
    recordingDuration: "18:12",
    notes: "Gostou do imóvel, vai consultar financiamento.",
  },
  {
    id: "v5",
    leadId: "5",
    leadName: "Ana Beatriz",
    leadAvatar: "AB",
    propertyTitle: "Ocean View Penthouse",
    propertyAddress: "Rua Vinícius de Moraes, Ipanema",
    date: "2026-02-10",
    time: "09:00",
    status: "cancelled",
    hasRecording: false,
    notes: "Lead cancelou por conflito de agenda.",
  },
  {
    id: "v6",
    leadId: "1",
    leadName: "Marina Costa",
    leadAvatar: "MC",
    propertyTitle: "Garden Duplex",
    propertyAddress: "Rua Voluntários da Pátria, Botafogo",
    date: "2026-02-16",
    time: "16:00",
    status: "scheduled",
    hasRecording: false,
  },
];

export const properties: Property[] = [
  {
    id: "1",
    title: "Ocean View Penthouse",
    address: "Rua Vinícius de Moraes, Ipanema",
    price: "R$ 1,450,000",
    beds: 3,
    baths: 2,
    sqft: 1800,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    status: "active",
    suites: 2,
    garageSpots: 2,
    condoFee: "R$ 1.800",
    iptu: "R$ 4.200/ano",
    description: "Cobertura deslumbrante com vista panorâmica para o mar de Ipanema. Acabamento de alto padrão, varanda gourmet com churrasqueira, piscina privativa e 3 suítes amplas. Localização privilegiada a 2 quadras da praia, próximo a restaurantes e comércio. Ideal para famílias que buscam qualidade de vida com sofisticação.",
    interestedLeadIds: ["1", "2", "5"],
    socialPosts: [
      { id: "sp1", platform: "instagram", type: "reel", thumbnail: "", caption: "✨ Tour virtual pela cobertura em Ipanema! Vista que encanta...", likes: 342, comments: 28, status: "posted", date: "2026-02-10" },
      { id: "sp2", platform: "instagram", type: "post", thumbnail: "", caption: "Amanhecer visto da varanda. Quem quer acordar assim? 🌅", likes: 189, comments: 15, status: "posted", date: "2026-02-08" },
      { id: "sp3", platform: "instagram", type: "reel", thumbnail: "", caption: "Detalhes do acabamento premium desta cobertura", likes: 0, comments: 0, status: "scheduled", date: "2026-02-16" },
    ],
    media: [
      { id: "m1", type: "photo", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop", label: "Fachada" },
      { id: "m2", type: "photo", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop", label: "Sala de estar" },
      { id: "m3", type: "photo", url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop", label: "Varanda" },
      { id: "m4", type: "video", url: "", label: "Tour Virtual 360°" },
    ],
    aiTrained: true,
  },
  {
    id: "2",
    title: "Modern Studio",
    address: "Av. Atlântica, Copacabana",
    price: "R$ 520,000",
    beds: 1,
    baths: 1,
    sqft: 650,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
    status: "active",
    suites: 1,
    garageSpots: 1,
    condoFee: "R$ 950",
    iptu: "R$ 1.800/ano",
    description: "Studio moderno e funcional em frente à praia de Copacabana. Projeto de interiores assinado, cozinha americana integrada e varanda com vista lateral para o mar. Perfeito para investidores que buscam alta rentabilidade com aluguel por temporada.",
    interestedLeadIds: ["2"],
    socialPosts: [
      { id: "sp4", platform: "instagram", type: "post", thumbnail: "", caption: "Investimento inteligente em Copa 📊 Studio com vista mar", likes: 95, comments: 8, status: "posted", date: "2026-02-05" },
    ],
    media: [
      { id: "m5", type: "photo", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop", label: "Vista geral" },
      { id: "m6", type: "photo", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop", label: "Quarto" },
    ],
    aiTrained: false,
  },
  {
    id: "3",
    title: "Garden Duplex",
    address: "Rua Voluntários da Pátria, Botafogo",
    price: "R$ 980,000",
    beds: 2,
    baths: 2,
    sqft: 1200,
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop",
    status: "pending",
    suites: 1,
    garageSpots: 1,
    condoFee: "R$ 1.200",
    iptu: "R$ 2.800/ano",
    description: "Duplex charmoso com jardim privativo em Botafogo. Primeiro andar com living amplo e cozinha gourmet, segundo andar com 2 quartos sendo 1 suíte. Área externa com jardim de 40m², perfeita para pets e crianças. Condomínio com lazer completo.",
    interestedLeadIds: ["1", "4"],
    socialPosts: [
      { id: "sp5", platform: "instagram", type: "reel", thumbnail: "", caption: "Jardim privativo no coração de Botafogo 🌿", likes: 210, comments: 19, status: "posted", date: "2026-02-11" },
    ],
    media: [
      { id: "m7", type: "photo", url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop", label: "Fachada" },
      { id: "m8", type: "photo", url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop", label: "Jardim" },
    ],
    aiTrained: true,
  },
  {
    id: "4",
    title: "Renovated Classic",
    address: "Rua Conde de Bonfim, Tijuca",
    price: "R$ 480,000",
    beds: 2,
    baths: 1,
    sqft: 900,
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop",
    status: "active",
    suites: 0,
    garageSpots: 1,
    condoFee: "R$ 680",
    iptu: "R$ 1.400/ano",
    description: "Apartamento clássico totalmente reformado na Tijuca. Piso em porcelanato, iluminação planejada e bancadas em granito. Localização estratégica próxima ao metrô e shopping. Ótimo custo-benefício para primeiro imóvel ou investimento.",
    interestedLeadIds: ["3"],
    socialPosts: [],
    media: [
      { id: "m9", type: "photo", url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop", label: "Sala" },
    ],
    aiTrained: false,
  },
];
