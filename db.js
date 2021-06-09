require("dotenv").config();

const Pool = require("pg").Pool;

const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const HOST = process.env.DB_HOST;
const PORT = process.env.DB_PORT;
const DATABASE = process.env.DB_DATABASE;

const devConfig = {
  user: USER,
  password: PASSWORD,
  host: HOST,
  port: PORT,
  database: DATABASE,
};

const prodConfig = {
  connectionString: process.env.DATABASE_URL,
  sslmode: "require",
};

const pool = new Pool(
  process.env.NODE_ENV === "production" ? prodConfig : devConfig
);

module.exports = pool;
