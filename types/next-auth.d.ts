import "next-auth";
import "next-auth/jwt";

interface IStrapiUser {
  id: number;
  username: string;
  email: string;
  memberProfileSlug?: string;
}

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
    user?: IStrapiUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    error?: string;
    user?: IStrapiUser & AdapterUser;
  }
}
