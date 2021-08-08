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

  return <div className="bg-gray-600 text-gray-100">Hello World</div>;
};

export default IndexPage;
