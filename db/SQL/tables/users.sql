CREATE TABLE users(
  user_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nano_id VARCHAR (48),
  -- random_id ,

  email VARCHAR (50) UNIQUE NOT NULL,
  nickname VARCHAR (100) NOT NULL,
  last_login TIMESTAMP,
  created_on TIMESTAMP NOT NULL,
);
