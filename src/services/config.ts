// API Endpoints Configuration
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/admin/login",
    VALIDATE: "/admin/validate",
  },
  DASHBOARD: {
    STATS: "/admin/dashboard-stats",
    WEEKLY_ACTIVITIES: "/admin/weekly-activities",
    RECENT_USERS: "/admin/recent-users",
  },
  USERS: {
    GET_ALL: "/admin/get-all-users",
    UPDATE_STATUS: "/admin/update-user-status",
  },
  MATCHES: {
    GET_ALL: "/admin/get-all-matches",
  },
  VERIFICATION: {
    GET_ALL_PENDING: "/admin/get-all-pending-verification",
  },
} as const;
