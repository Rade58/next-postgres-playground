# PRISMA CLIENT WAS GENERATED FOR US WHEN WE RUNNED `yarn prisma:db:push`

SO WE DON'T NEED TO INSTALL IT RIGHT NOW (WE DON'T NEED TO EXECUTE `yarn add @prisma/clent`)

IF YOU WANT TO INSTALLL IT (IF YOU WANT TO RUN `yarn add @prisma/client`), AFTER YOU DO THAT, EVERY TIME YOU WOULD NEED TO RUN `npx prisma generate`, **BECAUSE CLIENT NEEDS TO BE TAILORED TO YOUR OWN SCHEMA** (SPAECIALY GENERATED FOR YOUR SCHEMA) (KEEP THIS IN MIND)

SO WE COULDA ADD NEW SCRIPT JUST TO HAVE IT

```
code package.json
```

```json
"scripts": {
  "prisma:db:push": "dotenv -e .env.local -- npx prisma db push",
  "prisma:studio": "dotenv -e .env.local -- npx prisma studio",
  // ADDED THIS (WE RUNN THIS AFTER EVERY TIME WE DO `yarn add /@prisma/client`)
  "prisma:generate:client": "dotenv -e .env.local -- npx prisma generate",
}
```

# SO LETS SETUP PRISMA CLIENT

WE WILL ADD EVERYTHING WE NEED TO THE `/lib` FOLDER

```
mkdir lib/prisma && touch lib/prisma/index.ts
```

```ts
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare module global {
  let prisma: PrismaClient;
}

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }

  prisma = global.prisma;
}

export default prisma;

```

## SO NOW WHEN WE NEED TO DEFINE QUERIES OR MUTATIONS WE USE CLIENT WE REATED