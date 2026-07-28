import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Protect /dashboard and /results routes
  matcher: ["/dashboard/:path*", "/results/:path*"],
};
