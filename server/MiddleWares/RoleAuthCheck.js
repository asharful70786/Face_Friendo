
async function RoleAuthCheck(req, res, next) {
  const { role } = req.user;
  if (role !== "admin") {
    return res.status(403).json({ message: "Unauthorizedn , only admin can access so don't try to overpass" });

  }
  next();
}

export default RoleAuthCheck;