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
        <form onScroll={submitData}></form>
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

import prismaClient from "../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const { content, title } = req.body as { title: string; content: string };

  const session = await getSession({
    req,
  });

  if (!session || !session.user || !session.user.email) {
    return res.status(400).send("Something went wrong");
  }

  const result = await prismaClient.post.create({
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

# WE WILL NOW CREATE PAGE `/blog/draft` FOL LISTING AALL POSTS THAT SINGLE USER CREATED AND THEY ARE THERE FOR HIM TO LOOK AT THEM

```
touch pages/blog/drafts.tsx
```

```tsx

```