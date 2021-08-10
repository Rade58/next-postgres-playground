/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import { FunctionComponent } from "react";
import type { GetServerSideProps } from "next";

// WE WILL USE PRISMA CLIENT
import prismaClient from "../../lib/prisma";

interface PropsI {
  placeholder: boolean;
}

export const getServerSideProps: GetServerSideProps<PropsI> = async (ctx) => {
  // WE WILL QUERY FOR ALL POSTS IN HERE

  const {} = await prismaClient.post.findMany({
    where: { published: true },
  });

  return {
    props: {
      placeholder: true,
    },
  };
};

const IndexBlogPage: FunctionComponent<PropsI> = (props) => {
  //

  console.log(props);

  return <div>🦉</div>;
};

export default IndexBlogPage;
