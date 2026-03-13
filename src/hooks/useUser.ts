import { useUserStore } from "@/stores/userStore";

export const useUser = () => {
  const store = useUserStore();

  return {
    user: store.selectedItem,
    isLoading: store.isLoading,
    error: store.error,
    fetchUser: store.fetchUser,
    updateUser: store.updateItem,
    clearUser: store.clearSelected
  };
};