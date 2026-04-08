import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';
import { prisma } from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  trustedOrigins: [`${process.env.NEXT_PUBLIC_API_URL}`],

  session: {
    expiresIn: 30 * 24 * 60 * 60,
  },

  plugins: [
    admin({
      defaultRole: 'USER',
      adminRoles: ['ADMIN'],
    }),
  ],
});
