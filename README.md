# SINGLE POST PAGE, A PAGE WITH A DYNAMIC ROUTE

WE ARE GOING TO USE getStaticProps AND getStaticPaths (I'M GOING TO USE revalidate (COURSE AUTHOR DIDN'T USE revalidate))

```
touch pages/posts/[id].tsx
```

```tsx
/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import { FunctionComponent } from "react";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { supabase } from "../../lib/supabase";

interface postsPagePropsI {
  post: {
    title: string;
    user_email: string;
    content: string;
  } | null;
}

// id SINCE FILLE IS CALLED [id]
type paramsType = { id: string };

export const getStaticPaths: GetStaticPaths<paramsType> = async (ctx) => {
  // TAKING ALL POST, BUT ONLY TAKING id
  // SINCE id IS GOING TO BE USD AS A DYNAMIC PATH
  // A PATH FOR A SINGLE POST PAGE

  const { data, error } = await supabase
    .from("posts")
    // TAKING ONLI id COLUMN
    .select("id");

  if (!data) {
    return {
      paths: [],
      fallback: true,
    };
  }

  const paths = data.map(({ id }: { id: string }) => {
    return {
      params: {
        id: JSON.stringify(id),
      },
    };
  });

  return {
    paths: paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<postsPagePropsI, paramsType> =
  async (ctx) => {
    const { params } = ctx;

    if (!params || !params.id) {
      return {
        props: {
          post: null,
        },
      };
    }

    const { data, error } = await supabase
      .from("posts")
      // TAKING EVERY COLUMN
      .select()
      // THIS IS A WAY TO WRITE     WHERE    CLAUSE IN
      // (SINCE THIS WILL BE TRNSLATED INTO SQL)
      // WE ARE QUERYING BY ID
      .filter("id", "eq", params.id)
      .single();

    if (!data) {
      return {
        props: {
          post: null,
        },
      };
    }

    return {
      props: {
        post: data,
      },
      revalidate: 1,
    };
  };

const PostPage: FunctionComponent<postsPagePropsI> = ({ post }) => {
  console.log({ post });

  const { query } = useRouter(); // slug IS AVAILABLE AS query.id

  return (
    <>
      {post && (
        <div>
          <h1 className="text-5xl mt-4 font-semibold tracking-wide">
            {post.title}
          </h1>
          <p className="text-sm font-light my-4">by {post.user_email}</p>
          <div>
            <ReactMarkdown className="prose">{post.content}</ReactMarkdown>
          </div>
        </div>
      )}
    </>
  );
};

export default PostPage;

// We use getStaticProps to fetch all the posts for the site,
//  given the id forwarded by the dynamic route.
//  We forward that information to the component via a prop.

// We use getStaticPaths to create a page for each site.
//  If a page has not been created for a site (for example,
//  a brand new site) and the user visits the route,
//  we should generate the site on the fly.
//  This is controlled by the fallback value of true.

// We define a revalidation period of one second with revalidate.
//  Every posts page is built statically at build time.
//  Then, when a request comes in after the revalidation period,
//  getStaticProps is re-ran behind the scenes.
//  If it completes successfully, the page is replaced
//  and updated in the cache.
//  This ensures you never have downtime and always serve
//  a static HTML file.

```

