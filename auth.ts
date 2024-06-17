
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { saltAndHashPassword, signInSchema } from "@/utils/security"
import { getUser } from '@/lib/user'
import { User } from "./app/types/userTypes"
import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcrypt';

export const { signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);


        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;   
          //const pwHash = saltAndHashPassword(password);
 
          // logic to verify if user exists
          //user = await getUserFromDb(credentials.email, pwHash)
          const user = await getUser(email);
          console.log(user);
          if (!user) {
            // No user found, so this is their first attempt to login
            // meaning this is also the place you could do registration
            throw new Error("User not found.")
          }
          
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
          
          // return user object with the their profile data
          return null;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),    
  ],
})