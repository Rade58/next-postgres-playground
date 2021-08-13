/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useEffect, useState } from "react";
import type { FunctionComponent } from "react";
import type { GetServerSideProps } from "next";
import type { Session } from "next-auth";

// getSession WORKS CLIENT SIDE AND SERVER SIDE SO I'M GOING TO USE IT
// ON BOTH PLACES
// I'M NOT GOING TO USE useSession BECAUSE I HAD SOME PROBLEMS WITH IT
// IT JUST DIDN'T WORK AS I EXPECTED
import { getSession /*, useSession */ } from "next-auth/client";

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

  // SINCE I DECIDED NOT TO USE useSession
  // I'M GOING TO GET SESSION LIKE THIS
  // -----------------------------
  const [session, setSession] = useState<Session | null>();

  useEffect(() => {
    getSession().then((ses) => {
      if (ses) setSession(ses);
    });
  }, [setSession]);

  // ----------------------------

  if (!session) {
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
