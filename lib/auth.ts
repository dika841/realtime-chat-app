import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db";
import { fetchRedis } from "@/helpers/redis";

const getGoogleCredentials = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error("Missing Google Client ID");
  }
  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing Google Client Secret");
  }

  return {
    clientId,
    clientSecret,
  };
};

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const userResponse = (await fetchRedis('get', `user:${token.id}`)) as
      | string
      | null

    if (!userResponse) {
      if (user) {
        token.id = user!.id
      }
      return token
    }
    const dbUser = JSON.parse(userResponse) as User
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    async session({ session, token }) {
        if (token) {
          session.user.id = token.id;
          session.user.name = token.name;
          session.user.email = token.email;
          session.user.image = token.picture;
        }
        return session;
    },
    redirect() {
      return "/dashboard";
    },
  },
  
};
