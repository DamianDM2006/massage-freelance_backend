import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createClientCreds = async ({ userName, password }) => {
  console.log(`userName & password`, userName, password);
  const hashPass = await bcrypt.hash(password, 10);
  const sql = `
    INSERT INTO client_credentials (user_name, password)
    VALUES ($1, $2)
    RETURNING *
  `;
  try {
    const {
      rows: [client],
    } = await db.query(sql, [userName, hashPass]);
    return client;
  } catch (err) {
    console.log(`ERROR CREATING CLIENT CREDENTIALS:`, err);
  }
};

export const updatePasswordbyClientID = async ({ clientID, newPassword }) => {
  try {
    console.log(`cliendID`, clientID, newPassword);
    const hashPass = await bcrypt.hash(newPassword, 10);
    const sql = `
    UPDATE client_credentials
    SET password = '${hashPass}'
    WHERE id = ${clientID}
    RETURNING *
    `;
    
    const { rows: [client] } = await db.query(sql);
    console.log(`CLIENT:`, client);
    return client;
  } catch (err) {
    console.log(`ERROR UPDATING PASSWORD:`, err);
  }
};

export const getClientByLogin = async ({ userName, password }) => {
  const sql = `
    SELECT * FROM client_credentials
    WHERE user_name = $1;
  `;
  try {
    const {
      rows: [client],
    } = await db.query(sql, [userName]);

    if (!client) throw new Error("CLIENT NOT FOUND");

    const passMatches = await bcrypt.compare(password, client.password);

    if (passMatches === false) throw new Error(`INVALID PASSWORD`);

    const token = jwt.sign(
      { id: client.id, userName: client.userName },
      process.env.JWT_SECRET,
      { expiresIn: "1w" },
    );

    return { client, token };
  } catch (err) {
    console.log(`ERROR LOGGING IN CLIENT:`, err);
  }
};

export const getClientById = async (id) => {
  const sql = `
    SELECT *
    FROM client_credentials
    WHERE id = ${id}
  `;

  try {
    const {
      rows: [client],
    } = await db.query(sql);
    return client;
  } catch (err) {
    console.log(`ERROR GETTING CLIENT BY ID:`, err);
  }
};
