import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL as string,
});

export const makeDbClient = async () => pool.connect();
