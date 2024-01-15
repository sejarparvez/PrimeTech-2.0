import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
      // Add any other properties you expect here
    } | null;
  }
}
