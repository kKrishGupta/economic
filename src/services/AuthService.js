import { authApi } from './api/auth.api';

class AuthService {
  async login(credentials) {
    const role = credentials.username.toLowerCase().includes('admin') ? 'ADMIN' : 'USER';
    
    // Simulate fetching user data from a DB based on username
    const storedUserStr = localStorage.getItem(`db_user_${credentials.username}`);
    const storedUser = storedUserStr ? JSON.parse(storedUserStr) : { email: '' };

    const fakeData = { 
      accessToken: 'fake-jwt-token', 
      refreshToken: 'fake-refresh-token', 
      username: credentials.username, 
      email: storedUser.email || '',
      role: role, 
      tokenType: 'Bearer' 
    };
    this.setSession(fakeData);
    return fakeData;
  }

  async register(userData) {
    const role = userData.username.toLowerCase().includes('admin') ? 'ADMIN' : 'USER';
    
    // Save to simulated DB
    localStorage.setItem(`db_user_${userData.username}`, JSON.stringify({ email: userData.email || '' }));

    const fakeData = { 
      accessToken: 'fake-jwt-token', 
      refreshToken: 'fake-refresh-token', 
      username: userData.username,
      email: userData.email || '',
      role: role, 
      tokenType: 'Bearer' 
    };
    this.setSession(fakeData);
    return fakeData;
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
