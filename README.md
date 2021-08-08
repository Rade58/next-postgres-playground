# ENABLE REAL-TIME UPDATES

**WE WANT TO SUBSCRINE ON REALTIME CHANGES IN posts TABLE**

BUT WE NEED TO ENABLE REAL-TIME FIRST THROUGH SUPABASE DASBOARD

`Datbase -> Replication -> 0 tabls`

THEN TURN SWITCH FOR posts TABLE

## WE CAN NOW MAKE AN SUBRIPTION

GOOD PLACE IS INDEX PAGE, WHERE WE DISPLAY ALL THE POSTS EVER MADE BY EVERY USER

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

export interface DataI {
  id: string;
  title: string;
  user_email: string;
}

const IndexPage: FC = () => {
  const [posts, setPosts] = useState<DataI[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPosts(); // WE STILL NEDD TO FETCH ALL POSTS ON MOUNTING
    // BUT NOW EWE WILL SUBSCRIBE TO CHANGES INSIDE posts TABLE
    const mySubscription = supabase
      .from("posts")
      // THIS PART IS BASICLY SAYING
      // EXECUTE THIS CALLBACK IF ANYTHING (DELETE INSERT UPDATE) HAPPENS WITH POSTS
      .on("*", () => fetchPosts())
      .subscribe();

    // CLEANING UP

    return () => {
      supabase.removeSubscription(mySubscription);
    };
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
