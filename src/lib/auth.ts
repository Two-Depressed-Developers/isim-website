import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { env } from "@ryankshaw/next-runtime-env";

const strapiApiUrl = env("NEXT_PUBLIC_STRAPI_API_URL");

if (!strapiApiUrl) {
  throw new Error("NEXT_PUBLIC_STRAPI_API_URL environment variable is not set");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      id: "saml-sso",
      name: "SAML SSO",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.token) return null;

        try {
          const decoded = JSON.parse(
            Buffer.from(credentials.token as string, "base64").toString(),
          );

          const { email, groups } = decoded;

          const res = await axios.post(
            `${strapiApiUrl}/api/auth-custom/sso-login`,
            {
              email: email,
              groups: groups,
            },
            {
              headers: {
                "x-api-secret-key": process.env.STRAPI_SECRET_API_KEY || "",
              },
            },
          );

          if (res.status === 404) return null;

          const data = res.data;

          return {
            id: data.user.id.toString(),
            name: data.user.username,
            email: data.user.email,
            strapiToken: data.jwt,
            strapiUser: data.user,
          };
        } catch (err) {
          console.error("SAML Authorize Error:", err);
          return null;
        }
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
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  callbacks: {
    async signIn() {
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.accessToken = user.strapiToken;
        token.user = user.strapiUser;

        if (user.strapiToken) {
          const payload = JSON.parse(
            Buffer.from(user.strapiToken.split(".")[1], "base64").toString(),
          );
          token.exp = payload.exp;
          console.log("Token exp set to:", token.exp);
          console.log("Token payload:", user.strapiToken);
        }
      }

      if (trigger === "update" && session?.user) {
        token.user = { ...token.user, ...session.user };
      }

      if (Date.now() < (token.exp as number) * 1000) {
        return token;
      } else {
        return null;
      }
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
