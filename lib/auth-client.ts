import { adminClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [adminClient()],
});

export const {
  signUp,
  signIn,
  useSession,
  signOut,
  sendVerificationEmail,
  requestPasswordReset,
  resetPassword,
  updateUser,
} = authClient;

export type Session = typeof authClient.$Infer.Session;
