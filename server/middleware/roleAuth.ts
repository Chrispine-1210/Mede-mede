// Role-Based Access Control Middleware
import type { RequestHandler } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        [key: string]: any;
      };
    }
  }
}

// Generic role checker
export const requireRole = (roles: string[], message?: string): RequestHandler => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: message || "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: message || "Forbidden" });
    }

    next();
  };
};

// Common shortcuts
export const isAuthenticated = requireRole([], "Unauthorized"); // any logged-in user
export const isCustomer = requireRole(["customer"], "Forbidden - Customer access required");
export const isAdmin = requireRole(["admin"], "Forbidden - Admin access required");
export const isDriver = requireRole(["driver"], "Forbidden - Driver access required");
export const isAdminOrDriver = requireRole(["admin", "driver"], "Forbidden - Admin or Driver access required");
