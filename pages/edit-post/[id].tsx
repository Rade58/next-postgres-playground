/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { FunctionComponent } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import { supabase } from "../../lib/supabase";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const EditPostPage: FunctionComponent = () => {
  return <div></div>;
};

export default EditPostPage;
