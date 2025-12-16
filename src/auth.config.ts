import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/");
      // Define public paths that don't need auth (login, register)
      const isPublicPath =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register") ||
        // Allow static assets and favicon
        nextUrl.pathname.startsWith("/_next") ||
        nextUrl.pathname.startsWith("/favicon.ico") ||
        nextUrl.pathname === "/";

      // Actually, dashboard IS protected. Public paths should only be login/register.
      // But for now, let's say dashboard / is protected, /login /register public.

      const isOnAuthPage =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");

      if (isOnAuthPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      // Protect everything else
      if (!isLoggedIn) {
        return false;
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
