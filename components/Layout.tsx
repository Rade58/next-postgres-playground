/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

const Layout: FC = ({ children }) => {
  return (
    <main className="bg-white p-12 flex justify-center items-center">
      {children}
    </main>
  );
};

export default Layout;
