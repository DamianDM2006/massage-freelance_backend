import pg from "pg";
const db = new pg.Client(process.env.DATABASE_URL);

console.log(`INITIATING CLIENT.JS`);
export default db;