import db from "../db.js";

export const createAppointment = async ({
  date,
  startTime,
  endTime,
  patientID,
  serviceID
}) => {
  const sql = `
    INSERT INTO appointments (
      date,
      start_time,
      end_time,
      patient_id,
      service_id)
    VALUES (
      '${date}',
      '${startTime}',
      '${endTime}',
      '${patientID}',
      '${serviceID}')
    RETURNING *;
  `;
  try {
    const {
      rows: [appointment],
    } = await db.query(sql);
    //console.log(`appointment:`, appointment);
    return appointment;
  } catch (err) {
    console.log(`ERROR CREATING APPOINTMENT:`, err);
  }
};

export const getAllAppointments = async () => {
  /*
    This will be used to obtain unavailable appointment times.
    the algorythm will be handled mostly on the front end.

    this can also be used to provide a schedule for the therapist.
  */

  const sql = `
    SELECT
      appointments.id AS appt_id,
      date,
      start_time,
      end_time,
      patient_id,
      patient_info.first_name,
      patient_info.nickname,
      patient_info.last_name,
      service_id,
      services.title,
      appointments.completed
    FROM appointments
    JOIN patient_info
      ON appointments.patient_id = patient_info.id
    JOIN services
      ON appointments.service_id = services.id
  `;

  try {
    const { rows: appointments } = await db.query(sql);
    // console.log(`appointments:`, appointments);
    return appointments
  } catch (err) {
    console.log(`ERROR GETTING ALL APPOINTMENTS:`, err)
  }
};

export const getAppointmentsByClientID = async (clientID) => {
  const sql = `
    SELECT
      appointments.id AS appt_id,
      date,
      start_time,
      end_time,
      patient_id,
      patient_info.first_name,
      patient_info.nickname,
      patient_info.last_name,
      service_id,
      services.title,
      appointments.completed
    FROM appointments
    JOIN patient_info
      ON appointments.patient_id = patient_info.id
    JOIN services
      ON appointments.service_id = services.id
    WHERE patient_info.client_id = ${clientID}
  `;

  try {
    const { rows: appointments } = await db.query(sql);
    if (appointments.length < 1) throw new Error(`There are no appointments under the queried client's account.`);
    return appointments
  } catch (err) {
    console.log(`ERROR GETTING APPOINTMENT BY CLIENT ID:`, err)
  }
};

export const getAppointmentsByPatientID = async (patientID) => {
  const sql = `
    SELECT
      appointments.id AS appt_id,
      date,
      start_time,
      end_time,
      patient_info.first_name,
      patient_info.nickname,
      patient_info.last_name,
      patient_info.client_id,
      service_id,
      services.title,
      appointments.completed
    FROM appointments
    JOIN patient_info
      ON appointments.patient_id = patient_info.id
    JOIN services
      ON appointments.service_id = services.id
    WHERE appointments.patient_id = ${patientID}  
  `;

  try {
    const { rows: appointments } = await db.query(sql);
    if (appointments.length < 1) throw new Error(`The queried patient does not have appointments scheduled.`);
    return appointments
  } catch (err) {
    console.log(`ERROR GETTING APPOINTMENT BY PATIENT ID:`, err)
  }
};

export const cancelAppointment = async (apptID) => {
  /*
    The process of changing appointments requires the patient/client to
    cancel/delete the appointment and then to reschedule/create a new
    appointment.

    canceled appointments will be deleted from the database.

    completed appointments will be used to track previous rendered services
    or no-shows.
  */

  const sql = `
    DELETE FROM appointments
    WHERE id = ${apptID}
  `;

  try {
    await db.query(sql);
    throw new Error(`The appointment previously haveing id:${apptID} does not exist.`);
  } catch (err) {
    console.log(`ERROR CANCELING APPOINTMENT:`, err)
  }
};
