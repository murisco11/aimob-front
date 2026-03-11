import { apiClient } from "./api";
import { CreateAccountCheckoutDto, CheckoutResponse } from "@/types/CheckoutType";

export const checkoutService = {
  async createAccountAndCheckout(data: CreateAccountCheckoutDto): Promise<CheckoutResponse> {
    const response = await apiClient.post<CheckoutResponse>("/checkout", data);
    return response.data;
  }
};