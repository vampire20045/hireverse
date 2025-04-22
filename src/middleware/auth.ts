import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "Aryan"; 

export const auth = async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    const decoded: any = jwt.verify(token, JWT_SECRET);

    req.user = { id: decoded.companyId }; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};
