import { authApi } from './api/auth.api';

class AuthService {
  async login(credentials) {
    // --- DEMO BYPASS ---
    if (credentials.username === 'demo_admin') {
      const demoData = { accessToken: 'demo-token', refreshToken: 'demo-refresh', username: 'Demo Admin', role: 'ADMIN', tokenType: 'Bearer' };
      this.setSession(demoData);
      return demoData;
    }
    if (credentials.username === 'demo_user') {
      const demoData = { accessToken: 'demo-token', refreshToken: 'demo-refresh', username: 'Demo User', role: 'USER', tokenType: 'Bearer' };
      this.setSession(demoData);
      return demoData;
    }
    // -------------------

    const data = await authApi.login(credentials);
    this.setSession(data);
    return data;
  }

  async register(userData) {
    // --- DEMO BYPASS ---
    if (userData.username?.startsWith('demo_')) {
      const role = userData.username.includes('admin') ? 'ADMIN' : 'USER';
      const demoData = { accessToken: 'demo-token', refreshToken: 'demo-refresh', username: userData.username, role: role, tokenType: 'Bearer' };
      this.setSession(demoData);
      return demoData;
    }
    // -------------------

    const data = await authApi.register(userData);
    this.setSession(data);
    return data;
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
