import type { UserData } from "types/user";

export const USER_MOCKED: UserData = {
  token: {
    access_token: "123456789",
    expires_in: "3600",
    refresh_token: "1234567890",
    token_type: "bearer",
    expires_at: 1777182776000,
  },
  api: {
    apiURL: "/.netlify/identity",
    _sameOrigin: true,
    defaultHeaders: {
      "X-Nf-Client": "netlify-identity-widget",
      "X-Use-Cookie": "1",
    },
  },
  url: "/.netlify/identity",
  audience: "",
  id: "123456789",
  aud: "",
  role: "",
  email: "imperio@gmail.com",
  confirmed_at: "2026-04-24T22:17:20Z",
  invited_at: "2026-04-24T22:17:20Z",
  recovery_sent_at: "2026-04-24T22:17:20Z",
  app_metadata: {
    provider: "google",
    roles: [],
  },
  user_metadata: {
    avatar_url: "/assets/profile-mocked-2.png",
    full_name: "Dark Vader",
  },
  created_at: "2026-04-24T22:17:20Z",
  updated_at: "2026-04-24T22:17:20Z",
};
