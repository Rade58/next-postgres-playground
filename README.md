# PRISMA CLIENT WAS GENERATED FOR US WHEN WE RUNNED `yarn prisma:db:push`

SO WE DON'T NEED TO INSTALL IT RIGHT NOW (WE DON'T NEED TO EXECUTE `yarn add @prisma/clent`)

IF YOU WANT TO INSTALLL IT (IF YOU WANT TO RUN `yarn add @prisma/client`), AFTER YOU DO THAT, EVERY TIME YOU WOULD NEED TO RUN `npx prisma generate`, **BECAUSE CLIENT NEEDS TO BE TAILORED TO YOUR OWN SCHEMA** (SPAECIALY GENERATED FOR YOUR SCHEMA) (KEEP THIS IN MIND)

SO WE COULDA ADD NEW SCRIPT JUST TO HAVE IT

```
code package.json
```

```json
"scripts": {
  "prisma:db:push": "dotenv -e .env.local -- npx prisma db push",
  "prisma:studio": "dotenv -e .env.local -- npx prisma studio",
  // ADDED THIS (WE RUNN THIS AFTER EVERY TIME WE DO `yarn add /@prisma/client`)
  "prisma:generate:client": "dotenv -e .env.local -- npx prisma generate",
}
```

# SO LETS SETUP PRISMA CLIENT

WE WILL ADD EVERYTHING WE NEED TO THE `/lib` FOLDER

```
mkdir lib/prisma && touch lib/prisma/index.ts
```

```ts
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare namespace global {
  let prisma: PrismaClient;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }

  prisma = global.prisma;
}

export default prisma;
```

**SO NOW WHEN WE NEED TO DEFINE QUERIES OR MUTATIONS WE USE CLIENT WE REATED**

# LETS NOW TRY QUERYING BY USING PRISMA CLIENT` AND DISPLAYING DATA IN OUR APPLICATION

```
mkdir pages/blog && touch pages/blog/index.tsx
```

WE WILL USE `getStaticProps` FOR THIS PAGE (LIKE ALWAYS (LIKE IN OTHER APPLICATIONS) WHEN WE DISPLAYING ALL POSTS)

```tsx
/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import { FunctionComponent } from "react";
import type { GetServerSideProps } from "next";

// TYPES FOR OUR DATA ARE ALSO AVAILABLE
// WE JUST NED Post FOR NOW
// BUT I AM SHOWING YOU THAT YOU HAVE ALL TYPES FOR DATA
import type { Post, User } from "@prisma/client";

// WE WILL USE PRISMA CLIENT
import prismaClient from "../../lib/prisma";

interface PropsI {
  allPosts: (Post & {
    author: {
      id: number;
      name: string | null;
    } | null;
  })[];
}

export const getServerSideProps: GetServerSideProps<PropsI> = async (ctx) => {
  // WE WILL QUERY FOR ALL POSTS IN HERE

  const allPosts = await prismaClient.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return {
    props: {
      allPosts,
    },
  };
};

const IndexBlogPage: FunctionComponent<PropsI> = (props) => {
  // LETS JUST DISPLAY STRING FOR NOW

  const { allPosts } = props;

  return (
    <div>
      <pre>{JSON.stringify({ allPosts }, null, 2)}</pre>
    </div>
  );
};

export default IndexBlogPage;
```

LETS TRY THIS

```
yarn dev
```

GO TO THE: <http://localhost:3000/blog>

YES AND DATA IS REALLY THERE

# LET'S NOW CREATE PAGE WITH DYNAMIC ROUTE, INTENDED FOR DISPLAYING DATA OF THE SINGE POST, AND THIS TIME, WE WILL USE `getServerSideProps`

```
mkdir pages/blog/p && touch "pages/blog/p/[postId].tsx"
```

```tsx

```
