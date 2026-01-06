import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { env } from "@ryankshaw/next-runtime-env";

const strapiApiUrl = env("NEXT_PUBLIC_STRAPI_API_URL");

if (!strapiApiUrl) {
  throw new Error("NEXT_PUBLIC_STRAPI_API_URL environment variable is not set");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.NEXT_PUBLIC_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Hasło", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(
            `${strapiApiUrl}/api/auth-custom/local`,
            {
              identifier: credentials?.email,
              password: credentials?.password,
            },
          );

          if (res.status !== 200) {
            return null;
          }

          const data = res.data;

          return {
            id: data.user.id.toString(),
            name: data.user.username,
            email: data.user.email,
            strapiToken: data.jwt,
            strapiUser: data.user,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        try {
          const res = await axios.post(
            `${strapiApiUrl}/api/auth-custom/sso-login`,
            {
              email: profile?.email,
              providerId: account.providerAccountId,
            },
          );

          if (res.status === 404) {
            return "/login?error=UserNotFound";
          }

          const data = res.data;

          user.strapiToken = data.jwt;
          user.strapiUser = data.user;

          return true;
        } catch (err) {
          console.error("SSO Error:", err);
          return "/login?error=ConnectionError";
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.accessToken = user.strapiToken;
        token.user = user.strapiUser;
      }

      if (trigger === "update" && session?.user) {
        token.user = { ...token.user, ...session.user };
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      if (token.user) {
        session.user = token.user as typeof session.user;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
