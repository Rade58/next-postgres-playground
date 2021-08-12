# PRISMA MIGRATION

WE HAVE PROBLEM IN OUR APP

WHEN TRYING TO LOGIN (USING OAUTH), NEXT AUTH IS TRYING TO CREATE NEW USER IN POSTGRES

**PROBLEM IS THAT OAUTH USER OBJECT HAS A `image` FIELD (AN URL STRING OF AN IMAGE FROM GITHUB OR FROM GOOGLE), AND NEXT AUTH IS USING PRISMA CLIENT TO INSERT IN OUR DATBASE, BUT OUR POSTGRES INSTANCE NOT ALLOWING image COLUMN INSIDE RECORD OF users TAABLE**

HERE YOU CAN SEE THAT WE DIDN'T DEFINE image

```
cat prisma/schema.prisma
```

```ts
// ...
// ...
// AS YOU CAN SEE, THERES NO image COLUMN IN HERE

model User {
  id    Int     @id @default(autoincrement())
  name  String?
  email String? @unique
  posts Post[]
  createdAt DateTime @default(now()) @map(name: "created_at")
  updatedAt DateTime @updatedAt @map(name: "updated_at")

  @@map(name: "user")
}

// ...
// ...
```

**TO DEFINE ANOTHER COLUMN WE NEED TO USE SOMETHING CALLED MIGRATION**

MIGRATION IS A BIT DANGEROUS I THINK, SINCE I'VE READ THIS

>> As part of adding Prisma Migrate to your development environment, you must reset your development database. This will result in data loss in the development database only.

>> Production databases and any other database that cannot be reset should be baselined to avoid data loss.

SO WE SHOULD AVOID MIGRATIONS IN PRODUCTION

IN DEVELOPMENT MIGRATIONS ARE ACCEPTABLE

## LETS CREATE INITAIAL MIGRATION

WE WON'T BE MODIFIING SCHEMA FOR INITIAL MIGRATION

I CREATED THIS SCRIPT

```json
"prisma:migrate:init": "dotenv -e .env.local -- npx prisma migrate dev --name init",
```

LETS EXECUTE IT

```
yarn prisma:migrate:init
```

**IN THIS PROCES NEW FOLDER IS GENERATED**: `prisma/migrations`

YOU CAN SEE BY YOURSELF WHAT STUFF IS IN MENTIONED FOLDER

## LET'S NOW ADD A NEW MIGRATION SCRIPT, LETS THEN MODIFY OUR SCHEMA, AND AFTER THAT WE ARE GOING TO DO NEW MIGRATION





```
code prisma/schema.prisma
```

```ts
// ...
// ...
// LETS DEFINE image COLUMN

model User {
  id    Int     @id @default(autoincrement())
  name  String?
  email String? @unique
  // I ADDED THIS
  image String?
  // 
  posts Post[]
  createdAt DateTime @default(now()) @map(name: "created_at")
  updatedAt DateTime @updatedAt @map(name: "updated_at")

  @@map(name: "user")
}

// ...
// ...
```



**JUST YOU KNOW, AFTER EVERY MIGRATION, PRISMA CLIENT IS UPDATED, ACTUALLY IT IS GENERATED AGAIN (I AM TALKING ABOUR @prisma/client PACKAGE WE HAVE, AND WE USED THAT PACKAGE TO QUERY NOT SO LONG AGO)**

