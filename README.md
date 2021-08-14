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

```
code pages/blog/signin.tsx
```

```tsx

```

# IN NEXT BRANCH I WILL SHOW YOU HOW TO DEFINE REDIRECT AFTER SIGNING IN

YOU WILL SET UP CALLBACK FOR NEXT-AUTH, AGAIN (BEFORE WE SETTED CALLBACK WHERE WE DID EXTEND SESSION OBJECT)

THIS IS DOCUMENTATION:

<https://next-auth.js.org/configuration/callbacks#sign-in-callback>

