/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import { FunctionComponent } from "react";
import type { GetStaticProps } from "next";

import Link from "next/link";

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
  const { allPosts } = props;

  return (
    <div>
      {allPosts.map(({ title, id }, i) => {
        return (
          <Link key={i} href={`/blog/p/${id}`}>
            <a>{title}</a>
          </Link>
        );
      })}
    </div>
  );
};

export default IndexBlogPage;
