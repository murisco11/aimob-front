import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Bot, MessageCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Chat } from "@/types/chatType";
import { Mensagem } from "@/types/MensagemType";
import { useChat } from "@/hooks/useChat";
import { useLead } from "@/hooks/useLead";

interface ChatInterfaceProps {
  chat: Chat;
}

const ChatInterface = ({ chat }: ChatInterfaceProps) => {
  const { toast } = useToast();
  const { fetchChatById, selectedChat, sendMessage } = useChat();
  const { updateLeadAiActive } = useLead()
  const [input, setInput] = useState("");
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMensagensDoChat = async () => {
      if (!chat?.id) return;

      setMensagens([]);
      setIsLoading(true);

      try {
        await fetchChatById(chat.id);
      } catch (error) {
        toast({
          title: "Erro ao carregar mensagens",
          description: "Não foi possível carregar o histórico desta conversa.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMensagensDoChat();
  }, [chat?.id, fetchChatById, toast]);

  useEffect(() => {
    if (selectedChat && Array.isArray(selectedChat)) {
      setMensagens(selectedChat);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const leadName = chat.lead?.name || "Lead Desconhecido";
  const avatarLetter = leadName.charAt(0).toUpperCase();

  const enviarMensagem = async () => {
    if (!input.trim()) return;

    try {
      await sendMessage({ conversaId: chat.id, text: input });
      setInput("");
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagens",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive",
      });
    }
  };

    const changeAiActive = async () => {
    try {
      await updateLeadAiActive(chat.lead.id, !chat.lead.aiActive);
      setInput("");
    } catch (error) {
      toast({
        title: "Erro ao atualizar inteligência artificial",
        description: "Não foi possível atualizar inteligência artificial",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-secondary-foreground">
              {avatarLetter}
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card ${chat.status === 'open' ? 'bg-success' : 'bg-muted-foreground'}`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-card-foreground">{leadName}</h3>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <MessageCircle className="w-3 h-3 text-green-500" />
              Status: {chat.status === "open" ? "Aberto" : "Fechado"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5">
            <Bot className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-card-foreground">Inteligência Artifical</span>
            <Switch checked={chat.lead.aiActive} onCheckedChange={changeAiActive} className="scale-75" />
          </div>
        </div>
      </div>

      {chat.lead && (
        <div className="mx-4 mt-3 p-3.5 bg-primary/5 border border-primary/15 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">Info do Lead</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Status do Chat</p>
              <p className="text-sm font-medium text-card-foreground mt-0.5 capitalize">{chat.status}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            Carregando mensagens...
          </div>
        ) : mensagens.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            Nenhuma mensagem encontrada.
          </div>
        ) : (
          <>
            {mensagens.map((msg) => (
              <div key={msg.id} className={`flex ${!msg.fromMe ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl ${!msg.fromMe
                    ? "bg-chat-other text-chat-other-foreground rounded-bl-md"
                    : "bg-chat-self text-chat-self-foreground rounded-br-md"
                    }`}
                >
                  {msg.fromMe && msg.type === "ai" && (
                    <div className="flex items-center gap-1 mb-1">
                      <Bot className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-medium text-primary">AI Auto-reply</span>
                    </div>
                  )}

                  <p className="text-sm leading-relaxed">{msg.body}</p>
                  <p className={`text-[10px] mt-1 text-right ${!msg.fromMe ? "text-muted-foreground" : "text-chat-self-foreground/70"
                    }`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
            placeholder="Digite uma mensagem..."
            className="flex-1 bg-transparent text-sm text-card-foreground placeholder:text-muted-foreground outline-none"
            disabled={chat.status === "closed"}
          />
          <button
            onClick={enviarMensagem}
            disabled={!input.trim() || chat.status === "closed"}
            className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;