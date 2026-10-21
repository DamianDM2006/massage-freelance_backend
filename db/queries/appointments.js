import db from "../db.js";

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
    const {
      rows: [appointment],
    } = await db.query(sql);
    return appointment;
  } catch (err) {
    console.log(`ERROR CREATING APPOINTMENT:`, err);
  }
};

export const getAllAppointments = async () => {
  /*
    This will be used to obtain unavailable appointment time.
    the algorythm will be handled mostly on the front end.

    this can also be used to provide a schedule for the therapist.
  */
};

export const getAppointmentsByClientID = async (clientID) => {};

export const getAppointmentsByPatientID = async (patientID) => {};

export const cancelAppointment = async (appointmentID) => {
  /*
    The process of changing appointments requires the patient/client to
    cancel/delete the appointment and then to reschedule/create a new
    appointment.

    canceled appointments will be deleted from the database.

    completed appointments will be used to track previous rendered services
    or no-shows.
  */
};
