import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import ChatTable from "@/components/crm/ChatTable";
import ChatInterface from "@/components/crm/ChatInterface";
import PropertyPanel from "@/components/crm/PropertyPanel"
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
        <MobileHeader />

        <div className="flex-1 flex overflow-hidden">
          <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 p-3 border-r border-border flex flex-col">
            <ChatTable
              chats={chats}
              selectedChatId={selectedChatId}
              onSelectChat={setSelectedChatId}
              onEditChat={onEditChat}
              onDeleteChat={onDeleteChat}
            />
          </div>

          <div className="hidden md:flex flex-1 min-w-0 p-3">
            {selectedChat ? (
              <ChatInterface chat={selectedChat} />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Selecione um chat para iniciar
              </div>
            )}
          </div>
          {selectedChat &&
            <div className="hidden xl:flex w-[340px] flex-col shrink-0 p-3 border-l border-border">
              <PropertyPanel
                leadId={Number(selectedChat.lead.id)}
              />
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Index;