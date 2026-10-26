import express from "express";
const router = express.Router();
export default router;

import requireAuth from "../middleware/requireAuth.js";
import requireBody from "../middleware/requireBody.js";

import {
  createAddress,
  getAddressesByClientId,
  getAddressByPatientId,
  updatePatientAddress
} from "../db/queries/addresses.js";

router.use(requireAuth);

/** Gets addresses associated with a client */
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

/** Gets the address of a patient */
router.get('/:id', (req, res) => {
  res.send(req.address);
});

/** Updates a patient's address and creates a new address if it doesn't already exist */
router.put('/:id/patient', requireBody(["street1", "city", "state", "postalCode"]), async(req, res, id) => {
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

    const newAddress = await updatePatientAddress(
      req.address.patient_id,
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

    res.send(newAddress);
  } catch(err) {
    res.send(err.message)
  }
});

/** Creates a new address */
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