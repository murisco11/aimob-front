import { Instagram, MessageCircle, User as UserIcon } from "lucide-react";
import { Chat, ChatStatus } from "@/types/chatType"
import { formatDistanceToNow } from "date-fns"; 
import { ptBR } from "date-fns/locale";

interface ChatTableProps {
  chats: Chat[];
  selectedChatId: number | null;
  onSelectChat: (id: number) => void;
}

const ChatTable = ({ chats, selectedChatId, onSelectChat }: ChatTableProps) => {
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-md font-semibold text-card-foreground">Chats</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {chats.length} atendimentos ativos
          </p>
        </div>
        <button className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md hover:bg-muted/80 transition-colors">
          Ordenar
        </button>
      </div>

      <div className="divide-y divide-border overflow-y-auto max-h-[calc(100vh-200px)]">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full flex items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-muted/50 ${
              selectedChatId === chat.id ? "bg-primary/5 border-l-2 border-l-primary" : "border-l-2 border-l-transparent"
            }`}
          >
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-secondary-foreground">
                {chat.lead?.name ? getInitials(chat.lead.name) : <UserIcon className="w-5 h-5" />}
              </div>
              
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-card shadow-sm flex items-center justify-center">
                {chat.instanceName?.toLowerCase().includes("insta") ? (
                  <Instagram className="w-2.5 h-2.5 text-pink-500" />
                ) : (
                  <MessageCircle className="w-2.5 h-2.5 text-green-500" />
                )}
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
                <div className={`w-2 h-2 rounded-full ${
                  chat.status === 'open' ? 'bg-green-500' : 
                  chat.status === 'pending' ? 'bg-yellow-500' : 'bg-slate-400'
                }`} />
                <p className="text-xs text-muted-foreground truncate italic">
                  {chat.lastMessage}
                </p>
              </div>
            </div>

            {chat.lead?.temperatura && (
               <div className="shrink-0 flex flex-col items-end">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                    chat.lead.temperatura === 'hot' ? 'bg-red-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {chat.lead.temperatura}
                  </span>
               </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatTable;