import db from "../db.js";

export const createAddress = async ({
  streetLine1,
  streetLine2,
  unit,
  city,
  subDist,
  district,
  state,
  postalCode,
}) => {
  try {
    const {
      rows: [address],
    } = await db.query(`
      INSERT INTO addresses (
        street_number_1,
        street_number_2,
        apt_unit,
        city,
        sub_district,
        district,
        provence_state,
        postal_code)
      VALUES (
        '${streetLine1}',
        '${streetLine2}',
        '${unit}',
        '${city}',
        '${subDist}',
        '${district}',
        '${state}',
        '${postalCode}')
      RETURNING *;
      `);
    return address;
  } catch (err) {
    console.log(`ERROR CREATING EMPLOYEE:`, err);
  }
};

export const getAddressByClientId = async (clientID) => {
  const sql = `
  SELECT
    client_credentials.id AS id_number,
    patient_info.nickname AS name,
    patient_info.last_name AS last_name,
    addresses.* AS address
  FROM client_credentials
  LEFT JOIN patient_info
  ON client_credentials.id = patient_info.client_id
  LEFT JOIN addresses
  ON patient_info.address_id = addresses.id
  WHERE client_credentials.id = ${clientID}
  AND client_credentials.patient_id = patient_info.id;
  `;

  try {
    const { rows: [address] } = await db.query(sql);

    if (!address) throw new Error(`The address or the client does not exist`);
    // console.log(`ADDRESS: getAddressByClientId`, address);
    return address;
  } catch (err) {
    console.log(`ERROR GETTING CLIENT'S ADDRESS:`, err);
  }
};

export const getAddressByPatientId = async (patientID) => {
  const sql = `
    SELECT
      patient_info.id AS patient_id,
      patient_info.nickname AS name,
      patient_info.last_name AS last_name,
      addresses.* AS address
    FROM
      patient_info
    LEFT JOIN
      addresses
    ON
      patient_info.address_id = addresses.id
    WHERE patient_info.id = ${patientID};
  `;
  try {
    const { rows: [address] } = await db.query(sql);
    if (!address) throw new Error(`The address or the patient does not exist`);
    // console.log(`ADDRESS FROM getAddressByPatientId:`, address);
    return address;
  } catch (err) {
    console.log(`ERROR GETTING PATIENT'S ADDRESS`, err)
  }
};

export const updatePatientAddress = async (addressID, patientID) => {};
