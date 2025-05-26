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

// NOTE: The authorized callback is used to verify if the request is authorized to access a page with Next.js Middleware. 
// It is called before a request is completed, and it receives an object with the auth and request properties. 
// The auth property contains the user's session, and the request property contains the incoming request.