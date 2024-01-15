import NextAuth from "next-auth/next";
import { authOptions } from "./Options";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
