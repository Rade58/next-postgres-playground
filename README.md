# DELETE YOUR POST AND UPDATE YOUR POST

## PAGE TO LIST SIGNNED INS USERS POSTS, WITH DELETE LOGIC FOR EVERY SINGLE POST, AND LINK TO THE PAGE FOR POST UPDATING SHOULD BE RENDERED

```
touch pages/my-post.tsx
```

```tsx
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

```

## PAGE FOR EDITING POST

**WE ARE USING DYNAMIC ROUTES HERE BUT WE ARE NOT USING gtStaticPaths OR getStaticProps**

**WE ARE USING ROUTER (query PARAMETER FROM ROUTER) TO RENDER APPROPRIATE THINGS**

**WE ARE USING id QUERY PARAM BECAUSE WE WILL NAME FILE `[id].tsx`**

```
mkdir pages/edit-post && touch "pages/edit-post/[id].tsx"
```

AGAIN WE ARE RENDERING MARKDOWN EDITOR BUT THIS TIME, WE WILL ADD OLD CONTENT AS A value SO YOU CAN ALTER THINGS APPROPRIATELLY

```tsx
/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { ChangeEvent, FunctionComponent } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import { supabase } from "../../lib/supabase";

interface DataI {
  id: string;
  title: string;
  content: string;
}

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const EditPostPage: FunctionComponent = () => {
  const { query, push } = useRouter();
  const { id } = query;
  const [post, setPost] = useState<DataI>({
    id: id as string,
    title: "",
    content: "",
  });

  useEffect(() => {
    fetchPost();

    async function fetchPost() {
      if (!id) return;

      const { data } = await supabase
        .from("posts")
        .select()
        .filter("id", "eq", id)
        .single();

      setPost(data);
    }
  }, [id]);

  if (!post) return null;

  function onChange(e: ChangeEvent<{ name: string; value: string }>) {
    setPost((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const { title, content } = post;

  async function updateCurrentPost() {
    if (!title || !content) return null;

    await supabase.from("posts").update([{ title, content }]).match({ id });

    push("/my-posts");
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">
        Edit Post
      </h1>
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      />
      <SimpleMDE
        value={content}
        onChange={(value) => setPost((prev) => ({ ...prev, content: value }))}
      />
      <button
        onClick={updateCurrentPost}
        className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
      >
        Update Post
      </button>
    </div>
  );
};

export default EditPostPage;
```

### FOR THE END LETS ADD LINK FOR THE CURRENT USER LIST OF POSTS `/my-posts`

```
code pages/_app.tsx
```

```tsx
import "../styles/globals.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { AppProps } from "next/app";
import type { User } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (e) =>
      checkUser()
    );

    checkUser();

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  async function checkUser() {
    const user = supabase.auth.user();

    setUser(user);
  }

  console.log({ user });

  return (
    <div>
      <nav className="p-6 border-b border-gray-300">
        <Link href="/">
          <a className="mr-6 cursor-pointer">Home</a>
        </Link>

        {user && (
          <Link href="/create-post">
            <a className="mr-6 cursor-pointer">Create Post</a>
          </Link>
        )}
        <Link href="/profile">
          <a className="mr-6 cursor-pointer">Profile</a>
        </Link>
        {/* ADDED THIS */}
        <Link href="/my-posts">
          <a className="mr-6 cursor-pointer">My Posts</a>
        </Link>
      </nav>

      <div className="py-8 px-16">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
export default MyApp;
```
