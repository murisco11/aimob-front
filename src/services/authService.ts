import { apiClient } from "./api";
import { LoginInput, AuthUser, AuthResponse } from "./types";

export const authService = {
  async login(credentials: LoginInput): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  async register(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  async getCurrentUser(): Promise<AuthUser> {
    const response = await apiClient.get<AuthUser>("/auth/me");
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout", {});
  },

  async verifyEmail(token: string): Promise<void> {
    await apiClient.post("/auth/verify-email", { token });
  },

  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post("/auth/request-password-reset", { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post("/auth/reset-password", { token, newPassword });
  },

  async updateProfile(data: Partial<AuthUser>): Promise<AuthUser> {
    const response = await apiClient.patch<AuthUser>("/auth/profile", data);
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post("/auth/change-password", { currentPassword, newPassword });
  },
};
