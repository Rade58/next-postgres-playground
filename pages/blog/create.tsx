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

    try {
      const body = JSON.stringify({ title, content });

      await fetch("/api/blog/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      await Router.push("/blog/drafts");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div>
        <form onSubmit={submitData}>
          <h1>New Draft</h1>
          <input
            className="w-full p-2 mx-2 my-0 rounded-md border-3 border-pink-300 border-solid"
            type="text"
            name="Title"
            placeholder="Title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full p-2 mx-2 my-0 rounded-md border-3 border-pink-300 border-solid"
            name="Content"
            placeholder="Content"
            cols={50}
            rows={8}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <input
            css={css`
              background: #ececec;
              border: 0;
              padding: 1rem 2rem;
            `}
            disabled={!content || !title}
            type="submit"
            value="Create"
          />
          <a className="ml-4" href="#" onClick={() => Router.push("/")}>
            or Cancel
          </a>
        </form>
      </div>
    </Layout>
  );
};

export default CreateBlogPost;
