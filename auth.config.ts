import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
   // You can use the pages option to specify the route for custom sign-in, sign-out, and error pages, rather than the Next.js default page
   pages: {
      signIn: '/login'
   },
   // Add middleware to protect routes
   callbacks: {
      authorized({ auth, request: { nextUrl } }) {
         const isLoggedIn = !!auth?.user;
         const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
         if (isOnDashboard) {
            if (isLoggedIn) return true;
            return false; // Redirect unauthenticated users to login page
         } else if (isLoggedIn) {
            return Response.redirect(new URL('/dashboard', nextUrl));
         }
            return true;
      },
   },
   // Add different login options
   providers: []
} satisfies NextAuthConfig;

// NOTE: You can use the pages option to specify the route for custom sign-in, sign-out, and error pages. 
// This is not required, but by adding signIn: '/login' into our pages option, 
// the user will be redirected to our custom login page, rather than the NextAuth.js default page.