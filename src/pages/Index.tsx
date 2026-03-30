import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import ChatTable from "@/components/crm/ChatTable";
import ChatInterface from "@/components/crm/ChatInterface";
import PropertyPanel from "@/components/crm/PropertyPanel";
import { ArrowLeft, User } from "lucide-react";
import { io } from "socket.io-client";

import { useChat } from "@/hooks/useChat";
import { Mensagem } from "@/types/MensagemType";
import { useChatStore } from "@/stores/chatStore";
import { useConfirmStore } from "@/stores/confirmStore";
import { useLead } from "@/hooks/useLead";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate()
  const { toast } = useToast();

  const { openConfirm } = useConfirmStore();
  const chatIdFromUrl = searchParams.get("chatId");
  const { deleteLead } = useLead()

  const [selectedChatId, setSelectedChatId] = useState<number | null>(
    chatIdFromUrl ? parseInt(chatIdFromUrl) : null
  );

  // Mobile navigation: "list" | "chat" | "panel"
  const [mobileView, setMobileView] = useState<"list" | "chat" | "panel">("list");

  const { chats, fetchChats, addIncomingMessage, setActiveChatId } = useChat();

  useEffect(() => {
    setActiveChatId(selectedChatId);
  }, [selectedChatId, setActiveChatId]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3333");

    socket.on("nova_mensagem_whatsapp", (data: { conversaId: number, mensagem: Mensagem }) => {
      console.log("Chegou mensagem via Socket:", data);

      const chatExistente = useChatStore.getState().chats.find(c => c.id === data.conversaId);

      if (!chatExistente) {
        fetchChats();
        return;
      }

      const mensagemFormatada: Mensagem = {
        id: data.mensagem.id,
        waMessageId: data.mensagem.waMessageId,
        fromMe: data.mensagem.fromMe,
        body: data.mensagem.body,
        type: data.mensagem.type,
        mediaUrl: data.mensagem.mediaUrl,
        status: data.mensagem.status,
        createdAt: new Date(data.mensagem.createdAt),
        conversa: chatExistente,
        quotedMessageId: data.mensagem.quotedMessageId,
        quotedMessageBody: data.mensagem.quotedMessageBody
      };

      addIncomingMessage(data.conversaId, mensagemFormatada);
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchChats();
      } catch (error) {
        toast({ title: "Erro", description: "Erro ao carregar o chat", variant: "destructive" })
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedChat = chats.find((c) => c.id === selectedChatId) || null;

  const handleSelectChat = useCallback((id: number) => {
    setSelectedChatId(id);
    setMobileView("chat");
  }, []);

  const onEditChat = (id: number) => {
    const chatSelected = chats.find(c => c.id == id)
    navigate(`/leads?leadId=${chatSelected.lead.id}`)
  }

  const onDeleteChat = (chatId: number) => {
    setTimeout(async () => {
      try {
        const chatToDelete = chats.find(c => c.id === chatId);
        const leadId = chatToDelete?.lead?.id;

        if (!leadId) {
          toast({ title: "Erro", description: "Lead não encontrado para este chat.", variant: "destructive" });
          return;
        }

        openConfirm({
          title: "Excluir Lead",
          description: `Tem certeza que deseja remover este lead? O número deixará de aparecer no seu funil do sistema. Você poderá restaurá-lo futuramente acessando as Configurações.`,
          confirmText: "Sim, Excluir",
          onConfirm: async () => {
            await deleteLead(Number(leadId));
            toast({
              title: "Sucesso",
              description: "Lead deletado com sucesso",
              variant: "success"
            });
            await fetchChats()
          }
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao deletar lead",
          variant: "destructive"
        });
        console.error("Delete error:", error);
      }
    }, 150);
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <CrmSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header shown only on chat/panel views */}
        {mobileView === "list" && <MobileHeader />}

        {/* Mobile top bar when viewing chat or panel */}
        {mobileView !== "list" && (
          <div className="flex lg:hidden items-center gap-2 px-3 py-2 border-b border-border bg-card shrink-0">
            <button
              onClick={() => {
                if (mobileView === "panel") setMobileView("chat");
                else setMobileView("list");
              }}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold text-sm truncate flex-1">
              {mobileView === "chat" && (selectedChat?.lead?.name || "Chat")}
              {mobileView === "panel" && "Informações do Lead"}
            </span>
            {mobileView === "chat" && selectedChat && (
              <button
                onClick={() => setMobileView("panel")}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                title="Ver informações do lead"
              >
                <User className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          {/* Chat list — always visible on desktop, hidden on mobile when not on list view */}
          <div className={`${
            mobileView === "list" ? "flex" : "hidden"
          } lg:flex w-full lg:w-[340px] xl:w-[380px] shrink-0 p-3 border-r border-border flex-col`}>
            <ChatTable
              chats={chats}
              selectedChatId={selectedChatId}
              onSelectChat={handleSelectChat}
              onEditChat={onEditChat}
              onDeleteChat={onDeleteChat}
            />
          </div>

          {/* Chat area — always visible on desktop (md+), on mobile only when mobileView === "chat" */}
          <div className={`${
            mobileView === "chat" ? "flex" : "hidden"
          } md:flex flex-1 min-w-0 p-3`}>
            {selectedChat ? (
              <ChatInterface chat={selectedChat} />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Selecione um chat para iniciar
              </div>
            )}
          </div>

          {/* Property panel — always visible on desktop (xl+), on mobile only when mobileView === "panel" */}
          {selectedChat && (
            <div className={`${
              mobileView === "panel" ? "flex" : "hidden"
            } xl:flex w-full xl:w-[340px] flex-col shrink-0 p-3 border-l border-border`}>
              <PropertyPanel leadId={Number(selectedChat.lead.id)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;