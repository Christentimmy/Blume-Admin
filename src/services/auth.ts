import { apiConfig, getAuthHeaders } from "./api";
import { API_ENDPOINTS } from "./config";

// Types for authentication
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

// Auth Service Class
class AuthService {
  private baseURL = apiConfig.baseURL;

  // Login method
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(
        `${this.baseURL}${API_ENDPOINTS.AUTH.LOGIN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token on successful login
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // Logout method
  logout(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }

  // Get current user
  getCurrentUser(): User | null {
    try {
      const token = this.getToken();
      if (!token) return null;

      // Decode JWT token to get user info
      const payload = JSON.parse(atob(token.split(".")[1]));

      return {
        id: payload.id,
        email: "", // Email not in token, you might need a separate endpoint
        name: "", // Name not in token, you might need a separate endpoint
        role: payload.role,
      };
    } catch (error) {
      console.error("Error parsing token:", error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem("authToken");
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  // Validate token (optional - you might want to validate with server)
  async validateToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      // You could add a token validation endpoint here
      // For now, just check if token exists
      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
