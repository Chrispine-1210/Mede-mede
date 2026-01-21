// Professional E-Commerce Platform - Routes
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { isAuthenticated, isAdmin, isDriver, isCustomer } from "./middleware/roleAuth";
import * as customerService from "./services/customerService";
import * as adminService from "./services/adminService";
import * as driverService from "./services/driverService";
import { insertProductSchema, insertCartItemSchema, insertOrderSchema } from "@shared/schema";
import { createPaymentIntent, confirmPayment, refundPayment } from "./services/stripe";
import { sendSMSNotification, sendEmailNotification, notifyOrderStatusChange } from "./services/notifications";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware - standalone authentication
  await setupAuth(app);

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await adminService.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await adminService.createNewProduct(validatedData);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create product" });
    }
  });

  app.patch("/api/products/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const product = await adminService.updateProductInfo(req.params.id, req.body);
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to update product" });
    }
  });

  // Cart routes
  app.get("/api/cart", isAuthenticated, async (req: any, res) => {
    try {
      const items = await customerService.getCustomerCart(req.user.id);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", isAuthenticated, async (req: any, res) => {
    try {
      const { productId, quantity } = req.body;
      const item = await customerService.addProductToCart(req.user.id, productId, quantity || 1);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to add to cart" });
    }
  });

  app.patch("/api/cart/:id", isAuthenticated, async (req, res) => {
    try {
      const item = await customerService.updateCartItemQuantity(req.params.id, req.body.quantity);
      if (!item) return res.status(404).json({ message: "Cart item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to update cart" });
    }
  });

  app.delete("/api/cart/:id", isAuthenticated, async (req, res) => {
    try {
      await customerService.removeFromCart(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  // Order routes
  app.post("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const order = await customerService.createCustomerOrder(req.user.id, req.body.deliveryLocation);
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create order" });
    }
  });

  app.get("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const orders = await customerService.getCustomerOrders(req.user.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.patch("/api/orders/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const order = await adminService.updateOrderStatus(req.params.id, req.body.status);
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to update order" });
    }
  });

  // Admin routes
  app.get("/api/admin/orders", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const orders = await adminService.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Driver routes
  app.get("/api/driver/available", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const drivers = await adminService.getAvailableDriversList();
      res.json(drivers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch drivers" });
    }
  });

  app.get("/api/driver/stats", isAuthenticated, isDriver, async (req: any, res) => {
    try {
      const stats = await driverService.getDriverPerformance(req.user.id);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/driver/deliveries", isAuthenticated, isDriver, async (req: any, res) => {
    try {
      const orders = await driverService.getAssignedDeliveries(req.user.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deliveries" });
    }
  });

  app.post("/api/driver/location", isAuthenticated, isDriver, async (req: any, res) => {
    try {
      const { latitude, longitude, speed } = req.body;
      await driverService.updateDriverLocationTracking(req.user.id, latitude, longitude, speed);
      res.json({ message: "Location updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update location" });
    }
  });

  app.post("/api/driver/accept/:orderId", isAuthenticated, isDriver, async (req: any, res) => {
    try {
      const order = await driverService.acceptDeliveryOrder(req.user.id, req.params.orderId);
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to accept order" });
    }
  });

  app.patch("/api/driver/availability", isAuthenticated, isDriver, async (req: any, res) => {
    try {
      const user = await driverService.setDriverAvailable(req.user.id, req.body.isAvailable);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update availability" });
    }
  });

  app.get("/api/delivery/:orderId/tracking", isAuthenticated, async (req, res) => {
    try {
      const tracking = await customerService.trackOrderDelivery(req.params.orderId);
      res.json(tracking);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tracking" });
    }
  });

  // Payment routes
  app.post("/api/payment/create-intent", isAuthenticated, async (req: any, res) => {
    try {
      const { orderId, amount } = req.body;
      const user = await storage.getUser(req.user.id);
      if (!user?.email) return res.status(400).json({ message: "User email not found" });
      
      const paymentIntent = await createPaymentIntent(amount, orderId, user.email);
      await storage.createPaymentRecord(orderId, req.user.id, amount, paymentIntent.id);
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to create payment" });
    }
  });

  app.post("/api/payment/confirm", isAuthenticated, async (req: any, res) => {
    try {
      const { paymentIntentId, orderId } = req.body;
      const payment = await confirmPayment(paymentIntentId);
      
      if (payment.status === 'succeeded') {
        await adminService.updateOrderStatus(orderId, 'processing');
        const user = await storage.getUser(req.user.id);
        
        await storage.addLoyaltyPoints(req.user.id, Math.floor((payment.amount || 0) / 100));
        
        if (user?.email) {
          await sendEmailNotification(user.email, 'Payment Successful', 'Your order is being processed.');
        }
      }
      res.json(payment);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Failed to confirm payment" });
    }
  });

  // Loyalty routes
  app.get("/api/loyalty", isAuthenticated, async (req: any, res) => {
    try {
      const account = await customerService.getCustomerLoyalty(req.user.id);
      res.json(account);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loyalty info" });
    }
  });

  // Events routes
  app.get("/api/events", async (req, res) => {
    try {
      const eventsList = await adminService.getActiveEventsList();
      res.json(eventsList || []);
    } catch (error) {
      res.json([]);
    }
  });

  app.post("/api/events", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const event = await storage.createEvent(req.body);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to create event" });
    }
  });

  // Inventory alerts routes
  app.get("/api/admin/inventory-alerts", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const alerts = await adminService.checkLowStockProducts();
      res.json(alerts || []);
    } catch (error) {
      res.json([]);
    }
  });

  // Analytics routes
  app.get("/api/admin/analytics", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const summary = await adminService.getDashboardAnalytics(days);
      res.json(summary || []);
    } catch (error) {
      res.json([]);
    }
  });

  // Chat routes
  app.get("/api/chat", isAuthenticated, async (req: any, res) => {
    try {
      const { orderId, role } = req.query;
      const messages = await storage.getMessages(orderId as string, role as string);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/chat", isAuthenticated, async (req: any, res) => {
    try {
      const message = await storage.createMessage({
        senderId: req.user.id,
        content: req.body.content,
        orderId: req.body.orderId,
        role: req.body.role,
        receiverId: req.body.receiverId,
      });
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
