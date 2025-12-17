import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

const strapiApiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
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
          const res = await fetch(`${strapiApiUrl}/api/auth-custom/local`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              identifier: credentials?.email,
              password: credentials?.password,
            }),
          });

          if (!res.ok) return null;
          const data = await res.json();

          return {
            id: data.user.id.toString(),
            name: data.user.username,
            email: data.user.email,
            strapiToken: data.jwt,
            strapiUser: data.user,
          };
        } catch (error) {
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
          const res = await fetch(`${strapiApiUrl}/api/auth-custom/sso-login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile?.email,
              providerId: account.providerAccountId,
            }),
          });

          if (!res.ok) {
            return "/login?error=UserNotFound";
          }

          const data = await res.json();

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
      session.user = token.user as any;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
