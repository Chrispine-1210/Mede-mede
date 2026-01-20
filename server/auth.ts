// Standalone Authentication System - Professional Grade
// Replaces Replit Auth with passport-local + bcrypt

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import MemoryStore from "memorystore";
import bcrypt from "bcryptjs";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";
import { type User, registerUserSchema, loginUserSchema } from "@shared/schema";
export { isAuthenticated, isAdmin, isDriver } from "./middleware/roleAuth";

const SALT_ROUNDS = 12;

// Password hashing utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Session configuration
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const Store = MemoryStore(session);
  const sessionStore = new Store({
    checkPeriod: 86400000, // Prune expired entries every 24h
  });
  
  // Require SESSION_SECRET in production
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET environment variable is required in production");
  }
  
  return session({
    secret: sessionSecret || "dev-session-secret-mede-mede-spot",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
      sameSite: "lax",
    },
  });
}

// Setup authentication
export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Local strategy for email/password login
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          
          if (!user) {
            return done(null, false, { message: "Invalid email or password" });
          }

          if (!user.passwordHash) {
            return done(null, false, { message: "Account requires password reset" });
          }

          const isValid = await verifyPassword(password, user.passwordHash);
          
          if (!isValid) {
            return done(null, false, { message: "Invalid email or password" });
          }

          if (!user.isActive) {
            return done(null, false, { message: "Account is deactivated" });
          }

          // Update login stats
          await storage.updateUserLoginStats(user.id);
          
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || null);
    } catch (error) {
      done(error, null);
    }
  });

  // Registration endpoint with Zod validation
  app.post("/api/auth/register", async (req, res) => {
    try {
      // Validate with Zod schema
      const validationResult = registerUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(e => e.message).join(", ");
        return res.status(400).json({ message: errors });
      }

      const { email, password, firstName, lastName, role, phoneNumber, vehicleNumber, driverLicenseNumber } = validationResult.data;

      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Validate driver-specific fields
      if (role === "driver" && !vehicleNumber) {
        return res.status(400).json({ message: "Vehicle number is required for drivers" });
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user
      const user = await storage.createUser({
        email,
        passwordHash,
        firstName,
        lastName,
        role: role || "customer",
        phoneNumber,
        vehicleNumber,
        driverLicenseNumber,
      });

      // Auto-login after registration
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Registration successful but login failed" });
        }
        res.status(201).json({ 
          message: "Registration successful",
          user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role }
        });
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(500).json({ message: error.message || "Registration failed" });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: User, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Authentication error" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: "Login failed" });
        }
        res.json({ 
          message: "Login successful",
          user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role }
        });
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      req.session.destroy((sessionErr) => {
        res.json({ message: "Logged out successfully" });
      });
    });
  });

  // Get current user endpoint
  app.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = req.user as User;
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
