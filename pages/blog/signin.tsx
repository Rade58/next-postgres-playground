/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import { useState, useEffect } from "react";
import type { FunctionComponent } from "react";

import Router from "next/router";

import { signIn, getSession } from "next-auth/client";

const SigninPage: FunctionComponent = () => {
  useEffect(() => {
    getSession().then((ses) => {
      if (ses) Router.push("/blog/drafts");
    });
  }, []);

  return (
    <div className="border-2 border-gray-900 max-w-md mx-auto mt-11">
      <button className="border-2 border-gray-500">Sign In With Github</button>
      <button className="border-2 border-gray-500">Sign In With Google</button>
    </div>
  );
};

export default SigninPage;
