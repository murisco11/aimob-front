import { leadService } from "@/services/leadService";
import { Lead } from "@/services/types";
import { create } from "zustand";

export interface LeadStore {
    leads: Lead[]
    isLoading: boolean;
    error: string | null

    fetchLeads: () => Promise<void>;
}

export const useLeadStore = create<LeadStore>()(
    (set) => ({
        leads: [],
        isLoading: false,
        error: null,

        fetchLeads: async () => {
            try {
                set({ isLoading: true, error: null });
                const leads = await leadService.getLeads();

                set({ leads: leads, isLoading: false });
            } catch (error) {
                console.error("Failed to fetch leads:", error);
                set({ error: "Failed to fetch leads", isLoading: false });
            }
        }
    })
);

// export interface AuthStore {
//   user: AuthUser | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   error: string | null;

//   login: (credentials: LoginInput) => Promise<void>;
//   logout: () => Promise<void>;
//   checkAuth: () => Promise<void>;
//   setError: (error: string | null) => void;
// }

// export const useAuthStore = create<AuthStore>()(
//   persist(
//     (set) => ({
//       user: null,
//       isAuthenticated: false,
//       isLoading: true,
//       error: null,

//       login: async (credentials: LoginInput) => {
//         try {
//           set({ isLoading: true, error: null });
//           const response: AuthResponse = await authService.login(credentials);
//           apiClient.setToken(response.token);
//           set({
//             user: response.user,
//             isAuthenticated: true,
//             error: null,
//             isLoading: false,
//           });
//         } catch (err) {
//           const message = err instanceof Error ? err.message : "Falha ao fazer login";
//           set({
//             error: message,
//             isLoading: false,
//             user: null,
//             isAuthenticated: false,
//           });
//           throw err;
//         }
//       },

//       logout: async () => {
//         try {
//           set({ isLoading: true });
//           await authService.logout();
//           apiClient.clearToken();
//           set({
//             user: null,
//             isAuthenticated: false,
//             error: null,
//             isLoading: false,
//           });
//         } catch (err) {
//           const message = err instanceof Error ? err.message : "Falha ao fazer logout";
//           set({ error: message, isLoading: false });
//           throw err;
//         }
//       },

//       checkAuth: async () => {
//         try {
//           set({ isLoading: true });
//           const token = apiClient.getToken();

//           if (token) {
//             const currentUser = await authService.getCurrentUser();
//             set({
//               user: currentUser,
//               isAuthenticated: true,
//               error: null,
//               isLoading: false,
//             });
//           } else {
//             set({
//               user: null,
//               isAuthenticated: false,
//               isLoading: false,
//             });
//           }
//         } catch (err) {
//           apiClient.clearToken();
//           const message = err instanceof Error ? err.message : "Falha ao verificar autenticação";
//           set({
//             user: null,
//             isAuthenticated: false,
//             error: message,
//             isLoading: false,
//           });
//         }
//       },

//       setError: (error: string | null) => {
//         set({ error });
//       },
//     }),
//     {
//       name: "auth-store",
//       partialize: (state) => ({
//         user: state.user,
//         isAuthenticated: state.isAuthenticated,
//       }),
//     }
//   )
// );
