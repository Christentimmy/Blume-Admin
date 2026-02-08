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

export interface ValidateResponse {
  valid: boolean;
  message?: string;
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

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    // Use the validate endpoint to check if token is still valid
    return await this.validateToken();
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  // Validate token with server
  async validateToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await fetch(
        `${this.baseURL}${API_ENDPOINTS.AUTH.VALIDATE}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        // Token is invalid, remove it
        this.logout();
        return false;
      }

      const data: ValidateResponse = await response.json();

      if (!data.valid) {
        // Token is invalid according to server, remove it
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      // On error, assume token is invalid and remove it
      this.logout();
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
