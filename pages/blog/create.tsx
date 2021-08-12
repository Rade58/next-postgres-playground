/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useState } from "react";
import type { FunctionComponent, SyntheticEvent } from "react";

import Router from "next/router";

import Layout from "../../components/Layout";

const CreateBlogPost: FunctionComponent = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const submitData = async (e: SyntheticEvent) => {
    e.preventDefault();
  };

  return (
    <Layout>
      <div>
        <form onScroll={submitData}></form>
        <h1>New Draft</h1>
        <input
          type="text"
          name="Title"
          placeholder="Title"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          name="Content"
          placeholder="Content"
          cols={50}
          rows={8}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
    </Layout>
  );
};

export default CreateBlogPost;
