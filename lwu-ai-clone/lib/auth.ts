import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcrypt";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // Credentials Provider (Email/Password)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),

    // Google OAuth Provider
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    // GitHub OAuth Provider
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/",
    error: "/",
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;

        // Fetch user data from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            credits: true,
            plan: true,
          },
        });

        if (dbUser) {
          token.credits = dbUser.credits;
          token.plan = dbUser.plan;
        }
      }

      // Handle session update
      if (trigger === "update" && session) {
        token = { ...token, ...session };

        // Refresh credits from database
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { credits: true, plan: true },
        });

        if (dbUser) {
          token.credits = dbUser.credits;
          token.plan = dbUser.plan;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.credits = token.credits as number;
        session.user.plan = token.plan as string;
      }
      return session;
    },
  },

  events: {
    async createUser({ user }) {
      // Give new users free credits
      await prisma.user.update({
        where: { id: user.id },
        data: {
          credits: 10,
          plan: "FREE",
        },
      });

      // Create initial transaction record
      await prisma.transaction.create({
        data: {
          userId: user.id,
          type: "BONUS",
          amount: 10,
          description: "Welcome bonus",
        },
      });
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
