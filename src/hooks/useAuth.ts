import { useAuthStore } from "@/stores/authStore";

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
    requestPasswordReset,
    resetPassword
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
    requestPasswordReset,
    resetPassword
  };
};
