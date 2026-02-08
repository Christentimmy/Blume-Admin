import { apiConfig, getAuthHeaders } from "./api";
import { API_ENDPOINTS } from "./config";

export type UserStatus =
  | "active"
  | "inactive"
  | "banned"
  | "blocked"
  | "deleted";

// User interface matching the actual API response structure
export interface IUser {
  _id: string;
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  avatar?: string;
  education: string;
  bio?: string;
  stripeCustomerId: string;
  basics: {
    smoking: string;
    drinking: string;
    workout: string;
    occupation: string;
    religion: string;
    education: string;
    height: string;
    sexOrientation: string;
    languages: string[];
    lifestyleAndValues: string[];
    hobbies: string[];
    artsAndCreativity: string[];
    sportsAndFitness: string[];
    travelAndAdventure: string[];
    entertainment: string[];
    music: string[];
    foodAndDrink: string[];
  };
  showGender: boolean;
  gender: "male" | "female" | "others";
  interested_in: "male" | "female" | "both" | "others";
  date_of_birth: Date;
  location: {
    type: string;
    address: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  photos: string[];
  hobbies: string[];
  preferences: {
    ageRange: [number, number];
    maxDistance: number;
  };
  is_email_verified: boolean;
  is_phone_number_verified: boolean;
  is_premium: boolean;
  profile_completed: boolean;
  role: "user" | "super_admin" | "admin" | "staff";
  status: UserStatus;
  last_active: Date;
  created_at: Date;
  updated_at: Date;
  one_signal_id: string;
  relationship_preference:
    | "long term partner"
    | "short term partner"
    | "both"
    | "new friends"
    | "short term fun"
    | "not sure yet";
  plan: "free" | "subscribed";
  boost: {
    isActive: boolean;
    expiresAt: Date;
    boostType: "boost1" | "boost5" | "boost10";
    boostMultiplier: { type: Number; default: 1.0 };
  };
  daily_swipes: number;
  daily_messages: number;
  subscription: {
    planId: string;
    status:
      | "active"
      | "canceled"
      | "past_due"
      | "unpaid"
      | "incomplete"
      | "none";
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
  };
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsersResponse {
  message: string;
  data: IUser[];
}

export interface UpdateUserStatusPayload {
  id: string;
  status: UserStatus;
}

export interface UpdateUserStatusResponse {
  message: string;
  data?: IUser;
}

// Users Service Class
class UsersService {
  private baseURL = apiConfig.baseURL;

  // Get all users
  async getAllUsers(): Promise<UsersResponse> {
    try {
      const response = await fetch(
        `${this.baseURL}${API_ENDPOINTS.USERS.GET_ALL}`,
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
        throw new Error(data.message || "Failed to fetch users");
      }

      return data;
    } catch (error) {
      console.error("Users fetch error:", error);
      throw error;
    }
  }

  async updateUserStatus(
    payload: UpdateUserStatusPayload,
  ): Promise<UpdateUserStatusResponse> {
    try {
      const response = await fetch(
        `${this.baseURL}${API_ENDPOINTS.USERS.UPDATE_STATUS}`,
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
        throw new Error(data.message || "Failed to update user status");
      }

      return data;
    } catch (error) {
      console.error("Update user status error:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const usersService = new UsersService();
