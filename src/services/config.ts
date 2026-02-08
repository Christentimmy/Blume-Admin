// API Endpoints Configuration
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/admin/login',
  },
  USERS: {
    GET_ALL: '/users',
    GET_BY_ID: '/users/:id',
    CREATE: '/users',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
  },
  MATCHES: {
    GET_ALL: '/matches',
    GET_BY_ID: '/matches/:id',
  },
  REPORTS: {
    GET_ALL: '/reports',
    GET_BY_ID: '/reports/:id',
    UPDATE_STATUS: '/reports/:id/status',
  },
  MESSAGES: {
    GET_ALL: '/messages',
    GET_BY_ID: '/messages/:id',
  },
  ANALYTICS: {
    GET_STATS: '/analytics/stats',
    GET_CHARTS: '/analytics/charts',
  },
  MODERATION: {
    GET_QUEUE: '/moderation/queue',
    APPROVE: '/moderation/approve/:id',
    REJECT: '/moderation/reject/:id',
  },
  SETTINGS: {
    GET_ALL: '/settings',
    UPDATE: '/settings',
  },
} as const;
