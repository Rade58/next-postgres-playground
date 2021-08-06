import nc from 'next-connect'
import type {NextApiRequest, NextApiResponse} from 'next';
import morgan from 'morgan'

import {makeDbClient} from '../../db/init'

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(morgan('combined'))


handler.get(async (req, res) => {

  const dbClient = await makeDbClient()

  const data = await dbClient.query("SELECT * FROM users LIMIT 10;")
  console.log({data})
  res.status(200).json(data);

})

export default handler;