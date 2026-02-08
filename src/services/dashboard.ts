import { apiConfig, getAuthHeaders } from "./api";
import { API_ENDPOINTS } from "./config";

// Types for dashboard data
export interface DashboardStats {
  users: number;
  matches: number;
  supportTicket: number;
  verification: number;
}

export interface DashboardStatsResponse {
  message: string;
  data: DashboardStats;
}

export interface WeeklyActivity {
  name: string;
  users: number;
  matches: number;
}

export interface WeeklyActivitiesResponse {
  message: string;
  data: WeeklyActivity[];
}

export interface RecentUser {
  id: string;
  full_name: string;
  email: string;
  createdAt: string;
}

export interface RecentUsersResponse {
  message: string;
  data: RecentUser[];
}

// Dashboard Service Class
class DashboardService {
  private baseURL = apiConfig.baseURL;

  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStatsResponse> {
    try {
      const response = await fetch(
        `${this.baseURL}${API_ENDPOINTS.DASHBOARD.STATS}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch dashboard stats");
      }

      return data;
    } catch (error) {
      console.error("Dashboard stats error:", error);
      throw error;
    }
  }

  // Get weekly activities
  async getWeeklyActivities(): Promise<WeeklyActivitiesResponse> {
    try {
      const response = await fetch(
        `${this.baseURL}${API_ENDPOINTS.DASHBOARD.WEEKLY_ACTIVITIES}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch weekly activities");
      }

      return data;
    } catch (error) {
      console.error("Weekly activities error:", error);
      throw error;
    }
  }

  // Get recent users
  async getRecentUsers(): Promise<RecentUsersResponse> {
    try {
      const response = await fetch(
        `${this.baseURL}${API_ENDPOINTS.DASHBOARD.RECENT_USERS}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch recent users");
      }

      return data;
    } catch (error) {
      console.error("Recent users error:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();
