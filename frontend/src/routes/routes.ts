export const ROUTES = {
  SPLASH: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  AURA_SELECTION: "/choose-aura",
  HOME: "/home",
  PROFILE_SETUP: "/profile-setup",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
