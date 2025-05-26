import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials'; // allows users to login with username and password
import { z } from 'zod';
import type { User } from './app/lib/definitions';
import bcrypt from 'bcryptjs'; // package for hashing passwords
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// query user from database
async function getUser(email: string): Promise<User | undefined> {
   try {
      const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
      return user[0];
   } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
   }
}
 
export const { auth, signIn, signOut } = NextAuth({
   ...authConfig,
   providers: [
      Credentials({
         async authorize(credentials) {
            // validate credentials
            const parsedCredentials = z
               .object({ email: z.string().email(), password: z.string().min(6) }) // z.object() is used to create a schema for validating JavaScript objects
               .safeParse(credentials);
            
            if (parsedCredentials.success) {
               const { email, password } = parsedCredentials.data;
               const user = await getUser(email);
               if (!user) return null;
               const passwordsMatch = await bcrypt.compare(password, user.password);
               // if passwords match, return user
               if (passwordsMatch) return user;
            }

            console.log('Invalid credentials');
            return null;
         }
      })
   ]
});