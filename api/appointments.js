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

/** Will Get all future appointments related to a client. */
router.get('/', (req, res) => {
  res.send(`Welcome to Massage-Freelance's Appointments area.`)
});

/** Will Get all future appointments relating to a patient. */

/** Will Schedule a future appointment relating to a patient. */

/** Will "cancel" a future appointment; i.e. delete the appointment from the database.
 *  Rescheduling an appointment will require the patient to "cancel" then schedule a new appointment.
 */

/** Will Update appointments once completed.
 *  This will be only done by the therapist, NOT the client/patient.
 */