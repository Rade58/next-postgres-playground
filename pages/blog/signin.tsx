/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import { useState, useEffect } from "react";
import type { FunctionComponent } from "react";

import Router from "next/router";

import { signIn, getSession } from "next-auth/client";

const SigninPage: FunctionComponent = () => {
  useEffect(() => {
    getSession().then((ses) => {
      if (ses) {
        Router.push("/blog/drafts");
      }
    });
  }, []);

  return (
    <div className="flex flex-wrap justify-between border-0 border-gray-900 w-48 mx-auto mt-11">
      <button
        onClick={() => {
          signIn("github");
        }}
        className="border-2 border-gray-500 mt-2 p-2 rounded-md"
      >
        Sign In With Github
      </button>
      <button
        onClick={() => {
          signIn("google");
        }}
        className="border-2 border-gray-500 mt-2 p-2 rounded-md"
      >
        Sign In With Google
      </button>
    </div>
  );
};

export default SigninPage;
