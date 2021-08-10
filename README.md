# PRISMA CLIENT WAS GENERATED FOR US WHEN WE RUNNED `yarn prisma:db:push`

SO WE DON'T NEED TO INSTALL IT

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



