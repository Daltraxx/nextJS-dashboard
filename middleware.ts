import NextAuth from "next-auth";
import { authConfig } from "./auth.config";


//  Initialize NextAuth.js with the authConfig object and export the auth property
export default NextAuth(authConfig).auth;

export const config = {
   // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
   // Use  the matcher option from Middleware to specify that auth should run on specific paths
   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
};