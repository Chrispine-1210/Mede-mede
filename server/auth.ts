import type { Express, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { storage } from "./storage";
import { insertUserSchema } from "../shared/schema";

/* =========================
   ENV
========================= */

const JWT_SECRET = process.env.JWT_SECRET;
const NODE_ENV = process.env.NODE_ENV ?? "development";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}

/* =========================
   TYPES
========================= */

export interface AuthUser {
  id: number;
  email: string;
  role: "admin" | "super_admin" | "customer" | "driver";
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

/* =========================
   SECURITY HELPERS
========================= */

export const noCache = (_: Request, res: Response, next: NextFunction) => {
  res.setHeader("Cache-Control", "no-store");
  next();
};

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Missing Authorization token" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET) as AuthUser;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireRole =
  (...roles: AuthUser["role"][]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };

/* =========================
   PASSWORD UTILITIES
========================= */

const SALT_ROUNDS = 12;

async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

/* =========================
   TOKEN
========================= */

function signToken(user: AuthUser) {
  return jwt.sign(user, JWT_SECRET!, { expiresIn: "24h" });
}

/* =========================
   ROUTES
========================= */

export function setupAuth(app: Express) {
  /* =========================
     REGISTER
  ========================= */

  app.post("/api/auth/register", noCache, async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);

      const existing = await storage.getUserByEmail(data.email);
      if (existing) {
        return res.status(400).json({ message: "Email already registered" });
      }

      if (data.role === "driver" && !data.vehicleNumber) {
        return res.status(400).json({
          message: "Vehicle number is required for drivers",
        });
      }

      const password = await hashPassword(data.password);

      const user = await storage.createUser({
        ...data,
        password,
        role: data.role ?? "customer",
      });

      const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (err: any) {
      res.status(400).json({
        message: "Registration failed",
        ...(NODE_ENV !== "production" && { error: err.message }),
      });
    }
  });

  /* =========================
     LOGIN
  ========================= */

  app.post("/api/auth/login", noCache, async (req, res) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    try {
      const { email, password } = schema.parse(req.body);

      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const valid = await verifyPassword(password, user.password);
      if (!valid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (user.isActive === false) {
        return res.status(403).json({ message: "Account is deactivated" });
      }

      const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      await storage.updateUserLoginStats?.(user.id);

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err: any) {
      res.status(400).json({
        message: "Login failed",
        ...(NODE_ENV !== "production" && { error: err.message }),
      });
    }
  });

  /* =========================
     CURRENT USER (SINGLE SOURCE OF TRUTH)
  ========================= */

  app.get("/api/auth/me", noCache, authenticate, async (req: AuthRequest, res) => {
    const user = await storage.getUser(req.user!.id);

    if (!user) {
      return res.status(401).json({ user: null });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      loyaltyPoints: user.loyaltyPoints,
      loyaltyTier: user.loyaltyTier,
      isActive: user.isActive,
    });
  });
}
