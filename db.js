// db.js
import "dotenv/config";
import pg from "pg";
const { Pool } = pg;

console.log("DB_USER from .env in db.js:", process.env.DB_USER);
console.log(
  "DB_PASSWORD from .env in db.js:",
  process.env.DB_PASSWORD ? "Loaded" : "NOT Loaded"
);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("DB Connection Error:", err.stack);
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("Error executing initial test query:", err.stack);
    }
    console.log(
      "Successfully connected to PostgreSQL. DB Time:",
      result.rows[0].now
    );
  });
});

export { pool };
