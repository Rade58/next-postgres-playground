# `PRISMA ORM` AND OUR POTGRES INSTANCE ON SUPABASE

THIS GUIDE IS HELPFUL

<https://dev.to/prisma/set-up-a-free-postgresql-database-on-supabase-to-use-with-prisma-3pk6>

AND MAYBE YOU CAN WATCH THIS VIDEO

<https://www.youtube.com/watch?v=mU8-nKwfw4Y&t=21s>

**BUT YOU ALSO HAVE OFFICIAL TUTORIAL FOR PRISMA TYPESCRIPT AND POSTGRES**

## THIS IS PRISMAS PAGE

<https://www.prisma.io/>


WHERE I FOUND MENTIONED GUIDE:

<https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgres>

## BUT ALSO NEXTJS HAS VERY GOOD TUTORIAL

<https://vercel.com/guides/nextjs-prisma-postgres>

WHICH INCLUDES MANY MORE THINGS (ONE OF THEM IS NEXT-AUTH)

# FIRST LET'S BACKUP SOME FILES, BECAUSE WHEN WE EXECUTE PRISMA INITIALIZATION, SOME FILES WILL BE OVERWRITTEN

WE WILL BACK UP: .gitignore (RENAME IT TO gitignore WITHOUT DOT)

THAT'S ALL BECAUSE WE DON'T HAVE .env (WHICH WILL ALSO BE GENERATED)

# LETS START BY INSTALLING PRISMA

```
yarn add prisma
```

# LETS INITIALIZE PRISMA, AND THEN LETS ADD URL OF OUR POSTGRES INSTANE AS AN ENV VARIABLE

```
npx prisma init
```

WE HAVE GOT `.gitignore`, `.env` AND `prisma/schema.prisma`

WE CAN REMOVE THAT .gitignore FILE AND CHANGE NAME OF gitignore FILE .gitignore (WE ARE REMOVING THAT FILE BECAUSE IT BRINGS NOTHING IMPORTANT)

WE CAN ALSO REMOVE .env FILE BUT BEFORE THAT, WE MOVE ITS CONTENT TO `.env.local`

.env

```py
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#using-environment-variables

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server (Preview) and MongoDB (Preview).
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

**SO WE REMOVED .env AND ADDED CODE ABOVE, TO THE `.env.local`**

**AND WE SPECIFIED URL OF OUR UPABASE DATBASE**

`.env.local` :

```py
# WHEN WE USE SUPABASE CLIENT WE USE THESE TWO
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_URL=

# WE USED THIS URL WHEN WE TRYED OUT QUERYING
# BY USING node-postgres
POSTGRES_URL=

# ---------------- WE ADDED THIS NOW -----------------

# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#using-environment-variables

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server (Preview) and MongoDB (Preview).
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

# THIS IS THE SAME URL AS ABOVE (HOPE THAT IS CLEAR TO YOU)
DATABASE_URL=<WE ADDED URL HERE>
```

# LETS REVIEW A LITLE BIT, GENERATED FILE `prisma/schema.prisma`

WE CAN SEE THAT URL IS 

```ts
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

```