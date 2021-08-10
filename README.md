# DEFINING SCHEMAS

SO WE WRITE OUR SCHEMA IN `prisma/schema.prisma`

**AND BY DEFINING OUR SCHEMA, WE ARE REPLACING USAGE OF `SQL` `CREATE TABLE` CLAUSE (THAT IS PROBABLY GOING TO BE EXECUTED UNDER THE HOOD IF I CAN SAY THAT) AND SCHEMA SHOULD ALSO GIVE US BETTEE DEV EXPERIANCE WHEN WE USE PRISMA CLIENT FOR QUERIES AND MUTATIONS**

## CREATING MODEL FOR `Posts` TABLE AND `Users` TABLE

LET ME REMIND YOU, WE ARE DOING THIS IN A `prisma/schema.prisma` FILE THAT IS GENERATED FOR US

**WE ARE GOING TO DEFINE User WITH SOME SPECIAL STUFF THAT IS REQUIRED FROM US BECAUSE WE PLAN TO USE [next-auth.js](https://next-auth.js.org/) LATER**

```
code prisma/schema.prisma
```

WE COMPLETLY WROTE THE SAME AS IT IS DEFINED [IN THIS TUTORIAL](https://vercel.com/guides/nextjs-prisma-postgres#step-3.-create-your-database-schema-with-prisma)

```c#
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// WE ARE ADDING THIS

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User?   @relation(fields: [authorId], references: [id])
  authorId  Int?
}

// AND THIS (BUT THIS IS NOT ONLY SCHEMA WE WOULD SET
// BECAUSE FOR NEXT AUTH WE NEED SESSIONS (YES SESSION WIL BE KEPT
// IN DATBASE TOO) AND SOME OTHER THINGS)
// BUT FOR NOW WE WILL DEFINE ONLY User

model User {
  id    Int     @id @default(autoincrement())
  name  String?
  email String? @unique
  posts Post[] // THIS IS APARENTLY REQUIRED
  // BECAUSE IN Post WE ARE USING FOREGEIN KEY FOR
  // A User (AND WHEN WE DO THAT WE ALSO NEED TO ENTER
  //        posts Post[]    )

  // NOTE: 
  // >> You're occasionally using
  // >> `@map`and`@@map`to map some field and model names
  // >> to different column and table names in the underlying database.
  // >> This is because NextAuth.js has some special
  // >> requirements for calling things in your database a certain way.


  createdAt DateTime @default(now()) @map(name:"created_at")
  updatedAt DateTime @updatedAt @map(name: "updated_at")

  @@map(name: "user")
}
```

## I'LL SHOW YOU HOW TO APPPLY SCHEMA IN NEST BRANCH