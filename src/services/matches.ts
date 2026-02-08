import { apiConfig, getAuthHeaders } from "./api";
import { API_ENDPOINTS } from "./config";

export interface IMatch {
  _id: string;
  avatar1: string;
  avatar2: string;
  full_name1: string;
  full_name2: string;
  createdAt: string;
}

export interface MatchesResponse {
  message: string;
  data: IMatch[];
}

class MatchesService {
  private baseURL = apiConfig.baseURL;

  async getAllMatches(): Promise<MatchesResponse> {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.MATCHES.GET_ALL}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch matches");
      }

      return data;
    } catch (error) {
      console.error("Matches fetch error:", error);
      throw error;
    }
  }
}

export const matchesService = new MatchesService();
