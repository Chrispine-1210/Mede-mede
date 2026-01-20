// Role-Based Access Control Middleware
import type { RequestHandler } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export const isCustomer: RequestHandler = (req, res, next) => {
  if (!req.user || req.user.role !== "customer") {
    return res.status(403).json({ message: "Forbidden - Customer access required" });
  }
  next();
};

export const isAdmin: RequestHandler = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }
  next();
};

export const isDriver: RequestHandler = (req, res, next) => {
  if (!req.user || req.user.role !== "driver") {
    return res.status(403).json({ message: "Forbidden - Driver access required" });
  }
  next();
};

export const isAdminOrDriver: RequestHandler = (req, res, next) => {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "driver")) {
    return res.status(403).json({ message: "Forbidden - Admin or Driver access required" });
  }
  next();
};
