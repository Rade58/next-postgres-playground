/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

import Link from "next/link";

import { useRouter } from "next/router";

import { signOut, useSession } from "next-auth/client";

const Header: FC = () => {
  const router = useRouter();
  const [session, loading] = useSession();

  const isActive = (pathname: string): boolean => router.pathname === pathname;

  let left = (
    <div
      className="left"
      css={css`
        & a[data-active="true"] {
          color: gray;
        }

        & a + a {
          margin-left: 1rem;
        }
      `}
    >
      <Link href="/blog">
        <a
          data-active={isActive("/blog")}
          className="font-bold text-gray-900 inline-block"
        >
          Feed
        </a>
      </Link>
    </div>
  );

  let right = null;

  return (
    <nav className="flex p-8 items-center">
      {left}
      {right}
    </nav>
  );
};

export default Header;
