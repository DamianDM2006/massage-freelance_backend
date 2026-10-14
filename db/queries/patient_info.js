import db from "../client.js";

export const createPatient = async ({firstName, lastName, nickname, gender, addressID, email, lineID, phone, birthdate }) => {
  try {
    const { rows: [patient] } = await db.query(`
        INSERT INTO patient_info (
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
      return patient
  } catch(err) {
    console.log(`ERROR CREATING PATIENT`, err)
  }
}