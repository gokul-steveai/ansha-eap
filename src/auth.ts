import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./authConfig";
import { AuthenticateUser } from "./serverActions/authentication/authenticateUser";


export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        useremail: {},
        userpass: {},
      },
      authorize: async (credentials) => {

        const user = await AuthenticateUser(credentials as {
          useremail: string;
          userpass: string;
          viaadmin?: boolean;
        })

        if (user) {
          return user
        } else {
          throw new Error('wrong credentials 2')
        }
      },
    }),
  ], callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
      
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.email = user.email;
        token.profile_img = user.profile_img ?? null;

        // Serialize roles array as plain array
        token.roles = Array.isArray(user.roles)
          ? [...user.roles]
          : [];

        token.user_id = user.id;

        // Default to false until checked
        token.who5Completed = user?.who5Completed;
      }

     if (trigger === "update" && session) { 
        if (session.who5Completed !== undefined) token.who5Completed = session.who5Completed;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
       
        session.user.id = token.user_id
        session.user.first_name = token.first_name
        session.user.last_name = token.last_name
        session.user.email = token.email
        session.user.profile_img = token.profile_img
        session.user.roles = token.roles
        session.user.who5Completed = token.who5Completed
      }
      return session;
    }

  }
})