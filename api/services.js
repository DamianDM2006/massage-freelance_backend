import express from "express";
const router = express.Router();
export default router;

import {
  getAllServices,
  getServiceDetailsById
} from "../db/queries/services.js";

/** Gets all services. Returns titles. */
router.get('/', async(req, res) => {
  try {
    const services = await getAllServices();
    res.send(services)
  } catch(err) {
    res.send(err.message)
  }
});

/** Gets details of a specific service. */
router.param('id', async (req, res, next, id) => {
  try {
    const service = await getServiceDetailsById(id);
    req.serviceId = service.id;
    next()
  } catch(err) {
    res.send(err.message)
  }
});

router.get('/:id', (req, res) => {
  res.send(req.service)
});

/** Will be able to create a service. 
 *  FUTURE: Admin only when schema is updated.
*/

/** Will be able to amend service details.
 * FUTURE: Admin only when schema is updated.
 */