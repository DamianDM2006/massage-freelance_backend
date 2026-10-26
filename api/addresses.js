import express from "express";
const router = express.Router();
export default router;

import requireAuth from "../middleware/requireAuth.js";
import requireBody from "../middleware/requireBody.js";

import {
  createAddress,
  getAddressesByClientId,
  getAddressByPatientId
} from "../db/queries/addresses.js";

router.use(requireAuth);

router.get('/', async(req, res) => {
  try {
    const addresses = await getAddressesByClientId(req.client.id);
    res.send(addresses)
  } catch(err) {
    console.log(err);
    res.send(err.message)
  }
});

router.param('id', async (req, res, next, id) => {
  try {
    const address = await getAddressByPatientId(id, req.client.id);
    req.address = address;
    next()
  } catch(err) {
    console.log(err);
    res.send(err);
  }
});

router.get('/:id', (req, res) => {
  res.send(req.address)
});

router.post('/', requireBody(["street1", "city", "state", "postalCode"]), async (req, res, next) => {
  try {
    const {
      street1,
      street2,
      unit,
      city,
      subDistrict,
      district,
      state,
      postalCode
    } = req.body;

    const address = await createAddress(
      {
        street1: street1,
        street2: street2,
        unit: unit,
        city: city,
        subDistrict: subDistrict,
        district: district,
        state: state,
        postalCode: postalCode
      }
    );
    res.status(201).send(address);
  } catch(err) {
    console.log(err);
    res.send(err.message);
  }
})