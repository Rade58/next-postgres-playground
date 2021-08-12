/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FunctionComponent } from "react";
import type { GetServerSideProps } from "next";

// WE NEED SESSION ON SERVER SIDE
import { getSession } from "next-auth/client";

import type { Post } from "@prisma/client";

import prismaClient from "../../lib/prisma";

interface PropsI {
  drafts: Post[];
}

export const getServerSideProps: GetServerSideProps<PropsI> = async (ctx) => {
  const { req, res } = ctx;

  // GETTING THE USER
  const session = await getSession({
    req,
  });

  if (!session || !session.user || !session.user.email) {
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

const IndexPage: FunctionComponent<PropsI> = (props) => {
  //

  console.log(props);

  return <div>🦉</div>;
};

export default IndexPage;
