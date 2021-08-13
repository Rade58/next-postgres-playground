import { NextApiHandler } from "next";

import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";

import prismaClient from "../../../lib/prisma";

const options: NextAuthOptions = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: Adapters.Prisma.Adapter({ prisma: prismaClient }),
  secret: process.env.SECRET,

  callbacks: {
    // WE DEFINE CALLBACK FOR SESSION
    // SECOND ARGUMENT IS user
    session: async (session, user) => {
      if (user.id) {
        session.id = user.id;
      }

      return session;
    },
  },
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;
