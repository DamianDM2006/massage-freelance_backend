import express from "express";
const app = express();
export default app;

import clientsRouter from "./api/clients.js";
import patientsRouter from "./api/patients.js";
import appointmentsRouter from "./api/appointments.js";
import servicesRouter from "./api/services.js";
import getClientFromToken from "./middleware/getClientFromToken.js";

app.use(express.json());
app.use(getClientFromToken);
app.use('/API/clients', clientsRouter);
app.use('/API/patients', patientsRouter);
app.use('/API/appointments', appointmentsRouter);
app.use('/API/services', servicesRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(`INTERNAL SERVER ERROR: Please, wait and try again later as we work on a remedy.`)
})