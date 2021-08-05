# CONNECTING TO THE DATBASE FROM NODEJS WORLD

- `touch db/init/index.ts`

```ts
import {Pool} from 'pg'

// THIS SHOULD BE ENV VARIABLES
const user = "rade";
const pass = "eidolon";
const dbName = "db_of_love";
// 


const pool = new Pool({
  connectionString: `postgresql://${user}:${pass}@localhost:5432/${dbName}`
})

export const makeDbClient = async () => pool.connect(); 
```

## TEST HANDLER

- `touch pages/api/test.ts`

```ts
import nc from 'next-connect'
import type {NextApiRequest, NextApiResponse} from 'next';
import morgan from 'morgan'

import {makeDbClient} from '../../db/init'

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(morgan('combined'))


handler.get(async (req, res) => {

  const dbClient = await makeDbClient()

  const data = await dbClient.query("SELECT * FROM some_users;")

  res.status(200).json(data);

})

export default handler;
```

IT IS WORKING (TESTED WITJ HTTPIE)

- `http GET :3000/api/test`
