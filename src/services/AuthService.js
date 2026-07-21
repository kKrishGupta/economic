import { authApi } from './api/auth.api';

class AuthService {
  async login(credentials) {
    const data = await authApi.login(credentials);
    this.setSession(data);
    return data;
  }

  async register(userData) {
    const data = await authApi.register(userData);
    this.setSession(data);
    return data;
  }

  async updateProfile(updates) {
    const currentUser = this.getUser();
    if (!currentUser) throw new Error("Not logged in");

    // Save to simulated DB
    localStorage.setItem(`db_user_${currentUser.username}`, JSON.stringify({ email: updates.email }));

    const updatedData = {
      ...currentUser,
      email: updates.email || currentUser.email,
    };
    
    // Update active session
    localStorage.setItem('user', JSON.stringify(updatedData));
    window.dispatchEvent(new Event('authStateChange'));
    return updatedData;
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('authStateChange'));
  }

  setSession(data) {
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    const user = {
      username: data.username,
      role: data.role,
      tokenType: data.tokenType
    };
    localStorage.setItem('user', JSON.stringify(user));
    window.dispatchEvent(new Event('authStateChange'));
  }

  getUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  }
}

export const authService = new AuthService();
