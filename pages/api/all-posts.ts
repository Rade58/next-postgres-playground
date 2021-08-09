import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import { makeDbClient } from "../../db/supa";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  const dbClient = await makeDbClient();

  const data = await dbClient.query("SELECT * FROM posts;");

  console.log({ data });

  res.status(200).json(data);
});

export default handler;
