// next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      profile_img: string;
      roles: string[];
      who5Completed: boolean;
    };
  }

  interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_img: string;
    roles: string[];
    who5Completed: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_img: string;
    roles: string[];
    who5Completed: boolean;
  }
}
