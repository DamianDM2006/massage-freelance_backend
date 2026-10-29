import express from "express";
const router = express.Router();
export default router;

import requireAuth from "../middleware/requireAuth.js";
import requireBody from "../middleware/requireBody.js";

import {
  getAppointmentsByClientID,
  getAppointmentsByPatientID,
  createAppointment,
  cancelAppointment,
  getApptDetails
} from "../db/queries/appointments.js";

import { getPatientInfoById } from "../db/queries/patient_info.js";

router.use(requireAuth);

/** GETS all future appointments related to a client. */
router.get('/', async(req, res) => {
  try {
    const appointments = await getAppointmentsByClientID(req.client.id);
    res.send(appointments);
  } catch(err) {
    res.status(400).send(err.message)
  }
});

/** Initializes id to patient's id */
router.param('id', async(req, res, next, id) => {
  try {
    const patient = await getPatientInfoById(id, req.client.id);
    req.patientId = patient.patient_id;
    next()
  } catch(err) {
    console.log(err);
    res.status(401).send(err.message);
  }
});

/** GETS all future appointments relating to a patient. */
router.get('/:id', async (req, res) => {
  try {
    const appointments = await getAppointmentsByPatientID(req.patientId, req.client.id);
    if (!appointments) res.status(204).send(`There are no future appointments for the patient.`);
    res.send(appointments)
  } catch(err) {
    console.log(err);
    res.send(err)
  }
});

/** POST Schedules a future appointment relating to a patient. */
router.post('/:id/appointment', requireBody(["date", "startTime", "endTime", "serviceId"]), async(req, res) => {
  try {
    const {
      date,
      startTime,
      endTime,
      serviceId
    } = req.body;

    const appointment = await createAppointment({
      date: date,
      startTime: startTime, 
      endTime: endTime,
      patientId: req.patientId,
      serviceId: serviceId
     });
    res.status(202).send(appointment)
  } catch(err) {
    console.log(err);
    res.send(err.message)
  }
});

router.param('appt', async(req, res, next, appt) => {
  try {
    const appointment = await getApptDetails(appt, req.patientId);
    req.apptId = appointment.appt_id;
    next();
  } catch(err) {
    console.log(err);
    res.status(400).send(err.message)
  }
});

/** GETS a specific appointment details */
router.get('/:id/:appt', async(req, res) => {
  try {
    const appointment = await getApptDetails(req.apptId, req.patientId);
    res.send(appointment)
  } catch(err) {
    console.log(err);
    res.send(err.message)
  }
});

/** Will "cancel" a specific future appointment; i.e. delete the appointment from the database.
 *  Rescheduling an appointment will require the patient to "cancel" then schedule a new appointment.
 */
router.delete('/:id/:appt', async(req, res) => {
  try {
    await cancelAppointment(req.apptId, req.patientId);
    res.status(200).send(`Success:  The appointment has been canceled.`)
  } catch(err) {
    console.log(err);
  }
});
