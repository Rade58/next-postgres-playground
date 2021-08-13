# FUNCTIONALITY FOR UPDATING Post RECORD

WE ARE GOING TO DEFINE MUTATION, WHERE `published` FIELD IS BEING UPDATED ON Post RECORD

**ALSO THIS TIME WE ARE GOING TO USE DYNAMIC ROUTE FOR OUR api**

```
mkdir pages/api/blog/publish && touch "pages/api/blog/publish/[id].ts"
```

```ts
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import prismaClient from "../../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.put(async (req, res) => {
  const { id } = req.query;

  if (id.length) {
    res.status(400).send("post you want to publish doesn't exists");
  }

  const post = await prismaClient.post.update({
    where: { id: Number(id) },
    data: { published: true },
  });

  res.status(201).json(post);
});

export default handler;
```

## NOW WE NEED TO DEFINE UI FOR THE SINGLE POST PAGE, AND ACTUAL SENDING REQUEST TO PUBLISH THE POST

OFCOURSE WE ARE GOING TO GET POST THROUGH `getServerSideProps` (**I THINK WE ALREADY DID THAT EARLER, SO WEE NEED TO DEFINE LOGIC FOR SENDING REQUEST TO `/api/blog/publish/:id`**)

```
code pages/blog/p/[postId].tsx
```

```tsx
/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";

import { useState, useEffect } from "react";
import type { FunctionComponent } from "react";
import type { GetServerSideProps } from "next";

import Router from "next/router";

import type { Session } from "next-auth";

import type { Post } from "@prisma/client";
import { getSession } from "next-auth/client";

import ReactMarkdown from "react-markdown";

import prismaClient from "../../../lib/prisma";
import Layout from "../../../components/Layout";

interface PropsI {
  post:
    | (Post & {
        author: {
          name: string | null;
          id: number | null;
        } | null;
      })
    | null;
}

type queryPramType = {
  postId: string;
};

export const getServerSideProps: GetServerSideProps<PropsI, queryPramType> =
  async (ctx) => {
    const params = ctx.params;

    const post = await prismaClient.post.findUnique({
      where: {
        id: Number(params?.postId) || -1,
      },
      include: {
        author: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    return {
      props: {
        post,
      },
    };
  };

// LETS BUILD REQUEST HANDLER
async function publish(id: string) {
  await fetch(`/api/blog/publish/${id}`, {
    method: "PUT",
  });

  await Router.push("/blog");
}

const PostPage: FunctionComponent<PropsI> = (props) => {
  const { post } = props;

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    getSession().then((ses) => {
      if (ses) setSession(ses);
    });
  }, [setSession]);

  if (!post) {
    return null;
  }

  if (!session || !session.user) {
    return <div>Authenticating ...</div>;
  }

  const { title, content, author, published, id } = post;

  // @ts-ignore
  const postBelongsToUser = author?.id === session.id;

  console.log({ postBelongsToUser, author, session });

  let tit = title;

  if (!published) {
    tit = `${tit} (Draft)`;
  }

  return (
    <Layout>
      <div>
        <h2>{tit}</h2>
        <p>By {author?.name || "Unknown author"}</p>
        <ReactMarkdown>{content || ""}</ReactMarkdown>
        {!published && postBelongsToUser && (
          <button
            onClick={() => {
              publish(`${id}`);
            }}
            className="border-2 border-gray-800 rounded-lg px-4 py-2"
          >
            Publish
          </button>
        )}
      </div>
    </Layout>
  );
};

export default PostPage;
```


