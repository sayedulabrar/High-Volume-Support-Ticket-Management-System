import apiClient from './axiosConfig';

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
  created_at: string;
  updated_at: string;
}

export interface GetUserResponse {
  user: User;
  roles: Role[];
}

export interface UserFormData {
  roles: number[];
}

export const adminApi = {
  getUsers: async (roleId?: number): Promise<User[]> => {
    try {
      const params = roleId ? { role_id: roleId } : undefined;
      const response = await apiClient.get('/admin/users', { params });
      return response.data.users;
    } catch (error: any) {
      console.error('Error fetching users:', error);
      throw new Error(error.message || 'Failed to fetch users');
    }
  },

  getUser: async (id: number): Promise<GetUserResponse> => {
    try {
      const response = await apiClient.get<GetUserResponse>(`/admin/users/${id}/edit`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw new Error(error.message || 'Failed to fetch user details');
    }
  },

  updateUser: async (id: number, data: UserFormData): Promise<User> => {
    try {
      const response = await apiClient.put(`/admin/users/${id}`, data);
      return response.data.user ?? response.data;
    } catch (error: any) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw new Error(error.message || 'Failed to update user');
    }
  },
};
