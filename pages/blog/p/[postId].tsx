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
  const postBelongsToUser = author?.id === session.user.id;

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
            className="border-0 rounded-sm px-4 py-8"
          >
            Publish
          </button>
        )}
      </div>
    </Layout>
  );
};

export default PostPage;
