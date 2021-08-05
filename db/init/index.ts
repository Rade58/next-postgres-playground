import {Pool} from 'pg'

// THIS SHOULD BE ENV VARIABLES
const user = "rade";
const pass = "schism";
const dbName = "db_of_love";
// 


const pool = new Pool({
  connectionString: `postgresql://${user}:${pass}@localhost:5432/${dbName}`
})

export const makeDbClient = async () => pool.connect(); 

