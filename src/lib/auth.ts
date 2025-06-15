import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { jwtDecode } from "jwt-decode";

const strapiApiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        try {
          const [name, surname] = profile.name
            ? profile.name.split(" ")
            : [profile.login, ""];

          const res = await fetch(`${strapiApiUrl}/api/sso-auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: profile.email,
              name: name || "",
              surname: surname || "",
            }),
          });

          if (!res.ok) {
            throw new Error("Logowanie do Strapi nie powiodło się");
          }

          const strapiData = await res.json();

          token.accessToken = strapiData.jwt;
          token.user = strapiData.user;

          if (token.accessToken && typeof token.accessToken === "string") {
            const decodedToken = jwtDecode(token.accessToken);
            token.exp = decodedToken.exp;
          }
        } catch (error) {
          console.error("Błąd podczas logowania do Strapi:", error);
          token.error = "StrapiLoginError";
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      session.error = token.error;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
