const requireAuth = async (req, res, next) => {
  if (!req.client || !req.client.id) return res.status(401).send("Unauthorized Access.");
  next();
};

export default requireAuth;