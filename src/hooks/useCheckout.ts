import { useCheckoutStore } from "@/stores/checkoutStore";

export const useCheckout = () => {
  const store = useCheckoutStore();

  return {
    isLoading: store.isLoading,
    error: store.error,
    createAccountAndPay: store.createAccountAndPay
  };
};