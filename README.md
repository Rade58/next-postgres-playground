# FUNCTIONALITY FOR UPDATING Post RECORD

WE ARE GOING TO DEFINE MUTATION, WHERE `published` FIELD IS BEING UPDATED ON Post RECORD

**ALSO THIS TIME WE ARE GOING TO USE DYNAMIC ROUTE FOR OUR api**

```
mkdir pages/api/blog/publish && touch "pages/api/blog/publish/[id].ts"
```

```ts
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import prismaClient from "../../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.put(async (req, res) => {
  const { id } = req.query;

  if (id.length) {
    res.status(400).send("post you want to publish doesn't exists");
  }

  const post = await prismaClient.post.update({
    where: { id: Number(id) },
    data: { published: true },
  });

  res.status(201).json(post);
});

export default handler;
```
