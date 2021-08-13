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
