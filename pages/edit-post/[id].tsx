/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { ChangeEvent, FunctionComponent } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import { supabase } from "../../lib/supabase";

interface DataI {
  id: string;
  title: string;
  content: string;
}

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const EditPostPage: FunctionComponent = () => {
  const { query, push } = useRouter();
  const { id } = query;
  const [post, setPost] = useState<DataI>({
    id: id as string,
    title: "",
    content: "",
  });

  useEffect(() => {
    fetchPost();

    async function fetchPost() {
      if (!id) return;

      const { data } = await supabase
        .from("posts")
        .select()
        .filter("id", "eq", id)
        .single();

      setPost(data);
    }
  }, [id]);

  if (!post) return null;

  function onChange(e: ChangeEvent<{ name: string; value: string }>) {
    setPost((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const { title, content } = post;

  async function updateCurrentPost() {
    if (!title || !content) return null;

    await supabase.from("posts").update([{ title, content }]).match({ id });

    push("/my-posts");
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">
        Edit Post
      </h1>
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      />
      <SimpleMDE
        value={content}
        onChange={(value) => setPost((prev) => ({ ...prev, content: value }))}
      />
      <button
        onClick={updateCurrentPost}
        className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
      >
        Update Post
      </button>
    </div>
  );
};

export default EditPostPage;
