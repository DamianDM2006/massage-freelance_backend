import app from "./app.js";
import db from "./db/db.js";

const PORT = process.env.PORT || 3000;

// app.get('/', (req, res) => {
//   res.send('hello world');
// })

// await db.connect();

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
