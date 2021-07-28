export type ITeamAPIData = {
  id: number,
  name: string,
  plan: "FREE" | "STARTER" | "PRO",
} | null;

export type TUserAPIData = {
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
} | null;

export type TProjectsData = Array<{
  id: number,
  name: string,
  team_id: number
}> | null;

export type TSystemInfo = {
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
}|null

export type IUserAndSystemInfoResponse = {
  userId: number | null;
  isUserLoggedIn: boolean;
  userData: TUserAPIData,
  team: ITeamAPIData,
  projects: TProjectsData,
  system: TSystemInfo | null
}