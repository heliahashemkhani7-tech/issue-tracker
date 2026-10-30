import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma/client";
import authOptions from "@/app/auth/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
