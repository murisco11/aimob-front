import { useWhatsappStore } from "@/stores/whatsappStore";

export const useWhatsapp = () => {
  const store = useWhatsappStore();

  return {
    qrCode: store.qrCode,
    status: store.status,
    isLoading: store.isLoading,
    error: store.error,
    disconnect: store.disconnect,
    generateQrCode: store.generateQrCode,
    checkStatus: store.checkStatus,
    clearQrCode: store.clearQrCode
  };
};