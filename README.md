# FUNCTIONALITY FOR DELETING POST

OR BETTER IS TO SAY THAT WE ARE DEFINING FUNCTIONALITY FOR DELETING SINGLE DRAFT

WE IMPLEMENTED DRAFT UPDATE IN LAST BANCH, NOW WE JUST NEED TO ADD NEE HANDLER FOR DELETING DRAFT (OR POST (WE ARE REMOVING FROM Post RECORD))

# FIRST LET'S ADD API ROUTE FOR POST DELETION, AND WE CAN DO THAT FOR ALREADY DEFINED ROUTE

WE WILL UTALIZE `next-auth`

I DIDN'T HAVE IN MIND WHEN NAMING ROUTE (IT HAS "publish" NAME INSIDE BUT NEVERMIND) THAT ALSO WE CAN USE ROUTE FOR POST DELETION

JUST LOOK WHAT I DID, IMPORTANT THING IS THAT WE CAN DO THIS, BECAUSE WE ARE USING DIFFERENT HTTP METHOD THEN EARLIER

```
code pages/api/blog/publish/[id].ts
```

```ts
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import prismaClient from "../../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.put(async (req, res) => {
  const { id } = req.query;

  if (typeof id === "object") {
    return res.status(400).send("post you want to publish doesn't exists");
  }

  const post = await prismaClient.post.update({
    where: { id: Number(id) },
    data: { published: true },
  });

  return res.status(201).json(post);
});

// WE WILL ADD ANOTHER HANDLER LIKE THIS
// THIS TIME FOR METHOD "DELETE"
handler.delete(async (req, res) => {
  const { id } = req.query;

  if (typeof id === "object") {
    return res.status(400).send("post you want to delete doesn't exists");
  }

  const post = await prismaClient.post.delete({
    where: {
      id: Number(id),
    },
  });

  return res.status(200).json(post);
});
//

export default handler;

```

# NOW LETS DEFINE, FRONT END PART, AND THATS INITIALIZING OF POST DELITION

```
code pages/blog/p/[postId].tsx
```

```tsx

```






