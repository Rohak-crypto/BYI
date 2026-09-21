const fs = require("fs");
const path = require("path");
require("dotenv").config();
const mysql = require("mysql2/promise");

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || ""
  });

  const dbName = process.env.DB_NAME || "bid_your_item";
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName.replace(/`/g, "")}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await connection.changeUser({ database: dbName });

  const schema = fs.readFileSync(path.join(__dirname, "../../database/schema.sql"), "utf8");
  for (const statement of schema.split(/;\s*(?:\r?\n|$)/).map(s=>s.trim()).filter(Boolean)) {
    await connection.query(statement);
  }
  console.log(`Database ${dbName} initialized.`);
  await connection.end();
}
main().catch(error => { console.error(error); process.exit(1); });
