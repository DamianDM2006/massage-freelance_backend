import express from "express";
const router = express.Router();
export default router;

const secretKey = process.env.JWT_SECRET;

import jwt from "jsonwebtoken";
import requireBody from "../middleware/requireBody.js";

import { getClientByLogin, createClientCreds } from "../db/queries/client_credentials.js";

router.get('/', (req, res) => {
  res.send(`Welcome to Massage-Freelance's Clients area.`);
});

router.post('/login', requireBody(["userName", "password"]), async(req, res, next) => {
  try {
    const { userName, password } = req.body;
    const client = await getClientByLogin({ userName, password });
    if (!client) return res.status(401).send(`INVALID CREDENTIALS: UserName and/or Password.`);
  
    const payload = {
      id: client.id,
      patientID: client.patient_id
    };
    const token = jwt.sign(payload, secretKey, { expiresIn: '1w' });
    res.send(token);
  } catch (err) {
    res.send(err.detail);
    next()
  }
});

router.post('/register', requireBody(["userName", "password"]), async(req, res, next) => {
  try {
    const { userName, password } = req.body;
    const client = await createClientCreds({ userName, password });
    const payload = {
      id: client.id,
      patientID: client.patient_id
    };
    const token = jwt.sign(payload, secretKey, { expiresIn: '1w' });
    res.send(token);
  } catch (err) {
    res.send(err.detail);
    next()
  };
});

router.post('/register/patient',
  requireBody(),
  // requireAuth,
  async(req, res, next) => {
    try{
      /** 
       * create new patient with bringing in the client's id
       * apply the newly made patient id to the client_credentials.patient_id
       * update token to incorporate patient id
       */
    } catch (err) {
      res.send(err.detail);
      next()
    }
  });