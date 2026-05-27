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
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
