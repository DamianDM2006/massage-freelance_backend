import db from "../db.js";

export const createAddress = async ({
  street1,
  street2,
  unit,
  city,
  subDistrict,
  district,
  state,
  postalCode,
}) => {
  try {
    const sql = `
      MERGE INTO addresses a
      USING (VALUES (
        '${street1}',
        '${street2}',
        '${unit}',
        '${city}',
        '${subDistrict}',
        '${district}',
        '${state}',
        ${postalCode}
        ))
      AS n(
        street_number_1,
        street_number_2,
        apt_unit,
        city,
        sub_district,
        district,
        provence_state,
        postal_code
      )
      ON 
        a.street_number_1 = n.street_number_1 AND
        a.street_number_2 = n.street_number_2 AND
        a.apt_unit = n.apt_unit AND
        a.city = n.city AND
        a.sub_district = n.sub_district AND
        a.district = n.district AND
        a.provence_state = n.provence_state AND
        a.postal_code = n.postal_code
      WHEN NOT MATCHED THEN
        INSERT (
          street_number_1,
          street_number_2,
          apt_unit,
          city,
          sub_district,
          district,
          provence_state,
          postal_code
        )
        VALUES (
          n.street_number_1,
          n.street_number_2,
          n.apt_unit,
          n.city,
          n.sub_district,
          n.district,
          n.provence_state,
          n.postal_code
        )
      WHEN MATCHED THEN DO NOTHING
      RETURNING a.*;
    `;

    const {
      rows: [address],
    } = await db.query(sql);
    console.log(`address FROM createAddress:`, address);
    if (!address) throw new Error(`Address not added or already exists`);
    return address;
  } catch (err) {
    console.log(`ERROR CREATING ADDRESS:`, err);
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
    const {
      rows: [address],
    } = await db.query(sql);

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
    const {
      rows: [address],
    } = await db.query(sql);
    if (!address) throw new Error(`The address or the patient does not exist`);
    // console.log(`ADDRESS FROM getAddressByPatientId:`, address);
    return address;
  } catch (err) {
    console.log(`ERROR GETTING PATIENT'S ADDRESS`, err);
  }
};

export const updatePatientAddress = async (
  patientID,
  { street1, street2, unit, city, subDistrict, district, state, postalCode }
) => {
  const sql = `
    WITH upsert_address AS (
      INSERT INTO addresses (
        street_number_1,
        street_number_2,
        apt_unit,
        city,
        sub_district,
        district,
        provence_state,
        postal_code
      )
      VALUES (
        '${street1}',
        '${street2}',
        '${unit}',
        '${city}',
        '${subDistrict}',
        '${district}',
        '${state}',
        ${postalCode}
      )
      ON CONFLICT (
        street_number_1,
        street_number_2,
        apt_unit,
        city,
        sub_district,
        district,
        provence_state,
        postal_code
      )
      DO UPDATE SET
        street_number_1 = EXCLUDED.street_number_1,
        street_number_2 = EXCLUDED.street_number_2,
        apt_unit = EXCLUDED.apt_unit,
        city = EXCLUDED.city,
        sub_district = EXCLUDED.sub_district,
        provence_state = EXCLUDED.provence_state,
        postal_code = EXCLUDED.postal_code
      RETURNING id
    )

    UPDATE patient_info
    SET address_id = (SELECT id FROM upsert_address)
    WHERE id = ${patientID}
    RETURNING id AS patient_id, address_id;
  `;

  try {
    const { rows: [patient]} = await db.query(sql);
    if (!patient) throw new Error(`The address was NOT updated. Please, try again.`);
    console.log(`PATIENT FROM updatePatientAddress:`, patient);
    return patient;
  } catch (err) {
    console.log(`ERROR UPDATING PATIENT ADDRESS:`, err);
  }
};
