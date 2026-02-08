// API Endpoints Configuration
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/admin/login",
    VALIDATE: "/admin/validate",
  },
  DASHBOARD: {
    STATS: "/admin/dashboard-stats",
    WEEKLY_ACTIVITIES: "/admin/weekly-activities",
  },
} as const;
