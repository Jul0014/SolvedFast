import { verifyToken } from "../libs/verifyToken.js"; // Adjust the path as needed

const authenticateUser = async (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];


  if (authorizationHeader === null || authorizationHeader === undefined) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Extract token from Authorization header
    const token = authorizationHeader.split(' ')[1]; // Bearer <token>

    const user = await verifyToken(token);

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user; // Attach the user to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authenticateUser;