# FUNCTIONALITY FOR ADDING NEW BLOG POSTS, AND LISTING ALL POSTS OF CURRENT USER

## LET'S DEFINE FRONTEND FIRST

```
touch components/Layout.tsx
```

```tsx
/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

const Layout: FC = ({ children }) => {
  return (
    <main className="bg-white p-12 flex justify-center items-center">
      {children}
    </main>
  );
};

export default Layout;
```

```
touch pages/blog/create.tsx
```

```tsx
/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useState } from "react";
import type { FunctionComponent, SyntheticEvent } from "react";

import Router from "next/router";

import Layout from "../../components/Layout";

const CreateBlogPost: FunctionComponent = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const submitData = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const body = JSON.stringify({ title, content });

      await fetch("/api/blog/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
      
      // AFTER CREATING POST
      // USER IS BEING REDIRECTED TO PAGE WHERE ALL OF THEIR 
      // POSTS ARE 
      // LISTED 
      await Router.push("/blog/drafts");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div>
        <form onSubmit={submitData}>
          <h1>New Draft</h1>
          <input
            className="w-full p-2 mx-2 my-0 rounded-md border-3 border-pink-300 border-solid"
            type="text"
            name="Title"
            placeholder="Title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full p-2 mx-2 my-0 rounded-md border-3 border-pink-300 border-solid"
            name="Content"
            placeholder="Content"
            cols={50}
            rows={8}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <input
            css={css`
              background: #ececec;
              border: 0;
              padding: 1rem 2rem;
            `}
            disabled={!content || !title}
            type="submit"
            value="Create"
          />
          <a className="ml-4" href="#" onClick={() => Router.push("/")}>
            or Cancel
          </a>
        </form>
      </div>
    </Layout>
  );
};

export default CreateBlogPost;
```

## LETS BUILD API ROUTE `/api/blog/post` (method "POST")

CRUCIAL THING IS TO OBTAIN USER FROM THE SESSION, BECAUSE IF THERE IS NO USER YOUR MUTATION SHOULD FAIL

```
mkdir -p pages/api/blog/post && touch pages/api/post/index.ts
```

```ts
import nc from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "next-auth/client";

import prismaClient from "../../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const { content, title } = req.body as { title: string; content: string };

  const session = await getSession({
    req,
  });

  if (!session || !session.user || !session.user.name) {
    return res.status(403).send("unauthorized");
  }

  let result;

  // REMEBER THAT WE ADDED id ON SESSION BECAUSE
  // MAYBE THERE IS NO email ON session.user
  // IN CASE OF GITHUB

  // SO THIS IS FOR GOOGLE AUTH
  if (session.user.email) {
    result = await prismaClient.post.create({
      data: {
        title,
        content,
        author: {
          connect: {
            email: session.user.email,
          },
        },
      },
    });
  }

  // IN LAST BRANCH WE DEFINED THAT id OBJECT IS GOING TO BE ON
  // session
  // AND IN CASE OF GITHUB THERE IS NOT email SO WE DO THIS
  if (!session.user.email && session.id) {
    result = await prismaClient.post.create({
      data: {
        title,
        content,
        author: {
          connect: {
            id: parseInt(session.id as string),
          },
        },
      },
    });
  }

  res.status(201).json(result);
});

export default handler;
```

## YOU CAN TEST THIS

AUTHENTICATE AS A USER, CREATE A POST

AND YOU WILL BE REDIRECTED TO `/blog/drafts` WHICH IS 404

**AND ONE THING TO NOTE IS WE CALL THESE DRAFTS INSTEAD OF POSTS**

**THAT IS BECAUSE BY DEFAULT THROUGH SCHEMA WE DEFINED THAT published FIELD HAS DEFAULT OF false**

LATER WE WILL DEFINE PUBLISHING, OR UPDATING OF POSTS WHERE CURRENT USER WILL UPDATE published FIELD TO BE true FOR HIS POSTS

AND THEN HIS POSTS WILL BE DISPLAYED ON /blog PAGE, WHERE ALL POSTS ARE BEING DISPLAYED

# WE WILL NOW CREATE PAGE `/blog/draft` FOR LISTING ALL POSTS THAT SINGLE USER CREATED AND THEY ARE THERE FOR HIM TO LOOK AT THEM

WE ARE GOING TO USE `getServerSideProps`, WHERE WE WILL USE `getSession` TO CHEC FOR CURRENT AUTHENTICATED USWR, AND WE WILL QUERY FOR ALL OF HIS POSTS

**BUT ALSO JUST TO SHOW YOU THAT YOU CAN GET SESSION FRONT END TOO, WE WILL USE `useSession` HOOKK AT FRONTEND**


```
touch components/Post.tsx
```

