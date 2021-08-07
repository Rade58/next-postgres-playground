# _app.tsx

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
    // CHECKING FOR USER WHEN SOMETHING CHANGES WITH AUTH
    const { data: authListener } = supabase.auth.onAuthStateChange(async (e) =>
      checkUser()
    );

    // CHECKING USER ON MOUNTING
    checkUser();

    return () => {
      // NO NEED TO CHECK FOR USER WHEN COMMPONENT UNMOUNTS
      authListener?.unsubscribe();
    };
  }, []);

  async function checkUser() {
    const user = supabase.auth.user();

    setUser(user);
  }

  return (
    <div>
      <nav className="p-6 border-b border-gray-300">
        <Link href="/">
          <a className="mr-6 cursor-pointer">Home</a>
        </Link>
        {/* IF THERE IS A USER SHOW LINK TO PAGE FOR POST CREAATION */}
        {user && (
          <Link href="/create-post">
            <a className="mr-6 cursor-pointer">Create Post</a>
          </Link>
        )}
        <Link href="/profile">
          <a className="mr-6 cursor-pointer">Profile</a>
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

