import jwt from "jsonwebtoken";
import { getClientById } from "../db/queries/client_credentials.js";
const secretKey = process.env.JWT_SECRET;

const getUserFromToken = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) return next();

  const token = authorization.split(' ')[1];
  // console.log(`token:`, token);

  try {
    const decoded = jwt.verify(token, secretKey);
    // console.log(`decoded:`, decoded);

    const client = await getClientById(decoded.id);
    // console.log(`client:`, client);

    req.client = client;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send(err.message);
  }
};

export default getUserFromToken;
