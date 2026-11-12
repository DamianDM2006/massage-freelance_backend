import express from "express";
const router = express.Router();
// export default router;

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
// router.post('/',)

// GETS all appointments of a client (i.e. all patients)
// router.get('/patients',);

// Initializes patid to the patient's id
// router.param('patid',);

// GETS all appointments of a specific patient by patient id
// router.get('/patients/:patid',)

// POSTS Schedules a requested appointment for a specific patient after confirming availabilty
// router.post('/patient/:patid',);
  
// Initializea apptid to an appointment's id
// router.param('apptid',);

// GETS a specific appointment of a specific patient by appointment id
// router.get('/patients/:patid/appointment/:apptid',);

// DELETES "cancel" a specific 'future' appointment.
// router.delete('/patients/:patid/appointment/:apptid',);