/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import { FunctionComponent } from "react";
// UVESCU, NEKE TYPE-OVE KOJI SE TICU getServerSideProps-A
import type { GetServerSideProps } from "next";

import type { Post } from "@prisma/client";

import prismaClient from "../../../lib/prisma";

interface PropsI {
  post:
    | (Post & {
        author: {
          name: string | null;
        } | null;
      })
    | null;
}

type queryPramType = {
  postId: string;
};

export const getServerSideProps: GetServerSideProps<PropsI, queryPramType> =
  async (ctx) => {
    // WE WILL TAKE postId FROM params
    const params = ctx.params;

    // WE WILLL QUERY BY postId PARAM

    const post = await prismaClient.post.findUnique({
      where: {
        // THIS IS BECAUSE POSTiD IS string OR undefined
        id: Number(params?.postId) || -1,
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
        post,
      },
    };
  };

const IndexPage: FunctionComponent<PropsI> = (props) => {
  const { post } = props;

  // LETS JUST RENDER JSON

  return <div>{JSON.stringify({ post }, null, 2)}</div>;
};

export default IndexPage;
