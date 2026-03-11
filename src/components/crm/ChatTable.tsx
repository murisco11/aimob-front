import { useState } from "react";
import {
  Instagram,
  MessageCircle,
  User as UserIcon,
  MoreVertical,
  Trash2,
  Edit,
  Search
} from "lucide-react";
import { Chat } from "@/types/ChatType"
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatTableProps {
  chats: Chat[];
  selectedChatId: number | null;
  onSelectChat: (id: number) => void;
  onEditChat?: (id: number) => void;
  onDeleteChat?: (id: number) => void;
}

const ChatTable = ({ chats, selectedChatId, onSelectChat, onEditChat, onDeleteChat }: ChatTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSorted, setIsSorted] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "ia" | "human">("all");

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  let displayedChats = chats.filter(chat => {
    const term = searchTerm.toLowerCase();
    const leadName = chat.lead?.name?.toLowerCase() || "";
    const lastMsg = chat.lastMessage?.toLowerCase() || "";
    const matchesSearch = leadName.includes(term) || lastMsg.includes(term);

    let matchesMode = true;
    if (filterMode === "ia") matchesMode = !!chat.lead?.aiActive;
    if (filterMode === "human") matchesMode = !chat.lead?.aiActive;

    return matchesSearch && matchesMode;
  });

  if (isSorted) {
    const pesos: Record<string, number> = {
      "hot": 3,
      "warm": 2,
      "cold": 1,
    };

    displayedChats.sort((a, b) => {
      const pesoA = pesos[a.lead?.temperatura || ""] || 0;
      const pesoB = pesos[b.lead?.temperatura || ""] || 0;
      return pesoB - pesoA;
    });

  }
  const toggleFilterMode = () => {
    if (filterMode === "all") setFilterMode("ia");
    else if (filterMode === "ia") setFilterMode("human");
    else setFilterMode("all");
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden w-full h-full flex flex-col">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-md font-semibold text-card-foreground">Chats</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {displayedChats.length} atendimentos filtrados
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsSorted(!isSorted)}
            className={`text-xs px-2 py-1 rounded-md transition-colors ${isSorted ? "bg-orange-500 text-white" : "text-muted-foreground bg-muted hover:bg-muted/80"
              }`}
          >
            {isSorted ? "Ordenado por Temp." : "Mais Quentes"}
          </button>

          <button
            onClick={toggleFilterMode}
            className={`text-xs px-2 py-1 rounded-md transition-colors border ${filterMode === "ia"
              ? "bg-blue-600 text-white border-blue-600"
              : filterMode === "human"
                ? "bg-green-600 text-white border-green-600"
                : "text-muted-foreground bg-muted border-transparent"
              }`}
          >
            {filterMode === "all" && "Todos"}
            {filterMode === "ia" && "Somente IA"}
            {filterMode === "human" && "Somente Humano"}
          </button>
        </div>
      </div>

      <div className="p-3 border-b border-border bg-background/50">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar leads ou mensagens..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-muted rounded-md border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>
      </div>

      <div className="divide-y divide-border overflow-y-auto flex-1 scrollbar-thin">
        {displayedChats.map((chat) => (
          <div
            key={chat.id}
            className={`w-full flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/50 group ${selectedChatId === chat.id ? "bg-primary/5 border-l-2 border-l-primary" : "border-l-2 border-l-transparent"
              }`}
          >
            <button
              onClick={() => onSelectChat(chat.id)}
              className="flex-1 flex items-center gap-4 text-left min-w-0"
            >
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-secondary-foreground">
                  {chat.lead?.name ? getInitials(chat.lead.name) : <UserIcon className="w-5 h-5" />}
                </div>

                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-card shadow-sm flex items-center justify-center">
                  <MessageCircle className="w-2.5 h-2.5 text-green-500" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-card-foreground truncate">
                    {chat.lead?.name || "Lead Desconhecido"}
                  </span>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {chat.lastMessageAt && formatDistanceToNow(new Date(chat.lastMessageAt), {
                      addSuffix: false,
                      locale: ptBR
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  <div className={`w-2 h-2 rounded-full ${chat.status === 'open' ? 'bg-green-500' :
                    chat.status === 'pending' ? 'bg-yellow-500' : 'bg-slate-400'
                    }`} />
                  <p className="text-xs text-muted-foreground truncate italic">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>

              {chat.lead?.temperatura && (
                <div className="shrink-0 flex flex-col items-end">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${chat.lead.temperatura === 'hot' ? 'bg-red-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                    {chat.lead.temperatura}
                  </span>
                </div>
              )}
            </button>

            <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onEditChat) onEditChat(chat.id);
                    }}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDeleteChat) onDeleteChat(chat.id);
                    }}
                    className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatTable;