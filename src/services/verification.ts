import { apiConfig, getAuthHeaders } from "./api";
import { API_ENDPOINTS } from "./config";

export type VerificationStatus = "pending" | "approved" | "rejected";
export type VerificationUpdateStatus = "approved" | "rejected";

export interface IPendingVerification {
  _id: string;
  document: string;
  status: VerificationStatus;
  reason: string;
  userId: string;
  full_name: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface PendingVerificationsResponse {
  message: string;
  data: IPendingVerification[];
}

export interface UpdateVerificationPayload {
  id: string;
  status: VerificationUpdateStatus;
  reason?: string;
}

export interface UpdateVerificationResponse {
  message: string;
  data?: IPendingVerification;
}

class VerificationService {
  private baseURL = apiConfig.baseURL;

  async getAllPendingVerifications(): Promise<PendingVerificationsResponse> {
    try {
      const response = await fetch(
        `${this.baseURL}${API_ENDPOINTS.VERIFICATION.GET_ALL_PENDING}`,
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
        throw new Error(
          data.message || "Failed to fetch pending verifications",
        );
      }

      return data;
    } catch (error) {
      console.error("Pending verifications fetch error:", error);
      throw error;
    }
  }

  async updateVerification(
    payload: UpdateVerificationPayload,
  ): Promise<UpdateVerificationResponse> {
    try {
      const response = await fetch(
        `${this.baseURL}${API_ENDPOINTS.VERIFICATION.UPDATE}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update verification");
      }

      return data;
    } catch (error) {
      console.error("Update verification error:", error);
      throw error;
    }
  }
}

export const verificationService = new VerificationService();
