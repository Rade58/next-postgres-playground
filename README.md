## I'LL SHOW YOU HOW TO CREATE AND QUERY DUMMY DATA USING `PRISMA STUDIO`

LETS MAKE SCRIPT AGAINN SINCE WE NEED TO SPECIFY THAT WE ARE USING DTABASE URL FROM .env.local FILE

```
code package.json
```

```json
"scripts": {
    
    "prisma:db:push": "dotenv -e .env.local -- npx prisma db push",
    // ADDDED THIS
    "prisma:studio": "dotenv -e .env.local -- npx prisma studio",
    
  },
```

LETS RUN IT

```
yarn prisma:studio
```

STUDIO IS REACT APP SERVED ON <http://localhost:5555/>

**TRY TO CREATE RECORDS IN Users NA Posts TABLES**

I DID IT SUCCESSFULLY

## IN NEXT BRANCH WE ARE GOING TO USE PRISMA CLIENT

