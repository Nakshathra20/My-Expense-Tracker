
// If the token is good, the request continues. If not, it is rejected.
const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) { // middleware function has 3 parameters: req, res and next.next is used to call the next middleware function.
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Please log in first." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // remember who is making the request
    next(); // go on to the real next middleware function which 
  } catch (error) {
    res.status(401).json({ message: "Session expired. Please log in again." });
  }
}

module.exports = requireAuth;