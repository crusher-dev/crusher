export interface iUserAndSystemInfoResponse {
  userId: number | null;
  isUserLoggedIn: boolean;
  userData: {
    name: string
    avatar: string,
    lastVisitedURL: string | null,
    lastProjectSelectedId: number | null,
    onboardingSteps: {
      INITIAL_ONBOARDING: boolean,
      CREATED_TEST: boolean,
      WATCHED_VIDEO: boolean,
      ADDED_ALERT: boolean,
    },
  } | null,
  team: {
        id: number,
        name: string,
        plan: "FREE" | "STARTER" | "PRO",
  } | null,
  projects: Array<{
    id: number,
    name: string,
    team_id: number
  }> | null,
  system: {
    REDIS_OPERATION: {
      working: boolean,
      message: string | null,
    },
    MYSQL_OPERATION: {
      working: boolean,
      message: string | null,
    },
    MONGO_DB_OPERATIONS: {
      working: boolean,
      message: string | null,
    }
  },
}