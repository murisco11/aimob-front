import { useWhatsappStore } from "@/stores/whatsappStore";

export const useWhatsapp = () => {
  const store = useWhatsappStore();

  return {
    qrCode: store.qrCode,
    status: store.status,
    isLoading: store.isLoading,
    error: store.error,
    disconnect: store.disconnect,
    reconnect: store.reconnect,
    generateQrCode: store.generateQrCode,
    checkStatus: store.checkStatus,
    clearQrCode: store.clearQrCode
  };
};