# ADDING LOGIN FUNCTIONALITY

WE WILL BUILD A HEADER

HEADER IS GOING TO BE BUILD WITH TWO SIDES: left AND  RIGHT WHICH ARE GOING TO BE CONDITIONALLY RENDERED

CONDITIONALLY LEFT SIDE WILL HAVE NAVIGATION RELATED THINGS, AND RIGHT SIDE WILL HAVE SIGNOUT BUTTONS

```
yarn add @emotion/react
```

```
mkdir components && touch components/Header.tsx
```

```tsx
/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

import Link from "next/link";

import { useRouter } from "next/router";

import { signOut, useSession } from "next-auth/client";
import type { Session } from "next-auth";

const Header: FC = () => {
  const router = useRouter();
  const [session, loading] = useSession();

  const isActive = (pathname: string): boolean => router.pathname === pathname;

  const LeftJustFeed: FC = () => (
    <div
      className="left"
      css={css`
        & a[data-active="true"] {
          color: gray;
        }
      `}
    >
      <Link href="/blog">
        <a
          data-active={isActive("/blog")}
          className="font-bold text-gray-900 inline-block no-underline"
        >
          Feed
        </a>
      </Link>
    </div>
  );

  const LeftfeedAndDrafts: FC = () => (
    <div
      className="left"
      css={css`
        & a[data-active="true"] {
          color: gray;
        }
      `}
    >
      <Link href="/blog">
        <a
          data-active={isActive("/blog")}
          className="font-bold text-gray-900 inline-block no-underline"
        >
          Feed
        </a>
      </Link>
      <Link href="/blog/drafts">
        <a
          data-active={isActive("/blog/drafts")}
          className="font-bold text-gray-900 inline-block no-underline"
        >
          Feed
        </a>
      </Link>
    </div>
  );

  const RightJustSignIn: FC = () => (
    <div className="right">
      <Link href="/api/auth/signin">
        <a
          data-active={isActive("/blog/signup")}
          className="no-underline text-gray-900 inline-block"
        >
          Log in
        </a>
      </Link>
    </div>
  );

  const RightWithSession: FC<{ session: Session }> = ({ session }) => (
    <div className="right">
      <p className="inline-block text-sm pr-4">
        {session.user?.name} ({session.user?.email})
      </p>
      <Link href="/blog/create">
        <a className="font-bold no-underline inline-block">
          <button>New Post</button>
        </a>
      </Link>
      <button
        className="border-0"
        onClick={() => {
          signOut();
        }}
      >
        Log out
      </button>
    </div>
  );

  let left = <LeftJustFeed />;

  let right = null;

  if (loading) {
    left = <LeftJustFeed />;

    right = (
      <div className="right">
        <p>Validating session ...</p>
      </div>
    );
  }

  if (!session) {
    right = <RightJustSignIn />;
  }

  if (session) {
    left = <LeftfeedAndDrafts />;
    right = <RightWithSession session={session} />;
  }

  return (
    <nav
      className="flex p-8 items-center"
      css={css`
        & a + a {
          margin-left: 1rem;
        }

        & .right {
          margin-left: auto;

          & a {
            border: 1px solid black;
            padding: 0.5rem 1rem;
            border-radius: 3px;
          }
        }
      `}
    >
      {left}
      {right}
    </nav>
  );
};

export default Header;
```

WE WILL RENDER HEDER ONLY IF PATH IS STARRTING WITH "/blog" (**DOING THIS BECAUSE WE HAVE CODE FROM WHEN WE WERE LEARNING OTHER THINGS (I DON'T WANT TO ERASE THAT CODE)**) (WE ARE BUILDING AUTH FOR THE /blog PART OF THE SITE ANYWAYS) (I USE ROUTER, YOU CCAN CHECK _app.tsx BY YOURSELF)

LETS SEE HOW IT LOOKS FOR NOW

```
yarn dev
```

**SINCE WE DIDN'T ADD LOGIC (SERVER SIDE CODE) FOR NEXT AUTH (A CODE FPOR OBTAINING A USER)** WE SHOULD ONLY SEE Feed LINK TO THE LEFT AND Login BUTTON TO THE RIGHT

PRESSING LOGIN SHOULD HIT ENDPOINT /api/signin (BUT WE DON'T HAVE THAT ENPOINT ) **AND WE WILL SE 404 PAGE WHEN WE PRESS THAT**

# SETTING UP SPECIAL `/api/auth/[...nextauth]` ROUTE; BUT NOW, WEE NEED TO HAVE PRISAM IN MIND, SO WE WILL ALSO USE PRISAM ADAPTER

```
mkdir pages/api/auth && touch "pages/api/auth/[...nextauth].ts"
```

```ts

```
