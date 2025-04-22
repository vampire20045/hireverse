//@ts-ignore
import jwt from "jsonwebtoken";
const Sec = "Aryan";

export const authentication = async (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1]; // Expecting "Bearer <token>"
    const decoded: any = jwt.verify(token, Sec);
    req.user = { id: decoded.id }; // Assuming token payload has an `id`
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};
