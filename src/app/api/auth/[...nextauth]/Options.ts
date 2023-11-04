import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient();
interface UserWithRole {
  id: string;
  email: string;
  image: string | null;
  name: string;
  status: string;
  role: string;
}

interface CustomSession extends Session {
  name: string;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
        email: { label: "email", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required.");
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("User not found.");
        }
        if (user.emailVerified === null) {
          throw new Error("User not found.");
        }

        if (user.password) {
          const passwordMatch = await bcrypt.compareSync(
            credentials.password,
            user.password,
          );

          if (!passwordMatch) {
            throw new Error("Incorrect password.");
          }
        }

        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT;
      user?: UserWithRole | undefined;
      trigger?: any;
      session?: Session;
    }) {
      if (trigger === "update") {
        return { ...token, ...session?.user };
      }
      if (user) {
        return Promise.resolve({
          ...token,
          ...user,
        });
      }
      return Promise.resolve(token);
    },
    session: ({
      session,
      token,
    }: {
      session: Session;
      token: string | JWT;
    }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: typeof token === "string" ? token : token.sub,
          role: typeof token === "string" ? token : token.status,
        },
      };
    },
  } as any,

  session: {
    strategy: "jwt" as "jwt",
    maxAge: 60 * 60 * 24,
    updateAge: 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
