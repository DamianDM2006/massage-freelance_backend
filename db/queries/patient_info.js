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

const getClientByPatientId = async (id) => {
  const sql = `
    SELECT
      patient_info.nickname AS client_name,
      patient_info.last_name AS client_last
    FROM patient_info
    WHERE
      patient_info.id = (
        SELECT client_credentials.patient_id
        FROM client_credentials
        JOIN patient_info
          ON client_credentials.id = patient_info.client_id
        WHERE patient_info.id = ${id}
      )
  `;
  try {
    const { rows: [client] } = await db.query(sql);
    if (!client) throw new Error(`There is no data related to the query`);
    //console.log(`client FROM getClientByPatientId`, client);
    return client
  } catch (err) {
    console.log(`ERROR GETTING CLIENT BY PATIENT ID`, err);
  }
}

export const getPatientInfoById = async (id) => {
  const client = await getClientByPatientId(id);
  const sql = `
    SELECT
      first_name,
      last_name,
      nickname,
      gender,
      email,
      line_user_id,
      phone,
      birthdate
    FROM patient_info
    WHERE patient_info.id = ${id}
  `;
  try {
    const { rows: [patient] } = await db.query(sql);
    const patientInfo = { ...client, ...patient };
    //console.log(`patient:`, patient);
    //console.log(`patientInfo:`, patientInfo);
    return patientInfo;
  } catch (err) {
    console.log(`ERROR GETTING PATIENT DETAILS:`, err)
  }
  console.log(`client FROM getPatientInfoById:`, client);
};

export const getAllPatientsByClientId = async (clientID) => {};

export const updatePatientInfo = async (patientID) => {
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
};

export const getAllPatients = async () => {};
