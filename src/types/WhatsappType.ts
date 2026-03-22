export type WhatsappStatus = "open" | "connecting" | "close" | "disconnected";

export interface WhatsappConnectResponse {
  instanceName: string;
  qrCodeBase64?: string;
}

export interface WhatsappStatusResponse {
  status: WhatsappStatus;
}