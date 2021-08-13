# FUNCTIONALITY FOR DELETING POST

OR BETTER IS TO SAY THAT WE ARE DEFINING FUNCTIONALITY FOR DELETING SINGLE DRAFT

WE IMPLEMENTED DRAFT UPDATE IN LAST BANCH, NOW WE JUST NEED TO ADD NEE HANDLER FOR DELETING DRAFT (OR POST (WE ARE REMOVING FROM Post RECORD))

# FIRST LET'S ADD API ROUTE FOR POST DELETION, AND WE CAN DO THAT FOR ALREADY DEFINED ROUTE

WE WILL UTALIZE `next-auth`

I DIDN'T HAVE IN MIND WHEN NAMING ROUTE (IT HAS "publish" NAME INSIDE BUT NEVERMIND) THAT ALSO WE CAN USE ROUTE FOR POST DELETION

JUST LOOK WHAT I DID, IMPORTANT THING IS THAT WE CAN DO THIS, BECAUSE WE ARE USING DIFFERENT HTTP METHOD THEN EARLIER

```
code pages/api/blog/publish/[id].ts
```

```ts
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import prismaClient from "../../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.put(async (req, res) => {
  const { id } = req.query;

  if (typeof id === "object") {
    return res.status(400).send("post you want to publish doesn't exists");
  }

  const post = await prismaClient.post.update({
    where: { id: Number(id) },
    data: { published: true },
  });

  return res.status(201).json(post);
});

// WE WILL ADD ANOTHER HANDLER LIKE THIS
// THIS TIME FOR METHOD "DELETE"
handler.delete(async (req, res) => {
  const { id } = req.query;

  if (typeof id === "object") {
    return res.status(400).send("post you want to delete doesn't exists");
  }

  const post = await prismaClient.post.delete({
    where: {
      id: Number(id),
    },
  });

  return res.status(200).json(post);
});
//

export default handler;

```

# NOW LETS DEFINE, FRONT END PART, AND THATS INITIALIZING OF POST DELITION

```
code pages/blog/p/[postId].tsx
```

```tsx
/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";

import { useState, useEffect, Fragment } from "react";
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

async function publish(id: string) {
  await fetch(`/api/blog/publish/${id}`, {
    method: "PUT",
  });

  await Router.push("/blog");
}

// ------------ ADDING THIS (SAME URL BUT DIFFERENT METHOD) ----------------
async function deletePost(id: string) {
  await fetch(`/api/blog/publish/${id}`, {
    method: "DELETE",
  });

  await Router.push("/blog");
}
// -----------------------------------------

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
          <Fragment>
            <button
              onClick={() => {
                publish(`${id}`);
              }}
              className="border-2 border-gray-800 rounded-lg px-4 py-2"
            >
              Publish
            </button>
            {/*------------------ ADDING BUTTON ---------------------------------- */}
            <button
              onClick={() => {
                deletePost(`${id}`);
              }}
              className="border-2 border-gray-800 rounded-lg px-4 py-2"
            >
              Delete
            </button>
            {/* --------------------------------------------------------- */}
          </Fragment>
        )}
      </div>
    </Layout>
  );
};

export default PostPage;
```

I TRIED THIS AND EVERYTHING SEEMS TO WORK CORRECTLY




