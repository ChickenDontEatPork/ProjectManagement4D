import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    token: string;
    user: {
      id: string;
      email: string;
      image: string;
      name: string;
      lastname: string;
      tel: string;
      role: string;
      register: boolean;
    } & DefaultUser;
  }
}
