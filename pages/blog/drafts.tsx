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
  console.log({ session });
  if (!session || !session.user || !session.user.name) {
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
      drafts,
    },
  };
};

const DraftsPage: FunctionComponent<PropsI> = (props) => {
  const { drafts } = props;

  //
  const [session] = useSession();

  console.log({ session });

  /* if (!session) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <p>You need to be signed in to view this page.</p>
      </Layout>
    );
  }
 */
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
