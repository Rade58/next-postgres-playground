# UPDATING PRISMA AND REGENERATING `@prisma/client`

WHEN INTERACTING WITH PRISMA (BY USING PRISMA CLI), YOU WILL SOMETIME SEE THIS MESSAGE

```zsh
┌─────────────────────────────────────────────────────────┐
│  Update available 2.28.0 -> 2.29.0                      │
│  Run the following to update                            │
│    yarn add --dev prisma                                │
│    yarn add @prisma/client                              │
└─────────────────────────────────────────────────────────┘
```

YES YOU SHOULD RUN THESE COMMANDS AND UPATE prisma ALSO UPDATE @prisma/client

```
yarn add prisma --dev
```

```
yarn add @prisma/client
```
# BUT WHEN UPDATING PRISMA CLIENT, DON'T FORGET TO REGENERTE PRISMA CLIENT AFTER YOU DO THAT

LIKE I SAID PRISMA CLIENT IS GENERATED TO FIT YOUR SCHEMA, YOUR TABLES

SO YOU SHOUD RUN THIS SCRIPT WE CREATED EARLIER

```
cat package.json
```

```json
"prisma:generate:client": "dotenv -e .env.local -- npx prisma generate",
```

SO DONT FORGET TO DO THAT

```
yarn prisma:generate:client
```