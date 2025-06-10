import api from './config';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  profile: {
    role: 'admin' | 'user';
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login/', credentials);
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      console.log('Login successful:', { token, user }); // Debug log

      // Lưu token và user vào localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set token cho axios instance
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.profile && user.profile.role) {
          return user;
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('user');
      }
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    const user = authService.getCurrentUser();
    const isAuth = Boolean(token && user);
    console.log('Auth check:', { token, user, isAuth }); // Debug log
    return isAuth;
  },

  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    const isAdmin = user?.profile?.role === 'admin';
    console.log('Admin check:', { user, isAdmin }); // Debug log
    return isAdmin;
  }
};

export default authService; 