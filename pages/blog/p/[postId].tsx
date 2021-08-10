/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import { FunctionComponent } from "react";
// UVESCU, NEKE TYPE-OVE KOJI SE TICU getServerSideProps-A
import type { GetServerSideProps } from "next";

import prismaClient from "../../../lib/prisma";

interface PropsI {
  placeholder: boolean;
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
        placeholder: true,
      },
    };
  };

const IndexPage: FunctionComponent<PropsI> = (props) => {
  //

  console.log(props);

  return <div>🦉</div>;
};

export default IndexPage;
