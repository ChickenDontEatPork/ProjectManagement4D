import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      const credential = account?.id_token;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/auth/login`,
        {
          method: 'POST',
          body: JSON.stringify({
            credential: credential,
          }),
          headers: {
            'Content-Type': 'application/json', // Set the content type header
          },
        }
      );
      const response = await res.json();
      if (response.accessToken != null || response.accessToken != '') {
        return true;
      }
      return false;
    },
    async jwt({ account, token, user }) {
      const credential = account?.id_token;
      if (credential) {
        const resLogin = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/auth/login`,
          {
            method: 'POST',
            body: JSON.stringify({
              credential: credential,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const responseLogin = await resLogin.json();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${responseLogin.accessToken}`,
            },
          }
        );
        const data = await res.json();
        if (res.status == 401) {
          return { ...token, ...user };
        }
        return { ...token, data, ...responseLogin };
      }
      return { ...token, ...user };
    },

    async session({ session, token }) {
      session.user = token.data as any;
      session.token = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
