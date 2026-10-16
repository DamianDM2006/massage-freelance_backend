import db from "../db.js";

export const createPatient = async ({
  clientID,
  firstName,
  lastName,
  nickname,
  gender,
  addressID,
  email,
  lineID,
  phone,
  birthdate,
}) => {
  try {
    const {
      rows: [patient],
    } = await db.query(`
        INSERT INTO patient_info (
          client_id,
          first_name,
          last_name,
          nickname,
          gender,
          address_id,
          email,
          line_user_id,
          phone,
          birthdate)
        VALUES (
          '${clientID}',
          '${firstName}',
          '${lastName}',
          '${nickname}',
          '${gender}',
          '${addressID}',
          '${email}',
          '${lineID}',
          '${phone}',
          '${birthdate}')
        RETURNING *;
      `);
    return patient;
  } catch (err) {
    console.log(`ERROR CREATING PATIENT:`, err);
  }
};

export const getPatientInfoById = async (id) => {};

export const getAllPatientsByClientId = async (clientID) => {};

export const updatePatientInfo = async (patientID) => {};
/*
    ABLE TO UPDATE THE FOLLOWING 
      client_id (patient becomes payer/opens new account)
      last_name (case of marriage, etc.)
      nickname
      address_id
      email
      line_user_id
      phone
  */

export const getAllPatients = async () => {};
