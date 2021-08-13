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

  // REMEBER THAT WE ADDED id ON SESSION BECAUSE
  // MAYBE THERE IS NO email ON session.user
  // IN CASE OF GITHUB

  // SO THIS IS FOR GOOGLE AUTH
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

  // IN LAST BRANCH WE DEFINED THAT id OBJECT IS GOING TO BE ON
  // session
  // AND IN CASE OF GITHUB THERE IS NOT email SO WE DO THIS
  if (!session.user.email && session.id) {
    result = await prismaClient.post.create({
      data: {
        title,
        content,
        author: {
          connect: {
            id: parseInt(session.id as string),
          },
        },
      },
    });
  }

  res.status(201).json(result);
});

export default handler;
