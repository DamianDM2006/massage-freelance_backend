import express from "express";
const router = express.Router();
export default router;

router.get('/', (req, res) => {
  res.send(`Welcome to Massage-Freelance's Appointments area.`)
})