import express from "express";
const router = express.Router();
export default router;

import requireAuth from "../middleware/requireAuth.js";


import {
  getAppointmentsByClientID,
  getAppointmentsByPatientID,
  cancelAppointment
} from "../db/queries/appointments.js";

router.use(requireAuth);

/** GETS all future appointments related to a client. */
router.get('/', async(req, res) => {
  try {
    const appointments = await getAppointmentsByClientID(req.client.id);
    //console.log(appointments);
    res.send(appointments);
  } catch(err) {
    res.status(400).send(err.message)
  }
});


/** GETS all future appointments relating to a patient. */
router.param('id', async(req, res, next, id) => {
  try {
    const appointments = await getAppointmentsByPatientID(id, req.client.id);
    console.log(appointments);
    req.appointments = appointments;
    next()
  } catch(err) {
    console.log(err)
    res.status(400).send(err.message);
  }
});

router.get('/:id', (req, res) => {
  res.send(req.appointments)
});

/** Will Schedule a future appointment relating to a patient. */
router.post('/:id/', (req, res) => {});

/** Will "cancel" a future appointment; i.e. delete the appointment from the database.
 *  Rescheduling an appointment will require the patient to "cancel" then schedule a new appointment.
 */
// router.delete();

/** Will Update appointments once completed.
 *  This will be only done by the therapist, NOT the client/patient.
 */
// router.patch();