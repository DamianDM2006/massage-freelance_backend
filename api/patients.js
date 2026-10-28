import express from "express";
const router = express.Router();
export default router;

import requireAuth from "../middleware/requireAuth.js";
import requireBody from "../middleware/requireBody.js";

import {
  createPatient,
  getAllPatientsByClientId,
  getPatientInfoById,
} from "../db/queries/patient_info.js";

import { updateWhichPatientIsClient } from "../db/queries/client_credentials.js";

router.use(requireAuth);

/** Gets all patients and patient's information which are related to a client */
router.get("/", async(req, res) => {
  try {
    const patients = await getAllPatientsByClientId(req.client.id);
    res.send(patients);
  } catch(err) {
    console.log(err);
    res.send(err.message)
  }
});

router.param("id", async (req, res, next, id) => {
  try {
    const patient = await getPatientInfoById(id, req.client.id);
    if (!patient) return res.status(404).send("PATIENT NOT FOUND.");
    req.patient = patient;
    next();
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

/** Gets a specific patient's information associated with a client */
router.get("/:id", (req, res) => {
  res.send(req.patient);
});

/** Creates new patient information and associates the information with a specific client. */
router.post(
  "/",
  requireBody(["lastName", "nickname", "gender"]),
  async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        nickname,
        gender,
        addressID,
        email,
        lineID,
        phone,
        birthdate,
      } = req.body;

      const newPatient = await createPatient({
        clientID: req.client.id,
        firstName: !firstName ? nickname : firstName,
        lastName: lastName,
        nickname: nickname,
        gender: gender,
        addressID: !addressID ? 1 : addressID,
        email: !email ? null : email,
        lineID: !lineID ? null : lineID,
        phone: !phone ? null : phone,
        birthdate: !birthdate ? null : birthdate,
      });

      /** Attaches the patient information to a "new" client */
      if (req.client.patient_id === null) {
        await updateWhichPatientIsClient(req.client.id, newPatient.id);
        next();
      }
      res.status(201).send(newPatient);
    } catch (err) {
      res.status(409).send(err.detail);
      next();
    }
  },
);
