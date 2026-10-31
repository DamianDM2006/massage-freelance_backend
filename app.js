import express from "express";
import cors from "cors";
const app = express();
export default app;

import addressesRouter from "./api/addresses.js";
import appointmentsRouter from "./api/appointments.js";
import clientsRouter from "./api/clients.js";
import patientsRouter from "./api/patients.js";
import servicesRouter from "./api/services.js";
import getClientFromToken from "./middleware/getClientFromToken.js";

const allowedOrigins = [
  'http://localhost:5173'
];

app.use(express.json());
app.use(getClientFromToken);
app.use(cors({ origin: 'http://localhost:5173' }));

app.use('/api/addresses', addressesRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/services', servicesRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(`INTERNAL SERVER ERROR: Please, wait and try again later as we work on a remedy.`)
})