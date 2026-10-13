import pg from "pg";
const db = new pg.Client(process.env.DATABASE_URL);
console.log(`DB URL`, process.env.DATABASE_URL);
export default db;