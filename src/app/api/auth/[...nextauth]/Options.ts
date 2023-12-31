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
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }
        if (user.password) {
          const passwordMatch = await bcrypt.compareSync(
            credentials.password,
            user.password,
          );
          if (!passwordMatch) {
            return null;
          }
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: UserWithRole }) {
      return {
        ...token,
        ...user,
      };
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
  },

  session: {
    strategy: "jwt" as "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
