const { Pool } = require("pg");

const db = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "aabha",
  password: process.env.DB_PASS || "3322",
  port: process.env.DB_PORT || 5432,
});

export default db;
