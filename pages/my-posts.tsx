/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { FunctionComponent } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";

import { supabase } from "../lib/supabase";

import type { DataI } from "./index";

const MyPostsPage: FunctionComponent = () => {
  const [posts, setPosts] = useState<DataI[]>([]);

  useEffect(() => {
    //
    fetchMyPosts();
  }, []);

  async function fetchMyPosts() {
    const user = supabase.auth.user();

    const { data } = await supabase
      .from("posts")
      .select("*")
      .filter("user_id", "eq", user?.id);

    setPosts(data as DataI[]);
  }

  async function deletePost(id: string) {
    await supabase.from("posts").delete().match({ id });
    // WHEN DELETING LETS RENDER LIT WITHOUT REMOVED POST
    fetchMyPosts();
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">
        My Posts
      </h1>
      {posts.map(({ id, title, user_email }, i) => {
        return (
          <div key={i} className="border-b border-gray-300 mt-8 pb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p>Author: {user_email}</p>
            <Link href={`/edit-post/${id}`}>
              <a className="text-sm mr-4 text-blue-500">Edit Post</a>
            </Link>
            <Link href={`/posts/${i}`}>
              <a className="text-sm mr-4 text-blue-500">View Post</a>
            </Link>
            <button
              onClick={() => deletePost(id)}
              className="text-sm mr-4 text-red-500"
            >
              Delete Post
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default MyPostsPage;
