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

