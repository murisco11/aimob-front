import axios, { AxiosInstance, AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const TOKEN_KEY = "auth_token";

class ApiClient {
  private client: AxiosInstance;
  private refreshing = false;
  private failedQueue: Array<{
    onSuccess: (token: string) => void;
    onFailed: (error: Error) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - adiciona token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - trata erros e refresh token
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Se for erro 401 e não for a request de refresh
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          originalRequest.url !== "/auth/refresh"
        ) {
          originalRequest._retry = true;

          if (this.refreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                onSuccess: (token: string) => {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  resolve(this.client(originalRequest));
                },
                onFailed: (error: Error) => {
                  reject(error);
                },
              });
            });
          }

          this.refreshing = true;

          try {
            const response = await this.client.post("/auth/refresh");
            const newToken = response.data.token;
            this.setToken(newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            this.failedQueue.forEach((prom) => prom.onSuccess(newToken));
            this.failedQueue = [];

            return this.client(originalRequest);
          } catch (err) {
            this.clearToken();
            this.failedQueue.forEach((prom) => prom.onFailed(err as Error));
            this.failedQueue = [];
            window.location.href = "/login";
            return Promise.reject(err);
          } finally {
            this.refreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  getClient(): AxiosInstance {
    return this.client;
  }

  get<T = any>(url: string) {
    return this.client.get<T>(url);
  }

  post<T = any>(url: string, data?: any) {
    return this.client.post<T>(url, data);
  }

  patch<T = any>(url: string, data?: any) {
    return this.client.patch<T>(url, data);
  }

  put<T = any>(url: string, data?: any) {
    return this.client.put<T>(url, data);
  }

  delete<T = any>(url: string) {
    return this.client.delete<T>(url);
  }
}

export const apiClient = new ApiClient();
export const api = apiClient.getClient();
