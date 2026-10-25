import express from "express";
const router = express.Router();
export default router;

import requireAuth from "../middleware/requireAuth.js";
import requireBody from "../middleware/requireBody.js";

import { createPatient } from "../db/queries/patient_info.js";

router.use(requireAuth);

router.get('/', (req, res) => {
  res.send(`Welcome to Massage-Freelance's Patients area.`)
});

router.post('/',
  requireBody(["lastName", "nickname", "gender"]),
  async (req, res, next) => {
    console.log(`Hello patients`, req.client);
    try{
      /** 
       * create new patient with bringing in the client's id
       * apply the newly made patient id to the client_credentials.patient_id
       * update token to incorporate patient id
       */
      const {
        firstName,
        lastName,
        nickname,
        gender,
        addressID,
        email,
        lineID,
        phone,
        birthdate
      } = req.body;

      const newPatient = await createPatient(
        {
          clientID: req.client.id,
          firstName: firstName,
          lastName: lastName,
          nickname: !nickname ? firstName : nickname,
          gender: gender,
          addressID: !addressID ? 1 : addressID,
          email: !email ? null : email,
          lineID: !lineID ? null : lineID,
          phone: !phone ? null : phone,
          birthdate: !birthdate ? null : birthdate
        }
      );
console.log(`new patient:`, newPatient);
      
      res.status(201).send(newPatient);
    } catch (err) {
      res.send(err.detail);
      next()
    }
  });