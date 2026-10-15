import db from "../client.js";
import bcrypt from "bcrypt";

export const createClientCreds = async (userName, password) => {
  const hashPass = await bcrypt.hash(password, 10);
  const sql = `
    INSERT INTO client_credentials (user_name, password)
    VALUES ($1, $2)
    RETURNING *
  `;
  try {
    const { rows: [client] } = await db.query(sql, [userName, hashPass]);
    return client;
  } catch(err) {
    console.log(`ERROR CREATING CLIENT CREDENTIALS:`, err)
  }
};