import db from "../client.js";
console.log(`INITIATING APPOINTMENTS.JS`);

export const createAppointment = async ({
  date,
  time,
  patientID,
  serviceID,
}) => {
  const sql = `
    INSERT INTO appointments (
      date,
      time,
      patient_id,
      service_id)
    VALUES (
      '${date}',
      '${time}',
      '${patientID}',
      '${serviceID}')
    RETURNING *;
  `;
  try {
    const { rows: [appointment] } = await db.query(sql);
    return appointment;
  } catch(err) {
    console.log(err)
  }
};