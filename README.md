# I WANT TO BUILD CUSTOM SIGNIN PAGE

WE NEED TO EXPAND NEXT-AUTH DEFINITION

WHEN I SAID 'EXPAND', I MEAN DEFINING MORE OPTION INSIDE `pages/api/auth/[...nextauth].ts`

FOR EXAMPLLE, **I REALLY DON'T LIKE THAT LOGIN BUTTONS (FOR GITHUB AND GOOGLE) ARE GENERATED ON PAGE SETTED BY NEXT-AUTH**

**I WANT TO SET THAT PAGE BY MYSELF** (AND DEFINE UI BY MYSELF)

SO FAR (ON HEADER ), WHEN YOU PRESS ON LOGIN BUTTON, YOU ARE DIRECTED TO THE PAGE `/api/auth/signin`; (BECAUSE WE DEFINED THAT YOU ARE ESSENCIALLY PREESSING ON LINK WITH A ROUTE `/api/auth/signin`) (**WE CODED THAT INSIDE `Header` COMPONENT**)

I DON'T LIKE THAT, SO LET'S FIX THAT

## LET'S CREATE `/blog/signin` PAGE

```
touch pages/blog/signin.tsx
```

WE WILL ADD LOGIN BUTTONS LATTER, FOR NOW LET'S JUST CREATE 'HELLO WORLD PAGE'

```tsx
/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import { FunctionComponent } from "react";

const SigninPage: FunctionComponent = () => {
  return (
    <div>
      <h1>Sign In</h1>
    </div>
  );
};

export default SigninPage;
```

## NOW LETS REDEFINE `/component/Header.tsx`, THAT IF USER PRESSES ON LOGIN, THAT HE IS NAVIGATED TO `/blog/signin`

I AM NOT GOING TO SHOW YOU CODE, YOU CAN CHECK IT BY YOURSELF

# NOW, THROUGH NEXT-AUTH OPTIONS LET'S DEFINE SIGNIN PAGE

```
code pages/api/auth/[...nextauth].ts
```

```tsx
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
    session: async (session, user) => {
      if (user.id) {
        session.id = user.id;
      }

      return session;
    },
  },

  // HERE WE DEFINED WHAT I MENTIONED
  pages: {
    signIn: "/blog/signin",
  },
  // --------------------------------
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;
```

JUST TO MENTION TO YOU CAN SET HERE, ERROR PAGE, AND COUPLE MORE PAGES

# LET'S NOW DEFINE UI ON OUR `/blog/signin` PAGE, WHERE WE ARE GOING TO CREATE BUTTONS FOR LOGING IN WITH GITHUB AND GOOGLE

I ALREADY DID SOMETHING SIMILAR IN [OTHER PROJECT](https://github.com/Rade58/production_grade-nextjs/blob/11_LAST_THING/pages/signin.tsx) (WHEN I WAS LEARNING PRODUCTION GRADE NWXT.JS)

```
code pages/blog/signin.tsx
```

```tsx
/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import { useState, useEffect } from "react";
import type { FunctionComponent } from "react";

import Router from "next/router";

import { signIn, getSession } from "next-auth/client";

const SigninPage: FunctionComponent = () => {
  useEffect(() => {
    getSession().then((ses) => {
      if (ses) {
        Router.push("/blog/drafts");
      }
    });
  }, []);

  return (
    <div className="flex flex-wrap justify-between border-0 border-gray-900 w-48 mx-auto mt-11">
      <button
        onClick={() => {
          signIn("github");
        }}
        className="border-2 border-gray-500 mt-2 p-2 rounded-md"
      >
        Sign In With Github
      </button>
      <button
        onClick={() => {
          signIn("google");
        }}
        className="border-2 border-gray-500 mt-2 p-2 rounded-md"
      >
        Sign In With Google
      </button>
    </div>
  );
};

export default SigninPage;
```

I TRIED IT AND IT WORKS PROPERLY

MAYBE BETTER MANAGEMENT OF WHAT IS SHOWN AND WHAT IS NOT SHOWN, WHEN SESSION IS THERE OR NOT (YOU HAVE FLASHING OF CONTENT)

# YOU CAN SET UP REDIRRECT THROUGH NEXT-AUTH

YOU CAN SET UP `redirect` CALLBACK THROUGH NEXT-AUTH

THIS IS DOCUMENTATION:

<https://next-auth.js.org/configuration/callbacks#sign-in-callback>

I DON'T KNOW IF I'M GOING TO USE reddirect CALLBACK ANYWHERE IN THE FUTURE, BUT IT SEEMS COOL