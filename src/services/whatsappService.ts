import { apiClient } from "./api";
import { WhatsappConnectResponse, WhatsappStatusResponse } from "@/types/WhatsappType";

export const whatsappService = {
  async connect(): Promise<WhatsappConnectResponse> {
    const response = await apiClient.get<WhatsappConnectResponse>("/whatsapp/connect");
    return response.data;
  },

  async getStatus(): Promise<WhatsappStatusResponse> {
    const response = await apiClient.get<WhatsappStatusResponse>("/whatsapp/status");
    return response.data;
  }
};