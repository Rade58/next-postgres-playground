# USING SUPABASE URL TO CONNECT

I WANT TO TRY QUERYING POSTGRES INSTANCE ON SUPABASE, WITHOUT USING `SUPABESE CLINT`

I'LL TRY USING node-postgres (`"pg"` NPM PACKAGE)

TIS TUTORIAL CAN HELP:

<https://dev.to/prisma/set-up-a-free-postgresql-database-on-supabase-to-use-with-prisma-3pk6>

## IN SUPABASE GO TO `Settings -> Database`, AND THERE YOU CAN FIND `Connection String`

ONLY THING YOU NEED TO INSERT INSIDE URLL IS PASSWORD WE SETTED WHEN WE CREATED SUPABASE PROJECT

WE CAN ADD THIS STRING TO THE `.env.local`

```
code .env.local
```

```py
# WHEN WE USE SUPABASE CLIENT WE USE THESE TWO
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_URL=
# WHEN WE WANT TO USE URL OF OUR DATBASE, WE USE THIS URL
POSTGRES_URL=
```

# LETS DEFINE ACTUAL CONNECTING TO THE DATBASE

```
mkdir db/supa && touch db/supa/index.ts
```

```ts
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL as string,
});

export const makeDbClient = async () => pool.connect();
```

WE WILL USE THING BOVE TO CONNECT WHEN WE TRY TO QUERY IN OUR HANDLERS

## LETS TEST IT BY BUILDING ONE ENDPOINT, THAT WILL QUERY FOR ALL POSTS

```
touch pages/api/all-posts.ts
```

```ts
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
```

```
yarn dev
```

LETS TEST THIS WITH HTTPIE

```
http GET :3000/api/all-posts
```

AND WE GOT OUR DATA
