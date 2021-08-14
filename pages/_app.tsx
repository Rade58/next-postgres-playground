import "../styles/globals.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { AppProps } from "next/app";
import type { User } from "@supabase/supabase-js";

import { useRouter } from "next/router";

// WE IMPORTED THIS
// import { Provider } from "next-auth/client";
//

import { supabase } from "../lib/supabase";

import Header from "../components/Header";

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

  const { pathname } = useRouter();

  // THIS IS INTENDED FOR DISPLLAYING THINGS WHEN WE
  // WERE PRACTICING PRISMA
  const isBlog = pathname.startsWith("/blog");

  return (
    <div>
      {isBlog && <Header />}

      {!isBlog && (
        <nav className="p-6 border-b border-gray-300">
          <Link href="/">
            <a className="mr-6 cursor-pointer">Home</a>
          </Link>
          <Link href="/blog">
            <a className="mr-6 cursor-pointer">
              Other Blog (WHERE WE PLAYED WITH NEXT-AUTH)
            </a>
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
      )}

      <div className="py-8 px-16">
        {/* WE ARE WRAPPING EVERYTHING IN PROVIDER
        AND PASSING SESSION FROM PROPS */}
        {/* <Provider session={pageProps.session}> */}
        <Component {...pageProps} />
        {/* </Provider> */}
      </div>
    </div>
  );
}
export default MyApp;
