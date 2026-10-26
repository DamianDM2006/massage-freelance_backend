import express from "express";
const router = express.Router();
export default router;

import requireAuth from "../middleware/requireAuth.js";
import requireBody from "../middleware/requireBody.js";

import {
  getAddressesByClientId,
  createAddress
} from "../db/queries/addresses.js";

router.use(requireAuth);

router.param('id', async (req, res, next, id) => {
  try {
    console.log(`current client:`, req.client);
    const addresses = await getAddressesByClientId(req.client.id);
  } catch(err) {
    console.log(err);
    res.send(err);
  }
});

router.get('/:id', async (req, res, next, id) => {

})

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