# EXTENDING USER OBJECT ON SESSION OBJECT

WHY ARE WE DOING THAT?

**WHEN OBTAINING USER OBJECT FROM SESSION OBJECT, IT ONLY HAS 3 PROPERTIES: `email`, `name`, `image`**

**SOMETIMES THAT IS NOT ENOUGH, LIKE IN OUR CASE**

IN OUR CASE MUTATIONS ARE GOING TO BE PROBLEMATIC IN THAT CAE

IN PARTICULAR MUTATIONS WITH PRISMA

LET'S SAY YOU WANT TO CREATE NEW POST

YOU WOULD DO SOMETHING LIKE THIS WITH PRISMA TO CREATE NEW POST

```tsx
result = await prismaClient.post.create({
  data: {
    title: "Some Title",
    content: "Some content",
    author: {
      // HERE THIS IS PROBLEMATIC
      // ONLY AUTHENTICATED USER CAN CREATE POST
      connect: {
        // WE NEED USER TO CREATE NEw POST SO WE USE SESSION
        // USER HAS ONLY TWO UNIQUE FIELDS, WE CAN USE
        // (YU CAN CHECK THOSE FIELDS IN SCHEMA )
        // HIS email AND HIS id
        // IT IS OK IF USES HAS email ON IT
        // WE CAN DO THIS

        //    email: session.user.email,
        
        // BUT LETS SAY SOMEONE IS AUTHENICATING WITH GITHUB
        // AND HE DIDN'T EXPOSE HIS EMAIL (MANY PEOPLE ON GITHUB DON'T)
        // THEN WE WOULD NEED ID OF THE USER

        id: session.user.id
      },
    },
  },
});
```

**BUT THERE IS NOT `id` ON `session.user.`**

# LET'S NOW CUSTOMIZE `session.user`, AND SET THAT USERS `id` BE ON THAT OBJECT

```
code "pages/api/auth/[...nextauth].ts"
```

```ts
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
        // I DECIDED TO id ON session OBJECT
        session.id = user.id;
      }

      return session;
    },
  },
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;
```

## NOW IF YOU EVER TRY TO OBTAIN SESSION OBJET, BY USAGE OF `getSession` FUNCTION OR `useSession` HOOK (PACKAGES OF `"@next-auth/clent"`) USER ID IS GOING TO BE ON `session` OBJECT