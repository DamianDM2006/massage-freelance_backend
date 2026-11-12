import express from "express";
const router = express.Router();
export default router;

import requireAuth from "../middleware/requireAuth.js";
import requireBody from "../middleware/requireBody.js";

import {
  getAppointmentsByClientID,
  getAppointmentsByPatientID,
  isAvailable,
  createAppointment,
  cancelAppointment,
  getApptDetails
} from "../db/queries/appointments.js";

import { getPatientInfoById } from "../db/queries/patient_info.js";

router.use(requireAuth);

// GETS all appointments
router.get('/',);

// POSTS a request of availability of a requested appointment 
router.post('/', requireBody(["date", "startTime", "endTime"]), async(req, res) => {
  try {
    const {
      date,
      startTime,
      endTime
    } = req.body;

    const available = await isAvailable({
      date: date,
      startTime: startTime,
      endTime: endTime,
    });
    res.status(202).send({available: available, requested: req.body})
  } catch(err) {
    res.status(400).send(err);
  }
});

// GETS all appointments of a client (i.e. all patients)
router.get('/patients', async(req, res) => {
  try {
    const appointments = await getAppointmentsByClientID(req.client.id);
    res.send(appointments);
  } catch(err) {
    res.status(400).send(err.message)
  }
});

/***** needs testing. If fails then everything below must change. */
// Initializes patid to the patient's id
router.param('patid', async(req, res, next, patid) => {
  try {
    const patient = await getPatientInfoById(patid, req.client.id);
    req.patientId = patient.patient_id; /** ?? req.patid = patient.patient_id ?? */
    next()
  } catch(err) {
    console.log(err);
    res.status(401).send(err.message);
  }
});

// GETS all appointments of a specific patient by patient id
router.get('/patients/:patid', async (req, res) => {
  try {
    const appointments = await getAppointmentsByPatientID(req.patientId, req.client.id);
    if (appointments.length < 1) {
      res.status(203).send('There are no future appointments for the patient.')
    } else {
      res.send(appointments)
    };
  } catch(err) {
    console.log(err);
    res.send(err)
  }
});

// POSTS Schedules a requested appointment for a specific patient after confirming availabilty
router.post('/patient/:patid', requireBody(["date", "startTime", "endTime", "serviceId"]), async(req, res) => {
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
    res.status(400).send(err.message)
  }
});

// Initializea apptid to an appointment's id
router.param('apptid', async(req, res, next, apptid) => {
  try {
    const appointment = await createAppointment(apptid, req.patientId);
    req.apptId = appointment.appt_id;
    next();
  } catch(err) {
    console.log(err);
    res.status(400).send(err.message)
  }
});

// GETS a specific appointment of a specific patient by appointment id
router.get('/patients/:patid/appointment/:apptid', async(req, res) => {
  try {
    const appointment = await getApptDetails(req.apptId, req.patientId);
    res.send(appointment)
  } catch(err) {
    console.log(err);
    res.status(400).send(err.message)
  }
});

// DELETES "cancels" a specific 'future' appointment.
router.delete('/patients/:patid/appointment/:apptid', async(req, res) => {
  try {
    await cancelAppointment(req.apptId, req.patientId);
    res.status(200).send(`Success:  The appointment has been canceled.`)
  } catch(err) {
    console.log(err);
  }
});
