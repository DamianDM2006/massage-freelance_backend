import express from "express";
const app = express();

app.get('/', (req, res) => {
  res.send('Massage - Freelance by Damian Martinez.');
})

export default app;