```tsx
/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
import React from "react";
import type { FC } from "react";

import type { Post as PostI } from "@prisma/client";

const Post: FC<{ post: PostI }> = ({ post }) => {
  const { title, content } = post;

  return (
    <div className="mt-4 bg-white transition-shadow hover:shadow-lg">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
};

export default Post;
```

```
touch pages/blog/drafts.tsx
```

```tsx
/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FunctionComponent } from "react";
import type { GetServerSideProps } from "next";

// WE NEED SESSION ON SERVER SIDE
// AND ON CLIENT SIDE
import { getSession, useSession } from "next-auth/client";

import type { Post } from "@prisma/client";

import prismaClient from "../../lib/prisma";

import Layout from "../../components/Layout";
import Draft from "../../components/Post";

interface PropsI {
  drafts: Post[];
}

export const getServerSideProps: GetServerSideProps<PropsI> = async (ctx) => {
  const { req, res } = ctx;

  // GETTING THE USER
  const session = await getSession({
    req,
  });

  // I'M CHECKING IS THERE A name (NOT email)
  // BECAUSE SOMETIMES LIKE FOR GITHUB (email IS NOT PROVIDED)
  if (!session || !session.user || !session.user.name) {
    console.log({ session });

    res.statusCode = 403;

    return {
      props: {
        drafts: [],
      },
    };
  }

  const drafts = await prismaClient.post.findMany({
    where: {
      author: {
        email: session.user.email,
      },
      published: false,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    props: {
      drafts: [],
    },
  };
};

const DraftsPage: FunctionComponent<PropsI> = (props) => {
  const { drafts } = props;

  //
  const [session, isLoggedIn] = useSession();

  if (!isLoggedIn) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <p>You need to be signed in to view this page.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <h1>My Drafts</h1>
        <main>
          {drafts.map((draft) => (
            <Draft key={draft.id} post={draft} />
          ))}
        </main>
      </div>
    </Layout>
  );
};

export default DraftsPage;
```

## useSession WILL NOT WORK AND THE REASON WHY, IS THAT YOU NEED TO PROVIDE ESESSION AND YOU CAN DO THAT BY TAKING IT FROM pageProps INSIDE `_app.tsx`

MY _app.tsx IS A LITTLE BIT BLOATED WITH ALL OF THE CODE I WROTE EARLIER FOR OTHER PRACTICES AND OTHER PARTS OF PROJECT

JUST KNOW THAT MOST IMPORTANT THING FOR US IS TAKING SESSION PROVIDER AND WRAPPING IT AROUND OUR APP COMPONENT

```
code pages/_app.tsx
```

```tsx
import "../styles/globals.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { AppProps } from "next/app";
import type { User } from "@supabase/supabase-js";

import { useRouter } from "next/router";

// WE IMPORTED THIS
import { Provider } from "next-auth/client";
//

import { supabase } from "../lib/supabase";

import Header from "../components/Header";

function MyApp({ Component, pageProps }: AppProps) {
  
  // IGNORE ALL OF THE CODE, JUST GO TO THE BOTTOM
  // OF THE FILE
  const [user, setUser] = useState<null | User>(null);
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (e) =>
      checkUser()
    );
    checkUser();
    return () => {
      authListener?.unsubscribe();
    };
  }, []);
  async function checkUser() {
    const user = supabase.auth.user();
    setUser(user);
  }
  const { pathname } = useRouter();
  const isBlog = pathname.startsWith("/blog");

  return (
    <div>
      {isBlog && <Header />}

      {!isBlog && (
        <nav className="p-6 border-b border-gray-300">
          <Link href="/">
            <a className="mr-6 cursor-pointer">Home</a>
          </Link>

          {user && (
            <Link href="/create-post">
              <a className="mr-6 cursor-pointer">Create Post</a>
            </Link>
          )}
          <Link href="/profile">
            <a className="mr-6 cursor-pointer">Profile</a>
          </Link>
          {/* ADDED THIS */}
          <Link href="/my-posts">
            <a className="mr-6 cursor-pointer">My Posts</a>
          </Link>
        </nav>
      )}

      <div className="py-8 px-16">
        {/* WE ARE WRAPPING EVERYTHING IN PROVIDER
        AND PASSING SESSION FROM PROPS */}
        <Provider session={pageProps.session}>
          <Component {...pageProps} />
        </Provider>
      </div>
    </div>
  );
}
export default MyApp;
```

**NOW WHEN WE USE `useSession` HOOK ACROSS OUR APP, ACROSS ALL OF OUR COMPONENTS, WE CAN OBTAIN SESSION OF SIGNED IN USER**

WE CAN NOW START DEVELOPMENT SERVER AND PLAY AROUND BY CREATING SOME POSTS (WE NEED TO BE AUTHENTICATED USER TO DO THAT)

```
yarn dev
```