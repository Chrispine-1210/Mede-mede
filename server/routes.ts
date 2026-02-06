// Core
import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// WebSockets
import { WebSocketServer, WebSocket } from "ws";

// Validation
import { z } from "zod";

// Services
import { storage } from "./storage";
import * as adminService from "./services/adminService";
import * as customerService from "./services/customerService";
import * as driverService from "./services/driverService";
import { createPaymentIntent, confirmPayment } from "./services/stripe";
import { sendEmailNotification } from "./services/notifications";

// Schemas
import {
  insertUserSchema,
  insertProductSchema
} from "@shared/schema";

/* =========================
   ENV
========================= */

const JWT_SECRET = process.env.JWT_SECRET!;
const FRONTEND_URL = process.env.FRONTEND_URL;
const NODE_ENV = process.env.NODE_ENV ?? "development";

if (!JWT_SECRET) throw new Error("JWT_SECRET missing");

/* =========================
   TYPES
========================= */

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: "admin" | "super_admin" | "customer" | "driver";
  };
}

/* =========================
   SECURITY HELPERS
========================= */

const noCache = (_: Request, res: Response, next: NextFunction) => {
  res.setHeader("Cache-Control", "no-store");
  next();
};

const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    req.user = jwt.verify(token, JWT_SECRET) as AuthRequest["user"];
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const requireRole =
  (...roles: AuthRequest["user"]["role"][]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };

/* =========================
   ROUTES
========================= */

export function registerRoutes(app: Express): Server {
  const server = createServer(app);

  /* =========================
     WEBSOCKETS
  ========================= */

  const wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws: WebSocket, req) => {
    if (
      NODE_ENV === "production" &&
      FRONTEND_URL &&
      req.headers.origin !== FRONTEND_URL
    ) {
      ws.close();
      return;
    }

    (ws as any).channels = [];

    ws.on("message", msg => {
      try {
        const data = JSON.parse(msg.toString());
        if (data.type === "subscribe") {
          (ws as any).channels = data.channels ?? [];
        }
      } catch {}
    });
  });

  const broadcast = (channel: string, payload: any) => {
    wss.clients.forEach(client => {
      if (
        client.readyState === WebSocket.OPEN &&
        (client as any).channels?.includes(channel)
      ) {
        client.send(JSON.stringify(payload));
      }
    });
  };

  /* =========================
     AUTH
  ========================= */

  app.post("/api/auth/register", noCache, async (req, res) => {
    const data = insertUserSchema.parse(req.body);

    if (await storage.getUserByEmail(data.email)) {
      return res.status(400).json({ message: "User exists" });
    }

    const password = await bcrypt.hash(data.password, 10);
    const user = await storage.createUser({ ...data, password });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    broadcast("user", { type: "registered", userId: user.id });

    res.status(201).json({ token });
  });

  app.post("/api/auth/login", noCache, async (req, res) => {
    const { email, password } = req.body;
    const user = await storage.getUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    broadcast("user", { type: "login", userId: user.id });

    res.json({ token });
  });

  /* =========================
     CURRENT USER (SOURCE OF TRUTH)
  ========================= */

  app.get("/api/auth/me", noCache, authenticate, async (req: AuthRequest, res) => {
    const user = await storage.getUser(req.user!.id);
    if (!user) return res.status(401).json({ user: null });

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    });
  });

  /* =========================
     PRODUCTS
  ========================= */

  app.get("/api/products", async (_, res) =>
    res.json(await adminService.getAllProducts())
  );

  app.post(
    "/api/products",
    authenticate,
    requireRole("admin", "super_admin"),
    async (req, res) =>
      res.status(201).json(
        await adminService.createNewProduct(
          insertProductSchema.parse(req.body)
        )
      )
  );

  /* =========================
     CART & ORDERS
  ========================= */

  app.get("/api/cart", authenticate, async (req: AuthRequest, res) =>
    res.json(await customerService.getCustomerCart(req.user!.id))
  );

  app.post("/api/orders", authenticate, async (req: AuthRequest, res) =>
    res.status(201).json(
      await customerService.createCustomerOrder(
        req.user!.id,
        req.body.deliveryLocation
      )
    )
  );

  /* =========================
     PAYMENTS
  ========================= */

  app.post("/api/payment/create-intent", authenticate, async (req: AuthRequest, res) => {
    const user = await storage.getUser(req.user!.id);
    if (!user?.email) return res.status(400).json({ message: "Email missing" });

    const intent = await createPaymentIntent(
      req.body.amount,
      req.body.orderId,
      user.email
    );

    res.json({ clientSecret: intent.client_secret });
  });

  app.post("/api/payment/confirm", authenticate, async (req, res) => {
    const payment = await confirmPayment(req.body.paymentIntentId);
    if (payment.status === "succeeded") {
      await sendEmailNotification(
        req.user!.email,
        "Payment successful",
        "Your order is processing"
      );
    }
    res.json(payment);
  });

  return server;
}
