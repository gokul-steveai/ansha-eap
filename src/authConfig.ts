import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  providers: [],
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,

} satisfies NextAuthConfig;