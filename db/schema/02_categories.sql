-- Drop and recreate catagories table (Example)

DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
  id SERIAL PRIMARY KEY NOT NULL,
  type VARCHAR(255) NOT NULL
);
