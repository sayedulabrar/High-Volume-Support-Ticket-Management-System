import apiClient from './axiosConfig';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: Role[];
}

export interface ProfileFormData {
  name?: string;
  email?: string;
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}

export const authApi = {
  register: async (data: RegisterData) => {
    const response = await apiClient.post('/register', data);
    return response.data;
  },
  
  login: async (data: LoginData) => {
    const response = await apiClient.post('/login', data);
    return response.data;
  },
  
  logout: async () => {
    const response = await apiClient.post('/logout');
    return response.data;
  },
  
  getProfile: async ():Promise<User> => {
    const response = await apiClient.get('/me');
    return response.data.user;
  },

  getRoles: async (): Promise<Role[]> => {
    const response = await apiClient.get('/roles');
    return response.data.roles;
  },
  
  updateProfile: async (data: ProfileFormData) => {
    const response = await apiClient.put('/profile', data);
    return response.data;
  },
  
};