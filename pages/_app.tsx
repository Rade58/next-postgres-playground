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
