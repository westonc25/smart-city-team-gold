import { SQL, sql } from "bun";

// MySQL connection
// const mysql = new SQL("mysql://user:password@localhost:3306/database");
//const mysql2 = new SQL("mysql2://user:root@127.0.0.1:3306/smart-city-1"); // mysql2 protocol also works

export const db = new SQL({
  adapter: "mysql",
  hostname: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
});

try {
  const result = await db`SELECT 1 as connected`;
  console.log("Database connected:", result);
} catch (error) {
  console.error("Database connection failed:", error);
}

const tables = await db`SHOW TABLES;`;
console.log(tables);