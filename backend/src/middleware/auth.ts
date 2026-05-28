import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_here";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "ADMIN" | "CUSTOMER";
  };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Bearer <token>

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }

      req.user = decoded as { id: string; email: string; role: "ADMIN" | "CUSTOMER" };
      next();
    });
  } else {
    res.status(401).json({ error: "Authorization header missing" });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Admin role required" });
  }
};
