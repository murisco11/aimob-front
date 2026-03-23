import { create } from "zustand";
import { whatsappService } from "@/services/whatsappService";
import { WhatsappStatus } from "@/types/WhatsappType";

interface WhatsappStore {
  qrCode: string | null;
  status: WhatsappStatus;
  isLoading: boolean;
  error: string | null;

  generateQrCode: () => Promise<void>;
  checkStatus: () => Promise<void>;
  clearQrCode: () => void;
  disconnect: () => Promise<void>; 
}

export const useWhatsappStore = create<WhatsappStore>((set, get) => ({
  qrCode: null,
  status: "disconnected",
  isLoading: false,
  error: null,

  generateQrCode: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await whatsappService.connect();
      set({ 
        qrCode: data.qrCodeBase64 || null, 
        status: "connecting",
        isLoading: false 
      });
    } catch (err) {
      console.error("Erro ao gerar QR Code:", err);
      set({ error: "Erro ao gerar QR Code", isLoading: false });
    }
  },

  checkStatus: async () => {
    try {
      const data = await whatsappService.getStatus();
      set({ status: data.status });
      
      if (data.status === "open") {
        set({ qrCode: null });
      }
    } catch (err) {
      console.error("Erro ao verificar status do WhatsApp:", err);
      set({ status: "disconnected" });
    }
  },

  clearQrCode: () => set({ qrCode: null }),
  disconnect: async () => {
    set({ isLoading: true, error: null });
    try {
      await whatsappService.logout();
      set({ 
        status: "disconnected", 
        qrCode: null, 
        isLoading: false 
      });
    } catch (err) {
      console.error("Erro ao desconectar:", err);
      set({ error: "Erro ao desconectar da instância", isLoading: false });
    }
  }
}));