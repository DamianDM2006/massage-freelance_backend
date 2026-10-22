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

export const getAllPatientsByClientId = async (clientID) => {
  const sql = `
    SELECT
      patient_info.id AS  patient_id,
      nickname,
      first_name,
      last_name
    FROM patient_info
    WHERE patient_info.client_id = ${clientID}  
  `;

  try {
    const { rows: patients } = await db.query(sql);
    // console.log(`patients FROM getAllPatientsByClientId:`, patients);
    if (patients.length < 1) throw new Error(`There is no data related to the query`)
  } catch (err) {
    console.log(`ERROR GETTING ALL PATIENTS BY CLIENT_ID:`, err)
  }
};

export const updatePatientInfo = async (
  patientID,
  { lastName, nickname, email, LineUserID, phone }
) => {
  /* updating the patient's address is handled by updatePatientAddress from addresses.js */

  const sql = `
  UPDATE patient_info
  SET
    last_name = '${nickname}',
    nickname = '${lastName}',
    email = '${email}',
    line_user_id = '${LineUserID}',
    phone = '${phone}'
  WHERE id = ${patientID}
  RETURNING patient_info.*
  `;

  try {
    const { rows: [patient] } = await db.query(sql);
    // console.log(`patient FROM updatePatientInfo:`, patient);
    if (!patient) throw new Error(`There is no data related to the query`);
    return patient
  } catch (err) {
    console.log(`ERROR UPDATING PATIENT INFORMATION:`, err)
  }
};

export const getAllPatients = async () => {
  const sql = `
  SELECT
    patient_info.id AS patient_id,
    client_id,
    nickname,
    first_name,
    last_name
  FROM patient_info`;

  try {
    const { rows: patients } = await db.query(sql);
    // console.log(`patients FROM getAllPatients:`, patients);
    return patients
  } catch (err) {
    console.log(`ERROR GETTING ALL PATIENTS:`, err)
  }
};
