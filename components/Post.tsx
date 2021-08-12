/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
import React from "react";
import type { FC } from "react";

import type { Post } from "@prisma/client";

const Post: FC<{ post: Post }> = ({ post }) => {
  const { title, content } = post;

  return (
    <div className="mt-4 bg-white transition-shadow hover:shadow-lg">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
};

export default Post;
