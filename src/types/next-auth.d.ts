import "next-auth";
import "next-auth/jwt";

// Definicja użytkownika, który przychodzi ze Strapi
export interface IStrapiUser {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  roles: string[];
  memberProfileSlug?: string | null;
  hasSsoLinked: boolean;
}

declare module "next-auth" {
  interface User {
    strapiToken?: string;
    strapiUser?: IStrapiUser;
  }

  interface Session {
    accessToken?: string;
    error?: string;
    user: IStrapiUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    error?: string;
    user?: IStrapiUser;
  }
}
