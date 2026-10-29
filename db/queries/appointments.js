import db from "../db.js";

const isAvailable = async(reqDate, reqStart, reqEnd) => {
  try {
    let available = true;
    const timeSlots = [];
    const takenSlots = [];
    const reqSlot = [];
    const reqStartVal = Number(reqStart.split(':')[0]) + Number(reqStart.split(':')[1])/60;
    const reqEndVal = Number(reqEnd.split(':')[0]) + Number(reqEnd.split(':')[1])/60;
    reqSlot.splice(1, 1, reqStartVal, reqEndVal);


    const takenSQL = `
    SELECT
    date,
    start_time,
    end_time
    FROM appointments
    WHERE date = '${reqDate}'
    `;
    const { rows: takenTimes } = await db.query(takenSQL);

    for (let i = 0; i < takenTimes.length; i++) {
      const startHour = Number(takenTimes[i].start_time.split(':')[0]);
      const startMin = Number(takenTimes[i].start_time.split(':')[1]);
      const endHour = Number(takenTimes[i].end_time.split(':')[0]);
      const endMin = Number(takenTimes[i].end_time.split(':')[1]);
      const startVal = startHour + (startMin / 60);
      const endVal = endHour + (endMin / 60);
      timeSlots.push([startVal, endVal]);
    };

    timeSlots.sort((a, b) => a[0] - b[0]);

    for (let i = 0; i < timeSlots.length; i++) {
      if (takenSlots.length < 1) takenSlots.push(timeSlots[i]);
      if (timeSlots[i][0] > takenSlots[takenSlots.length - 1][1]) {
        takenSlots.push(timeSlots[i]);
      };
      if (takenSlots[takenSlots.length - 1][0] <= timeSlots[i][0] && timeSlots[i][1] > takenSlots[takenSlots.length - 1][1]) {
        takenSlots[takenSlots.length - 1].splice(1, 1, timeSlots[i][1]);
      };
    };

    let idx = 0;
    while (available === true && idx < takenSlots.length) {
      if (reqSlot[0] >= takenSlots[idx][0] && reqSlot[0] < takenSlots[idx][1]) available = false;
      if (reqSlot[1] > takenSlots[idx][0] && reqSlot[1] <= takenSlots[idx][1]) available = false;
      idx++
    };

    return available
  } catch (err) {
    console.log(`ERROR CHECKING IS AVAILABE:`, err)
  }
};

export const createAppointment = async ({
  date, /** "YYYY-MM-DD" */
  startTime, /** "HH:MM:00" 24 hour format */
  endTime, /** "HH:MM:00" 24 hour format */
  patientId, 
  serviceId
}) => {
  const sql = `
  INSERT INTO appointments (
    date,
    start_time,
    end_time,
    patient_id,
    service_id
    )
    VALUES (
      '${date}',
      '${startTime}',
      '${endTime}',
      ${patientId},
      ${serviceId}
      )
      RETURNING *;
      `;

  try {
    if (await isAvailable(date, startTime, endTime) === false) throw new Error(`ERROR CREATING APPOINTMENT: The requested time is not available.`);
    const {
      rows: [appointment],
    } = await db.query(sql);
    return appointment;
  } catch (err) {
    throw err
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
      AND date > CURRENT_DATE
  `;

  try {
    const { rows: appointments } = await db.query(sql);
    if (appointments.length < 1) throw new Error(`ATTENTION!!: There are no appointments under the queried client's account.`);
    return appointments
  } catch (err) {
    console.log(`ERROR GETTING APPOINTMENTS BY CLIENT ID:`, err);
    throw err
  }
};

export const getAppointmentsByPatientID = async (patientId, clientId) => {
  const sql = `
    SELECT
      appointments.id AS appt_id,
      date,
      patient_info.id AS patient_id,
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
    WHERE appointments.patient_id = ${patientId}
      AND patient_info.client_id = ${clientId}
      AND date >= CURRENT_DATE
  `;

  try {
    const { rows: appointments } = await db.query(sql);
    if (appointments.length < 1) throw new Error(`There are no available appointments to show for this patient.`);
    return appointments
  } catch (err) {
    throw err
  }
};

export const getApptDetails = async (apptId, patientId) => {
  const sql = `
    SELECT
      appointments.id AS appt_id,
      date,
      start_time,
      end_time,
      patient_info.id AS patient_id,
      patient_info.first_name,
      patient_info.nickname,
      patient_info.last_name,
      service_id,
      services.title,
      services.description
    FROM appointments
    JOIN patient_info
      ON appointments.patient_id = patient_info.id
    JOIN services
      ON appointments.service_id = services.id
    WHERE appointments.id = ${apptId}
      AND appointments.patient_id = ${patientId}
      AND date >= CURRENT_DATE
  `;

  try {
    const { rows: [appointment] } = await db.query(sql);
    if (!appointment) throw new Error(`The queried appointment does not exist or the appointment has passed.`);
    return appointment;
  } catch (err) {
    throw err
  }
};

export const cancelAppointment = async (apptId, patientId) => {
  /*
    The process of changing appointments requires the patient/client to
    cancel/delete the appointment and then to reschedule/create a new
    appointment.

    canceled appointments will be deleted from the database.

    completed appointments will be used to track previous rendered services
    or no-shows. This will be handled as an administrative task.
  */
 
  const sql = `
    DELETE FROM appointments
    WHERE appointments.id = ${apptId} AND appointments.patient_id = ${patientId}
  `;
  
  try {
    await db.query(sql);
  } catch (err) {
    console.log(`ERROR CANCELING APPOINTMENT:`, err)
    throw err
  }
};
