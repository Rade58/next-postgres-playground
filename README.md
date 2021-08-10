# NEXT AUTH

WE RE STILL [FOLLOWING THIS](https://vercel.com/guides/nextjs-prisma-postgres#step-5.-set-up-github-authentication-with-nextauth)

LETS INSTALL `next-auth`

```
yarn add next-auth
```

AFTER THIS WE NEED TO MODIFY OUR SCHEMA TO BECAUSE WEE NEED TO ADD THINGS THAT ARE REQUIRED BY NEXT-AUTH

WE NEED ADDITIONAL MODELS

LETS [SEE FIRST OFFICIAL DOCS](https://next-auth.js.org/adapters/typeorm/postgres) AN HOW EVERYTHING IS WRITTEN IN SQL "CREATE DATABSE CLAUES"

WHEN YOU SAW THIS LETS WRITE ADDITIONAL MODELS: `Account`, `Session` (I SAW ALSO TABLE FOR verification_requests (BUT APPARENTLT WORKSHOP AUTHOR DIDN'T DEFINE MODEL VerificationRequest, SO I'M NOT GOINT TO DO THAT EATHER))

## ADDING `Account` AND `Session` MODELS

```
code prisma/schema.prisma
```

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

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User?   @relation(fields: [authorId], references: [id])
  authorId  Int?
}

model User {
  id    Int     @id @default(autoincrement())
  name  String?
  email String? @unique
  posts Post[]

  createdAt DateTime @default(now()) @map(name: "created_at")
  updatedAt DateTime @updatedAt @map(name: "updated_at")

  @@map(name: "user")
}

// ADDING THESE

model Account {
  id                 Int       @id @default(autoincrement())
  compoundId         String    @unique @map(name: "compound_id")
  userId             Int       @map(name: "user_id")
  providerType       String    @map(name: "provider_type")
  providerId         String    @map(name: "provider_id")
  providerAccountId  String    @map(name: "provider_account_id")
  refreshToken       String?   @map(name: "refresh_token")
  accessToken        String?   @map(name: "access_token")
  accessTokenExpires DateTime? @map(name: "access_token_expires")
  createdAt          DateTime  @default(now()) @map(name: "created_at")
  updatedAt          DateTime  @default(now()) @map(name: "updated_at")


  @@index([providerAccountId], name: "providerAccountId")
  @@index([providerId], name: "providerId")
  @@index([userId], name: "userId")
  @@map(name: "accounts")
}

// AND THESE

model Session {
  id           Int      @id @default(autoincrement())
  userId       Int      @map(name: "user_id")
  expires      DateTime
  sessionToken String   @unique @map(name: "session_token")
  accessToken  String   @unique @map(name: "access_token")
  createdAt    DateTime @default(now()) @map(name: "creared_at")
  updatedAt    DateTime @default(now()) @map(name: "updated_at")

  @@map(name: "sessions")

}

```

# NOW WE CAN CREATE SCRIPT WE CREATED EARLIER, THAT WILL BUILD NEW TABLES IN OUR DATABASE

```
yarn prisma:db:push
```

**THIS ALSO MODIFIED INSTANCE OF OUR `"@prisma/client"` PACKE, SO WE CAN QUERY AND MUTATE THESE NEW TABLES**

ALSO OPEN SUPABASE AND CHECK IF YOU HAVE NEW TABLES (YES I DO)