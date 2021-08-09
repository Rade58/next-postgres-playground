# WE DEFINED SCHEMA IN PREVIOUS BRANCH, NOW LET ORDER PRISMA TO CREATE NEW TABLE, BY USING SCHEMA

BUT WE HAVE ONE PROBLEM AND THAT IS SETTING OF PRISMA THAT TKES ENV VARIABLES ONLY FROM .env FILE

**WE PLACED `DATABASE_URL` INSIDE .env.local SO WE NEED TO STELL PRISMA TO LOD ENV VARIABLE FROM .env.local INSTED**

FOR THAT PURPOSE WE WILL INSTALL [`dotenv-cli`](https://www.npmjs.com/package/dotenv-cli)

```
npm i -g dotenv-cli
```

**WE NEED TO INCORPORATE `npx prisma db push` IN OUR SCRIPT WHERE WE WILL DEFINE THAT ENV VARIABLES ARE LOADING FROM .env.local**

```
code package.json
```

```json
"scripts": {
    
  "prisma:db:push": "dotenv -e .env.local -- npx prisma dp push"
},
```