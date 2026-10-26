import express from "express";
const router = express.Router();
export default router;

/** Will Get all services. Returns titles. */
router.get('/', (req, res) => {
  res.send(`Welcome to Massage-Freelance's Severices area.`)
});

/** Will Get details of a specific service. */

/** Will be able to amend service details. */