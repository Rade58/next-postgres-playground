import nc from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "next-auth/client";

import prismaClient from "../../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const { content, title } = req.body as { title: string; content: string };

  const session = await getSession({
    req,
  });

  if (!session || !session.user || !session.user.name) {
    return res.status(403).send("unauthorized");
  }

  

  let result;

  if (session.user.email) {
    result = await prismaClient.post.create({
      data: {
        title,
        content,
        author: {
          connect: {
            email: session.user.email,
          },
        },
      },
    });
  }

  if(!session.user.email && session.){
    result = await prismaClient.post.create({
      data: {
        title,
        content,
        author: {
          connect: {
            
          },
        },
      },
    });
  }


  res.status(201).json(result);
});

export default handler;
