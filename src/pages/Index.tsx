import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CrmSidebar from "@/components/crm/CrmSidebar";
import MobileHeader from "@/components/crm/MobileHeader";
import ChatTable from "@/components/crm/ChatTable";
import ChatInterface from "@/components/crm/ChatInterface";
import PropertyPanel from "@/components/crm/PropertyPanel"
import { io } from "socket.io-client";;
import { properties } from "@/data/mockData";
import { useChat } from "@/hooks/useChat";
import { useToast } from "@/components/ui/use-toast";
import { Mensagem } from "@/types/MensagemType";
import { useChatStore } from "@/stores/chatStore";

const Index = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const chatIdFromUrl = searchParams.get("chatId");

  const [selectedChatId, setSelectedChatId] = useState<number | null>(
    chatIdFromUrl ? parseInt(chatIdFromUrl) : null
  );

  const { chats, fetchChats, addIncomingMessage } = useChat();

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3333");

    socket.on("nova_mensagem_whatsapp", (data: { conversaId: number, mensagem: any }) => {
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
      };

      addIncomingMessage(data.conversaId, mensagemFormatada);
    });

    return () => {
      socket.disconnect();
    };
  }, [addIncomingMessage]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchChats();
      } catch (error) {
        toast({
          title: "Erro ao carregar chats",
          description: error instanceof Error ? error.message : "Tente novamente mais tarde",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [fetchChats]);

  const selectedChat = chats.find((c) => c.id === selectedChatId) || null;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <CrmSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />

        <div className="flex-1 flex overflow-hidden">
          <div className="w-full lg:w-[340px] xl:w-[380px] shrink-0 overflow-y-auto p-3 border-r border-border scrollbar-thin">
            <ChatTable
              chats={chats}
              selectedChatId={selectedChatId}
              onSelectChat={setSelectedChatId}
            />
          </div>

          <div className="hidden md:flex flex-1 min-w-0 p-3">
            {selectedChat ? (
              <ChatInterface chat={selectedChat} />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Selecione uma chat para iniciar
              </div>
            )}
          </div>
          {selectedChat &&
            <div className="hidden xl:flex w-[300px] shrink-0 p-3 border-l border-border">
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