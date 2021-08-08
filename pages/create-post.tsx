/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { ChangeEvent, FunctionComponent } from "react";

import { useState } from "react";
import { useRouter } from "next/router";

// FOR DYNAMIC IMPORTS
import dynamic from "next/dynamic";
// SINCE WE WILL USE react-simplemode-editor
// WE WANT IT TO BE DYNMICLY IMPORTED (DUE TO SIZE) TO THIS PAGE

import { v4 as uuid } from "uuid";

import "easymde/dist/easymde.min.css";

import { supabase } from "../lib/supabase";

// STANDS FOR SIMPLE MARKDOWN EDITOR
// DYNAMICLY IMPORTING LIBRARY WHEN IT IS GOING TO BE USED
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
// ----

const initial_state = {
  title: "",
  content: "",
};

const CreatePostPg: FunctionComponent = () => {
  const [post, setPost] =
    useState<{ title: string; content: string }>(initial_state);

  const { content, title } = post;

  const { push } = useRouter();

  // ------ ON CHANGE EVENT HANDLER --------
  // AT THE END IT IS ONLY GOING TO BE USED FOR TAKING title
  function onChange(e: ChangeEvent<{ name: string; value: string }>) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }));
  }
  // ---------------------------------------

  // --------- CREATING NEW POST ---------------
  async function createNewPost() {
    const user = supabase.auth.user();

    if (!title || !content || !user) return;

    const id = uuid();

    // INSERTING NEW RECORD I posts TABLE
    const { data } = await supabase
      .from("posts")
      .insert([{ title, content, user_id: user.id, user_email: user.email }])
      .single();

    // NAVIGATING TO THE PAGE OF NEW POST
    push(`/posts/${data.id}`);
  }
  // -------------------------------------------

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">
        Create new post
      </h1>
      {/* THIS INPUT IS FOR title */}
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={post.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      />
      {/* THIS COMPONENT IS MARKDOWN EDITOR
       IT IS FOR content */}
      <SimpleMDE
        value={post.content}
        onChange={(val) => setPost({ ...post, content: val })}
      />
      <button
        type="button"
        onClick={createNewPost}
        className="mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg"
      >
        Create Post
      </button>
    </div>
  );
};

export default CreatePostPg;
