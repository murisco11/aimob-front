import { create } from "zustand";
import { checkoutService } from "@/services/checkoutService";
import { CreateAccountCheckoutDto } from "@/types/CheckoutType";

interface CheckoutStore {
  isLoading: boolean;
  error: string | null;

  createAccountAndPay: (data: CreateAccountCheckoutDto) => Promise<string>;
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  isLoading: false,
  error: null,

  createAccountAndPay: async (data: CreateAccountCheckoutDto) => {
    set({ isLoading: true, error: null });
    try {
      const response = await checkoutService.createAccountAndCheckout(data);
      set({ isLoading: false });
      
      return response.url;
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Erro ao criar conta e processar pagamento";
      set({ error: errorMessage, isLoading: false });
      throw err;
    }
  }
}));