# QUERY AND RENDER LIST OF POSTS (INDEX PAGE)

```
code pages/index.tsx
```

```tsx
// import Head from 'next/head'
// import Image from 'next/image'
import type { FC } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";

import { supabase } from "../lib/supabase";

interface DataI {
  id: string;
  title: string;
  user_email: string;
}

const IndexPage: FC = () => {
  const [posts, setPosts] = useState<DataI[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data, error } = await supabase.from("posts").select();

    setPosts(data as DataI[]);
    setIsLoading(false);
  }

  if (isLoading) return <p className="text-2xl">Loading ...</p>;

  if (!posts.length) return <p className="text-2xl">No post.</p>;

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Posts</h1>
      {posts.map(({ id, title, user_email }) => {
        return (
          <Link key={id} href={`/posts/${id}`}>
            <a>
              <div className="cursor-pointer border-b border-gray-300 mt-8 pb-4">
                <h2 className="text-xl font-semibold">{title}</h2>
                <p className="text-gray-500 mt-2">Author: {user_email}</p>
              </div>
            </a>
          </Link>
        );
      })}
    </div>
  );
};

export default IndexPage;

```
