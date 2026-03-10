import { apiClient } from "./api";
import { User, UpdateUserDto } from "@/types/UserType";

export const userService = {
  async getById(id: number): Promise<User> {
    const response = await apiClient.get<User>(`/user/${id}`);
    return response.data;
  },

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const response = await apiClient.put<User>(`/user`, data);
    return response.data;
  }
};