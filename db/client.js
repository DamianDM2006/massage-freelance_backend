import pg from "pg";
const db = new pg.Client(process.env.DATABASE_URL);

console.log(`Connecting to Database: client.js`);
export default db;