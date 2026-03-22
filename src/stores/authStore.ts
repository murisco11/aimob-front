import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios"; // <-- Importação do Axios adicionada
import { AuthUser, LoginInput, AuthResponse } from "@/services/types";
import { authService } from "@/services/authService";
import { apiClient } from "@/services/api";

export interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      login: async (credentials: LoginInput) => {
        try {
          set({ isLoading: true, error: null });
          const response: AuthResponse = await authService.login(credentials);
          apiClient.setToken(response.token);
          console.log(response.user);
          set({
            user: response.user,
            isAuthenticated: true,
            error: null,
            isLoading: false,
          });
        } catch (err) {
          console.log("Erro no login:", err);
          
          let message = "Falha ao fazer login";
          if (axios.isAxiosError(err) && err.response?.data?.message) {
            message = err.response.data.message;

            if (err.response.data.code === "PAYMENT_REQUIRED" && err.response.data.url) {
              window.location.href = err.response.data.url;
              return;
            }
          } else if (err instanceof Error) {
            message = err.message;
          }

          set({
            error: message,
            isLoading: false,
            user: null,
            isAuthenticated: false,
          });
          throw err;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          await authService.logout();
          apiClient.clearToken();
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
          });
        } catch (err) {
          console.log("Erro no logout:", err);
          
          let message = "Falha ao fazer logout";
          if (axios.isAxiosError(err) && err.response?.data?.message) {
            message = err.response.data.message;
          } else if (err instanceof Error) {
            message = err.message;
          }

          set({ error: message, isLoading: false });
          throw err;
        }
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true });
          const token = apiClient.getToken();

          if (token) {
            const currentUser = await authService.getCurrentUser();
            set({
              user: currentUser,
              isAuthenticated: true,
              error: null,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (err) {
          apiClient.clearToken();
          
          let message = "Falha ao verificar autenticação";
          if (axios.isAxiosError(err) && err.response?.data?.message) {
            message = err.response.data.message;
          } else if (err instanceof Error) {
            message = err.message;
          }

          set({
            user: null,
            isAuthenticated: false,
            error: message,
            isLoading: false,
          });
        }
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);