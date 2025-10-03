import { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: {
          scope: "users.read tweet.read follows.read",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const profileData = profile as { data?: { id: string; username: string }; id?: string; username?: string };
        token.twitterId = profileData.data?.id || profileData.id;
        token.username = profileData.data?.username || profileData.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.twitterId = token.twitterId as string;
        session.user.username = token.username as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Twitter OAuth'dan sonra ana sayfaya yönlendir
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

};