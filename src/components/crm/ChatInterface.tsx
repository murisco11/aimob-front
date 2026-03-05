import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Bot, MessageCircle, Paperclip, Mic, X, Reply, Square } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Chat } from "@/types/ChatType";
import { Mensagem } from "@/types/MensagemType";
import { useChat } from "@/hooks/useChat";
import { useLead } from "@/hooks/useLead";

interface ChatInterfaceProps {
  chat: Chat;
}

const ChatInterface = ({ chat }: ChatInterfaceProps) => {
  const { toast } = useToast();
  const { fetchChatById, selectedChat, sendMessage, updateLeadStatusInStore } = useChat();
  const { updateLeadAiActive } = useLead();

  const [input, setInput] = useState("");
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [replyingTo, setReplyingTo] = useState<Mensagem | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
    const textToSend = input;
    const quotedId = replyingTo?.waMessageId;

    setInput("");
    setReplyingTo(null);

    try {
      await sendMessage({
        conversaId: chat.id,
        text: textToSend,
        quotedMessageId: quotedId
      });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível enviar a mensagem.", variant: "destructive" });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const quotedId = replyingTo?.waMessageId;

      setReplyingTo(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      try {
        await sendMessage({
          conversaId: chat.id,
          text: "",
          media: { type: file.type.includes('image') ? 'image' : 'document', base64, fileName: file.name },
          quotedMessageId: quotedId
        });
      } catch (error) {
        toast({ title: "Erro", description: "Falha ao enviar arquivo.", variant: "destructive" });
      }
    };
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/ogg; codecs=opus' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onload = async () => {
          const base64 = (reader.result as string).split(',')[1];
          const quotedId = replyingTo?.waMessageId;
          setReplyingTo(null);

          try {
            await sendMessage({
              conversaId: chat.id,
              text: "",
              media: { type: "audio", base64, fileName: `audio-${Date.now()}.ogg` },
              quotedMessageId: quotedId
            });
          } catch (error) {
            toast({ title: "Erro", description: "Falha ao enviar áudio.", variant: "destructive" });
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      toast({ title: "Erro", description: "Permissão de microfone negada.", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const changeAiActive = async () => {
    try {
      const novoStatus = !chat.lead.aiActive;
      await updateLeadAiActive(chat.lead.id, novoStatus);
      updateLeadStatusInStore(chat.lead.id, novoStatus);
      toast({ title: "Sucesso", description: "Status da IA atualizado!" });
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível atualizar a IA.", variant: "destructive" });
    }
  };

  const getQuotedMessage = (quotedId?: string | null) => {
    if (!quotedId) return null;
    return mensagens.find(m => m.waMessageId === quotedId);
  };

  return (
    <div className="w-full flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between z-10 bg-card">
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
        <div className="mx-4 mt-3 p-3.5 bg-primary/5 border border-primary/15 rounded-lg shrink-0">
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
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">Carregando mensagens...</div>
        ) : mensagens.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">Nenhuma mensagem encontrada.</div>
        ) : (
          <>
            {mensagens.map((msg) => {
              const quotedMsg = getQuotedMessage(msg.quotedMessageId);

              return (
                <div key={msg.id} className={`flex w-full group ${!msg.fromMe ? "justify-start" : "justify-end"}`}>

                  {/* Container interno que segura a bolha e o botão lado a lado */}
                  <div className={`flex items-center gap-2 max-w-[85%] ${msg.fromMe ? "flex-row-reverse" : "flex-row"}`}>

                    {/* BOLHA DA MENSAGEM */}
                    <div className={`px-3.5 py-2.5 rounded-2xl flex flex-col min-w-0 ${!msg.fromMe
                      ? "bg-chat-other text-chat-other-foreground rounded-bl-md"
                      : "bg-chat-self text-chat-self-foreground rounded-br-md"
                      }`}
                    >
                      {msg.quotedMessageBody && (
                        <div className={`mb-2 p-2 rounded-lg text-xs border-l-4 ${!msg.fromMe ? "bg-background/40 border-primary" : "bg-black/10 border-black/30"}`}>
                          <span className="font-semibold block mb-0.5">Mensagem respondida:</span>
                          <span className="opacity-80 line-clamp-2">
                            {msg.quotedMessageBody}
                          </span>
                        </div>
                      )}

                      {msg.fromMe && msg.type === "ai" && (
                        <div className="flex items-center gap-1 mb-1">
                          <Bot className="w-3 h-3 text-primary" />
                          <span className="text-[10px] font-medium text-primary">AI Auto-reply</span>
                        </div>
                      )}

                      {msg.type === "image" && msg.mediaUrl ? (
                        <img src={msg.mediaUrl} alt="Imagem enviada" className="rounded-lg max-w-full mb-1 max-h-60 object-contain" />
                      ) : msg.type === "audio" && msg.mediaUrl ? (
                        <audio controls src={msg.mediaUrl} className="max-w-full h-10 mb-1" />
                      ) : null}

                      {msg.body && <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.body}</p>}

                      <p className={`text-[10px] mt-1 text-right ${!msg.fromMe ? "text-muted-foreground" : "text-chat-self-foreground/70"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {/* BOTÃO DE RESPONDER */}
                    <button
                      onClick={() => setReplyingTo(msg)}
                      className="shrink-0 p-1.5 bg-muted rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted-foreground/20"
                      title="Responder"
                    >
                      <Reply className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>

                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-3 border-t border-border flex flex-col gap-2 bg-card">

        {replyingTo && (
          <div className="flex items-center justify-between bg-muted p-2 rounded-lg border-l-4 border-primary text-sm mx-1">
            <div className="flex flex-col truncate">
              <span className="font-semibold text-xs text-primary">{replyingTo.fromMe ? "Você" : leadName}</span>
              <span className="text-muted-foreground text-xs truncate">
                {replyingTo.type === "image" ? "📷 Imagem" : replyingTo.type === "audio" ? "🎵 Áudio" : replyingTo.body}
              </span>
            </div>
            <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-background rounded-md text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*, audio/*, application/pdf" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
            disabled={chat.status === "closed" || isRecording}
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <div className="flex-1 flex items-center bg-muted rounded-xl px-4 py-2.5">
            {isRecording ? (
              <div className="flex-1 flex items-center gap-2 text-destructive animate-pulse">
                <Mic className="w-4 h-4" />
                <span className="text-sm font-medium">Gravando áudio...</span>
              </div>
            ) : (
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
                placeholder="Digite uma mensagem..."
                className="flex-1 bg-transparent text-sm text-card-foreground placeholder:text-muted-foreground outline-none w-full"
                disabled={chat.status === "closed"}
              />
            )}
          </div>


          <button
            onClick={enviarMensagem}
            disabled={chat.status === "closed"}
            className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;