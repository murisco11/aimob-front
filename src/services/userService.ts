import { apiClient } from "./api";
import { User, UpdateUserDto } from "@/types/UserType";

export const userService = {
  async getById(id: number): Promise<User> {
    const response = await apiClient.get<User>(`/user/${id}`);
    console.log(response.data)
    return response.data;
  },

    async getUser(): Promise<User> {
    const response = await apiClient.get<User>(`/user/token`);
    return response.data;
  },


  async update(id: number, data: UpdateUserDto): Promise<User> {
    const response = await apiClient.put<User>(`/user/${id}`, data);
    return response.data;
  }
};