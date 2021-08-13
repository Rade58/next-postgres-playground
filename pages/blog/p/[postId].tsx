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

// ------------ ADDING THIS ----------------
async function deletePost(id: string) {
  await fetch(`/api/blog/publish/${id}`, {
    method: "PUT",
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
