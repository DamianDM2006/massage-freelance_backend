import jwt from "jsonwebtoken";
import { getClientById } from "../db/queries/client_credentials.js";

export const getUserFromToken = async (req, res, next) => {
  console.log(`I'm here.`);
};

getUserFromToken();
