import app from "./app.js";
import db from "./db/client.js";

const PORT = process.env.PORT ?? 3000;

await db.connect();

// app.get('/', (req, res) => {
//   res.send(`This is my Massage Application`)
// });

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
