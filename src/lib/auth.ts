import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

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

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error("Błąd logowania");
          }

          const data = await res.json();

          return {
            id: data.user.id.toString(),
            name: data.user.username,
            email: data.user.email,
            strapiToken: data.jwt,
            strapiUser: data.user,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    /**
     * SIGN IN
     * - GitHub:
     *   - jeśli brak sesji → SSO login (backend decyduje)
     *   - jeśli jest sesja → tylko pozwalamy przejść (linkowanie)
     */
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        const cookieStore = cookies();

        const hasSession =
          (await cookieStore).get("authjs.session-token") ||
          (await cookieStore).get("__Secure-authjs.session-token") ||
          (await cookieStore).get("next-auth.session-token");

        const isLinking = !!hasSession;

        // 🔹 SSO LOGIN (brak sesji)
        if (!isLinking) {
          try {
            const res = await fetch(
              `${strapiApiUrl}/api/auth-custom/sso-login`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: profile?.email,
                  provider: "github",
                  providerId: account.providerAccountId,
                }),
              },
            );

            if (!res.ok) {
              const data = await res.json();

              if (data?.error?.message?.includes("AccountExistsNoLink")) {
                return "/login?error=AccountExistsNoLink";
              }

              return "/login?error=UserNotFound";
            }

            const data = await res.json();

            // ⬅️ bardzo ważne
            user.strapiToken = data.jwt;
            user.strapiUser = data.user;

            return true;
          } catch (err) {
            console.error("SSO login error:", err);
            return "/login?error=ConnectionError";
          }
        }
      }

      return true;
    },

    /**
     * JWT
     * - Credentials → zapisuje Strapi token
     * - GitHub:
     *   - jeśli istnieje sesja → linkuje konto
     *   - NIGDY nie nadpisuje accessToken
     */
    async jwt({ token, user, account, trigger, session }) {
      console.log("==========\n\nALL DATA: ", {
        token,
        user,
        account,
        trigger,
        session,
      });
      // 🔐 LOGIN STRAPI
      if (account?.provider === "credentials" && user) {
        token.accessToken = user.strapiToken;
        token.user = user.strapiUser;
      }

      // 🔗 LOGIN GITHUB (SSO)
      if (account?.provider === "github" && user?.strapiUser) {
        token.accessToken = user.strapiToken;
        token.user = user.strapiUser;
      }

      // 🔗 LINKOWANIE GITHUBA (sesja już istnieje)
      if (
        account?.provider === "github" &&
        token.accessToken &&
        !user?.strapiUser
      ) {
        try {
          const res = await fetch(
            `${strapiApiUrl}/api/auth-custom/link-account`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.accessToken}`,
              },
              body: JSON.stringify({
                provider: "github",
                providerId: account.providerAccountId,
              }),
            },
          );

          if (!res.ok) {
            token.error = "LinkAccountError";
          } else {
            if (token.user) {
              token.user.hasSsoLinked = true;
            }
          }
        } catch (err) {
          console.error("Link account error:", err);
          token.error = "ConnectionError";
        }
      }

      // 🔄 session.update()
      if (trigger === "update" && session?.user) {
        token.user = {
          ...token.user,
          ...session.user,
        };
      }

      return token;
    },

    /**
     * SESSION
     */
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user = token.user as any;
      session.error = token.error as string;

      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
