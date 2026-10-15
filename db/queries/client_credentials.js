import db from "../client.js";
import bcrypt from "bcrypt";
console.log(`INITIATING CLIENT_CREDENTIALS.JS`);

export const createClientCreds = async (userName, password) => {
  console.log(`IN createClientCreds: `, userName, password);
  const hashPass = await bcrypt.hash(password, 10);
  const sql = `
    INSERT INTO client_credentials (user_name, password)
    VALUES ($1, $2)
    RETURNING *
  `;
  try {
    const { rows: [client] } = await db.query(sql, [userName,hashPass]);
    console.log(`client_credentials.USER:`, client);
    return client;
  } catch(err) {
    console.log(err)
  }
};