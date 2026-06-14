export const ROUTES = {
  SPLASH: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  AURA_SELECTION: "/choose-aura",
  HOME: "/home",
  PROFILE_SETUP: "/profile-setup",
  GLOW_UP: "/glow-up",
  HEALTH: "/health",
  CLOSET: "/closet",
  PROFILE: "/profile",
  PERIOD_SETUP: "/period-setup",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
