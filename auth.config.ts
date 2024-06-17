import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/user/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/admin');
      const withinAdminSection = nextUrl.pathname.startsWith('/admin');

      // limit check to admin section only
      if(withinAdminSection) {
        // if user is logged in, return true as an acknowledgement
        if (isLoggedIn) return true;

        // User not login, redirecting unauthenticated users to login page
        return false; 
      } else {
        // user is login, but currently in the login page, redirecting to dashboard
        if (isLoggedIn) return Response.redirect(new URL('/admin/dashboard', nextUrl));

        // return true means this is the right page for the user,
        // the user is not logged in and currently not on any admin pages
        return true;        
      }
      /*
      if(withinAdminSection) {
        if (isOnDashboard) {
          if (isLoggedIn) return true;
          return false; // Redirect unauthenticated users to login page
        } else if (isLoggedIn) {
          return Response.redirect(new URL('/admin/dashboard', nextUrl));
        }
        return true;
      } else {
        return true;        
      }
        */
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;