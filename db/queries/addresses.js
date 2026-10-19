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

/*
MERGE INTO addresses a
USING (VALUES ('123 Main St', 'Denver', 'CO', '80216')) 
    AS n(street, city, state, zip_code)
ON a.street = n.street AND a.city = n.city AND a.state = n.state AND a.zip_code = n.zip_code
WHEN NOT MATCHED THEN
    INSERT (street, city, state, zip_code) 
    VALUES (n.street, n.city, n.state, n.zip_code)
WHEN MATCHED THEN
    DO NOTHING
RETURNING a.id;

*/
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

export const updatePatientAddress = async (addressID, patientID, newAddressData) => {
  /*
    Does the new address match exactly any other rows in the table?
      if yes then assign address.id to patient_info.address_id
      if no then create new address and assign new address.id to patient_info.address_id

ALTER TABLE addresses 
ADD CONSTRAINT unique_address_idx UNIQUE (street, city, state, zip_code);

WITH upsert_address AS (
    INSERT INTO addresses (street, city, state, zip_code)
    VALUES ('123 Main St', 'Denver', 'CO', '80216')
    ON CONFLICT (street, city, state, zip_code) 
    DO UPDATE SET street = EXCLUDED.street -- Safe "no-op" to force Postgres to return the existing row ID
    RETURNING id
)
INSERT INTO users (name, address_id)
SELECT 'Jane Doe', id 
FROM upsert_address;


!!!
WITH upsert_address AS (
    MERGE INTO addresses a
    USING (VALUES ('123 Main St', 'Denver', 'CO', '80216')) 
        AS n(street, city, state, zip_code)
    ON a.street = n.street AND a.city = n.city AND a.state = n.state AND a.zip_code = n.zip_code
    WHEN NOT MATCHED THEN
        INSERT (street, city, state, zip_code) 
        VALUES (n.street, n.city, n.state, n.zip_code)
    WHEN MATCHED THEN
        DO NOTHING -- No dummy update needed anymore in PG 17/18!
    RETURNING a.id
)
INSERT INTO users (name, address_id)
SELECT 'Jane Doe', id 
FROM upsert_address;


  */
};
