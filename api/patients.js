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

router.get("/:id", (req, res) => {
  res.send(req.patient);
});

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
      console.log(`new patient:`, newPatient);

      if (req.client.patient_id === null) {
        // console.log(`Current client does not have an assigned patient_id`);
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
