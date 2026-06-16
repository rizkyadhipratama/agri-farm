import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("=== AUTH ATTEMPT ===");
        console.log("Email:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { role: true },
        });

        console.log("User found:", !!user);
        console.log("User data:", user ? { id: user.id, email: user.email, role: user.role?.name } : null);

        if (!user) {
          console.log("User not found");
          return null;
        }

        const emailVerified = (user as any).emailVerified;
        if (typeof emailVerified !== "undefined" && !emailVerified) {
          console.log("Email not verified");
          throw new Error("Please verify your email before signing in");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        console.log("Password valid:", isPasswordValid);

        if (!isPasswordValid) {
          console.log("Invalid password");
          return null;
        }

        console.log("Auth SUCCESS");
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role?.name || "viewer",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.lastActivity = Date.now();
      }

      if (trigger === "update") {
        token.lastActivity = Date.now();
      }

      if (token.lastActivity && Date.now() - (token.lastActivity as number) > 1800000) {
        return { ...token, exp: 0 };
      }

      return token;
    },
    async session({ session, token }) {
      if (!token.lastActivity) return null as any;
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7200,
  },
  secret: process.env.NEXTAUTH_SECRET,
};