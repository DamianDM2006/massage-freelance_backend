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
  const hashPass = await bcrypt.hash(newPassword, 10);
  const sql = `
    UPDATE client_credentials
    SET password = ${hashPass}
    WHERE id = ${clientID}
    RETURNING *;
  `;

  try {
    const {
      rows: [client],
    } = await db.query(sql, [clientID, hashPass]);
    return client;
  } catch (err) {
    console.log(`ERROR UPDATING PASSWORD:`, err);
  }
};

export const loginClient = async ({ userName, password }) => {
  try {
    const {
      rows: [client],
    } = await db.query(
      `
      SELECT * FROM client_credentials
      WHERE user_name = $1;
      `,
      [userName],
    );

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

export const getClientByLogin = async (userName, password) => {};

export const getClientByToken = async () => {};

export const getClientById = async (id) => {};

export const getClientByPatientId = async (patientID) => {};
