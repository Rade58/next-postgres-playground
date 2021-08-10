/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import { FunctionComponent } from "react";
import type { GetStaticProps } from "next";

// TYPES FOR OUR DATA ARE ALSO AVAILABLE
// WE JUST NED Post FOR NOW
// BUT I AM SHOWING YOU THAT YOU HAVE ALL TYPES FOR DATA
import type { Post, User } from "@prisma/client";

// WE WILL USE PRISMA CLIENT
import prismaClient from "../../lib/prisma";

interface PropsI {
  allPosts: (Post & {
    author: {
      id: number;
      name: string | null;
    } | null;
  })[];
}

export const getStaticProps: GetStaticProps<PropsI> = async (ctx) => {
  // WE WILL QUERY FOR ALL POSTS IN HERE

  const allPosts = await prismaClient.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return {
    props: {
      allPosts,
    },
  };
};

const IndexBlogPage: FunctionComponent<PropsI> = (props) => {
  // LETS JUST DISPLAY STRING FOR NOW

  const { allPosts } = props;

  return (
    <div>
      <pre>{JSON.stringify({ allPosts }, null, 2)}</pre>
    </div>
  );
};

export default IndexBlogPage;
