import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "@/env";
import { db } from "@/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      displayName?: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user }) => {
      if (!user.id) {
        return {
          ...session,
          user: {
            ...session.user,
            id: user.id,
          },
        };
      } else {
        const dbUser = await db.user.findUnique({
          where: {
            id: user.id,
          },
          select: {
            displayName: true,
          },
        });
        return {
          ...session,
          user: {
            ...session.user,
            id: user.id,
            displayName: dbUser?.displayName,
          },
        };
      }
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    // CredentialsProvider({
    //   // The name to display on the sign in form (e.g. 'Sign in with...')
    //   name: "Sign in with UVA Email",
    //   // The credentials is used to generate a suitable form on the sign in page.
    //   // You can specify whatever fields you are expecting to be submitted.
    //   // e.g. domain, username, password, 2FA token, etc.
    //   // You can pass any HTML attribute to the <input> tag through the object.
    //   credentials: {
    //     email: {
    //       label: "Username",
    //       type: "text",
    //       placeholder: "xrk4np@virginia.edu",
    //     },
    //     password: { label: "Password", type: "text", placeholder: "********" },
    //   },
    //   authorize: async (credentials, req) => {
    //     // You need to provide your own logic here that takes the credentials
    //     // submitted and returns either a object representing a user or value
    //     // that is false/null if the credentials are invalid.
    //     // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
    //     // You can also use the `req` object to obtain additional parameters
    //     // (i.e., the request IP address)
    //     if (!credentials) return null;

    //     const existingUser = await db.user.findUnique({
    //       where: {
    //         email: credentials.email,
    //       },
    //     });
    //     if (!existingUser) {
    //       // TODO: create user
    //       // const newUser = await db.user.create({
    //       //   data: {
    //       //     email: credentials.email,
    //       //     password: undefined,
    //       //   },
    //       // });
    //     } else {
    //     }
    //     // TODO: check password

    //     // Return null if user data could not be retrieved
    //     return null;
    //   },
    // }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
