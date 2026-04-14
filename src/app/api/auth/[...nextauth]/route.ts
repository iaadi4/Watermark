import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          // Critical scope required to read and append to Google Photos Albums
          scope: "openid email profile https://www.googleapis.com/auth/photoslibrary",
          prompt: "consent",
          access_type: "offline", // Obtain a refresh token
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Store the oauth token explicitly to make authenticated API requests later
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Make the token available on the client session object bounds
      if (session) {
        session.accessToken = token.accessToken as string | undefined;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
