"use server"

import bcrypt from 'bcrypt';
import { getWHO5ResponsesByUser } from "../crudWho5";
import { getUserByEmail, User } from "../crudUsers";


export const AuthenticateUser = async (credentials: { useremail: string; userpass: string; viaadmin?: boolean }): Promise<User & {who5Completed: boolean} | null> => {
  try {
    const response = await getUserByEmail(credentials?.useremail);
    
    if (!response.success || !response.data) {
      return null;
    }
    
    const user = response.data;

    const viaAdmin = credentials?.viaadmin || false;
    if (!viaAdmin) {
      const isPasswordCorrect = await bcrypt.compare(credentials.userpass, user.password);
      // if(user.email == 'dev@aiwebsiteservices.com'){

      // } else 
        if (!isPasswordCorrect) {
        return null
      };
    }

        // Add missing field
    const res = await getWHO5ResponsesByUser(user.id);
    const who5Completed = res.success && !!res.data

    return { ...user, who5Completed };
  } catch {
    return null;
  }
};