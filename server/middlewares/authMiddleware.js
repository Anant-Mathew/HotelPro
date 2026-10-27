const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "hotelpro_super_secret_jwt_key_2026";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers["x-auth-token"];

  if (!authHeader) {
    return res.status(401).json({ msg: "No token provided, authorization denied" });
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid or has expired" });
  }
};

const adminMiddleware = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user && req.user.userType === "Admin") {
      next();
    } else {
      return res.status(403).json({ msg: "Access denied. Admin privileges required." });
    }
  });
};

module.exports = {
  authMiddleware,
  adminMiddleware
};
