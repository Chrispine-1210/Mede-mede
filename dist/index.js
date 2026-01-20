var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemoryStorage = class {
  users = /* @__PURE__ */ new Map();
  products = /* @__PURE__ */ new Map();
  orders = /* @__PURE__ */ new Map();
  orderItems = /* @__PURE__ */ new Map();
  cartItems = /* @__PURE__ */ new Map();
  deliveryTracking = /* @__PURE__ */ new Map();
  loyaltyProgram = /* @__PURE__ */ new Map();
  paymentRecords = /* @__PURE__ */ new Map();
  events = /* @__PURE__ */ new Map();
  notifications = [];
  nextId = 0;
  constructor() {
    this.initializeTestData();
  }
  generateId() {
    return `test_${++this.nextId}`;
  }
  initializeTestData() {
    const flower1 = {
      id: "prod_1",
      name: "Premium Indica Flower",
      description: "High-quality Indica strain with deep forest notes",
      productType: "flower",
      strainType: "Indica",
      pricePerGram: 3500,
      totalPrice: null,
      stockQuantity: 50,
      imageUrl: null,
      isAvailable: true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    const flower2 = {
      id: "prod_2",
      name: "Golden Sativa Flower",
      description: "Energizing Sativa strain, perfect for daytime",
      productType: "flower",
      strainType: "Sativa",
      pricePerGram: 3e3,
      totalPrice: null,
      stockQuantity: 40,
      imageUrl: null,
      isAvailable: true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    const preroll1 = {
      id: "prod_3",
      name: "Mini Pre-Roll Pack",
      description: "500mg pre-rolled package, single stick",
      productType: "preroll",
      strainType: null,
      size: "500",
      pricePerGram: null,
      totalPrice: 500,
      stockQuantity: 100,
      imageUrl: null,
      isAvailable: true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    const preroll2 = {
      id: "prod_4",
      name: "Standard Pre-Roll Pack",
      description: "1000mg pre-rolled package, 2 sticks",
      productType: "preroll",
      strainType: null,
      size: "1000",
      pricePerGram: null,
      totalPrice: 1e3,
      stockQuantity: 80,
      imageUrl: null,
      isAvailable: true,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.products.set(flower1.id, flower1);
    this.products.set(flower2.id, flower2);
    this.products.set(preroll1.id, preroll1);
    this.products.set(preroll2.id, preroll2);
    console.log("\u2705 In-Memory Storage initialized with test products");
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async upsertUser(userData) {
    const user = {
      id: userData.id || this.generateId(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: userData.profileImageUrl,
      role: userData.role || "customer",
      isActive: userData.isActive !== false,
      vehicleNumber: userData.vehicleNumber,
      driverLicenseNumber: userData.driverLicenseNumber,
      currentLatitude: userData.currentLatitude,
      currentLongitude: userData.currentLongitude,
      isAvailableForDelivery: userData.isAvailableForDelivery,
      totalDeliveries: userData.totalDeliveries || 0,
      averageRating: userData.averageRating,
      loyaltyPoints: userData.loyaltyPoints || 0,
      loyaltyTier: userData.loyaltyTier || "bronze",
      phoneNumber: userData.phoneNumber,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(user.id, user);
    return user;
  }
  // Product operations
  async getProducts() {
    return Array.from(this.products.values());
  }
  async getProduct(id) {
    return this.products.get(id);
  }
  async createProduct(product) {
    const newProduct = {
      id: this.generateId(),
      ...product,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.products.set(newProduct.id, newProduct);
    return newProduct;
  }
  async updateProduct(id, product) {
    const existing = this.products.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...product, updatedAt: /* @__PURE__ */ new Date() };
    this.products.set(id, updated);
    return updated;
  }
  // Cart operations
  async getCartItems(userId) {
    const items = Array.from(this.cartItems.values()).filter((item) => item.userId === userId);
    return items.map((item) => ({
      ...item,
      product: this.products.get(item.productId)
    }));
  }
  async addToCart(item) {
    const cartItem = {
      id: this.generateId(),
      ...item,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.cartItems.set(cartItem.id, cartItem);
    return cartItem;
  }
  async updateCartItem(id, quantity) {
    const item = this.cartItems.get(id);
    if (!item) return void 0;
    item.quantity = quantity;
    this.cartItems.set(id, item);
    return item;
  }
  async removeCartItem(id) {
    this.cartItems.delete(id);
  }
  async clearCart(userId) {
    Array.from(this.cartItems.entries()).forEach(([key, item]) => {
      if (item.userId === userId) {
        this.cartItems.delete(key);
      }
    });
  }
  // Order operations
  async createOrder(order, items) {
    const newOrder = {
      id: this.generateId(),
      ...order,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      completedAt: null
    };
    this.orders.set(newOrder.id, newOrder);
    items.forEach((item) => {
      const orderItem = {
        id: this.generateId(),
        ...item,
        orderId: newOrder.id
      };
      this.orderItems.set(orderItem.id, orderItem);
    });
    return newOrder;
  }
  async getOrders(userId) {
    const userOrders = Array.from(this.orders.values()).filter((o) => o.userId === userId);
    return userOrders.map((order) => ({
      ...order,
      orderItems: Array.from(this.orderItems.values()).filter((item) => item.orderId === order.id)
    }));
  }
  async getAllOrders() {
    return Array.from(this.orders.values()).map((order) => ({
      ...order,
      orderItems: Array.from(this.orderItems.values()).filter((item) => item.orderId === order.id)
    }));
  }
  async updateOrderStatus(id, status) {
    const order = this.orders.get(id);
    if (!order) return void 0;
    order.status = status;
    order.updatedAt = /* @__PURE__ */ new Date();
    this.orders.set(id, order);
    return order;
  }
  // Driver operations
  async getAvailableDrivers() {
    return Array.from(this.users.values()).filter((u) => u.role === "driver" && u.isAvailableForDelivery);
  }
  async getDriverStats(driverId) {
    const driver = this.users.get(driverId);
    return {
      totalDeliveries: driver?.totalDeliveries || 0,
      averageRating: driver?.averageRating || "N/A",
      isAvailable: driver?.isAvailableForDelivery || false
    };
  }
  async assignOrderToDriver(orderId, driverId) {
    const order = this.orders.get(orderId);
    if (!order) return void 0;
    order.driverId = driverId;
    order.status = "assigned";
    this.orders.set(orderId, order);
    return order;
  }
  async getDriverOrders(driverId) {
    const driverOrders = Array.from(this.orders.values()).filter((o) => o.driverId === driverId);
    return driverOrders.map((order) => ({
      ...order,
      orderItems: Array.from(this.orderItems.values()).filter((item) => item.orderId === order.id)
    }));
  }
  async updateDriverLocation(driverId, lat, lng) {
    const driver = this.users.get(driverId);
    if (!driver) return void 0;
    driver.currentLatitude = lat;
    driver.currentLongitude = lng;
    this.users.set(driverId, driver);
    return driver;
  }
  async updateDeliveryTracking(orderId, driverId, lat, lng, speed) {
    this.deliveryTracking.set(this.generateId(), { orderId, driverId, latitude: lat, longitude: lng, speed, timestamp: /* @__PURE__ */ new Date() });
  }
  async getDeliveryTracking(orderId) {
    return Array.from(this.deliveryTracking.values()).filter((t) => t.orderId === orderId);
  }
  async setDriverAvailability(driverId, isAvailable) {
    const driver = this.users.get(driverId);
    if (!driver) return void 0;
    driver.isAvailableForDelivery = isAvailable;
    this.users.set(driverId, driver);
    return driver;
  }
  // Loyalty Program operations
  async getLoyaltyAccount(userId) {
    return this.loyaltyProgram.get(userId) || { userId, points: 0, totalSpent: 0, tier: "bronze" };
  }
  async addLoyaltyPoints(userId, points) {
    const account = this.loyaltyProgram.get(userId) || { userId, points: 0, totalSpent: 0, tier: "bronze" };
    account.points += points;
    this.loyaltyProgram.set(userId, account);
    return account;
  }
  // Payment operations
  async createPaymentRecord(orderId, userId, amount, stripeIntentId) {
    const record = { id: this.generateId(), orderId, userId, amount, stripePaymentIntentId: stripeIntentId, status: "pending" };
    this.paymentRecords.set(record.id, record);
    return record;
  }
  async updatePaymentStatus(paymentId, status) {
    const record = this.paymentRecords.get(paymentId);
    if (record) record.status = status;
    return record;
  }
  // Events operations
  async getActiveEvents() {
    return Array.from(this.events.values()).filter((e) => e.isActive);
  }
  async createEvent(data) {
    const event = { id: this.generateId(), ...data };
    this.events.set(event.id, event);
    return event;
  }
  // Inventory Alerts operations
  async checkLowInventory() {
    return [];
  }
  async updateInventoryAlert(productId, currentStock) {
  }
  // Notification Log operations
  async logNotification(data) {
    this.notifications.push(data);
    return data;
  }
  // Analytics operations
  async getOrCreateDailySummary(date) {
    return { date, totalOrders: 0, totalRevenue: 0 };
  }
  async updateAnalyticsSummary(date, data) {
    return { date, ...data };
  }
  async getAnalyticsSummary(days = 30) {
    return [];
  }
};
var storage = new MemoryStorage();

// server/replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import MemoryStore from "memorystore";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const Store = MemoryStore(session);
  const sessionStore = new Store({
    checkPeriod: 864e5
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
var isAdmin = async (req, res, next) => {
  const user = req.user;
  const userId = user?.claims?.sub;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const dbUser = await storage.getUser(userId);
  if (dbUser?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  next();
};
var isDriver = async (req, res, next) => {
  const user = req.user;
  const userId = user?.claims?.sub;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const dbUser = await storage.getUser(userId);
  if (dbUser?.role !== "driver") {
    return res.status(403).json({ message: "Forbidden: Driver access required" });
  }
  next();
};

// shared/schema.ts
import { sql, relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { length: 50 }).default("customer").notNull(),
  // customer, admin, driver
  isActive: boolean("is_active").default(true).notNull(),
  // Driver specific fields
  vehicleNumber: varchar("vehicle_number"),
  driverLicenseNumber: varchar("driver_license_number"),
  currentLatitude: varchar("current_latitude"),
  currentLongitude: varchar("current_longitude"),
  isAvailableForDelivery: boolean("is_available_for_delivery").default(false),
  totalDeliveries: integer("total_deliveries").default(0),
  averageRating: varchar("average_rating"),
  // Loyalty program fields
  loyaltyPoints: integer("loyalty_points").default(0),
  loyaltyTier: varchar("loyalty_tier", { length: 50 }).default("bronze"),
  // bronze, silver, gold, platinum
  phoneNumber: varchar("phone_number"),
  // For SMS notifications
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  productType: varchar("product_type", { length: 50 }).notNull(),
  // "flower" or "preroll"
  strainType: varchar("strain_type", { length: 50 }),
  // Indica, Sativa, Hybrid (for flowers)
  size: varchar("size"),
  // For prerolls: 500, 1000, 1500, 2000 (mg)
  pricePerGram: integer("price_per_gram"),
  // Price in MWK per gram (for flowers)
  totalPrice: integer("total_price"),
  // Fixed price (for prerolls/packages)
  stockQuantity: integer("stock_quantity").notNull().default(0),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var deliveryTracking = pgTable("delivery_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  driverId: varchar("driver_id").notNull().references(() => users.id),
  latitude: varchar("latitude").notNull(),
  longitude: varchar("longitude").notNull(),
  speed: integer("speed").default(0),
  timestamp: timestamp("timestamp").defaultNow()
});
var orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  driverId: varchar("driver_id").references(() => users.id),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  // pending, processing, assigned, out_for_delivery, completed, cancelled
  deliveryLocation: text("delivery_location").notNull(),
  deliveryLatitude: varchar("delivery_latitude"),
  deliveryLongitude: varchar("delivery_longitude"),
  totalAmount: integer("total_amount").notNull(),
  deliveryFee: integer("delivery_fee").default(0),
  distanceKm: integer("distance_km").default(0),
  // For calculating delivery fee
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at")
});
var insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: varchar("product_id").notNull().references(() => products.id),
  productName: varchar("product_name", { length: 255 }).notNull(),
  // Store product name at time of order
  quantity: integer("quantity").notNull(),
  pricePerGram: integer("price_per_gram").notNull(),
  // Store price at time of order
  subtotal: integer("subtotal").notNull()
});
var insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true
});
var cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: varchar("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow()
});
var insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true
});
var usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  cartItems: many(cartItems)
}));
var productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  cartItems: many(cartItems)
}));
var ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id]
  }),
  orderItems: many(orderItems)
}));
var orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  })
}));
var cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id]
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id]
  })
}));
var deliveryTrackingRelations = relations(deliveryTracking, ({ one }) => ({
  order: one(orders, {
    fields: [deliveryTracking.orderId],
    references: [orders.id]
  }),
  driver: one(users, {
    fields: [deliveryTracking.driverId],
    references: [users.id]
  })
}));
var loyaltyProgram = pgTable("loyalty_program", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  points: integer("points").default(0).notNull(),
  totalSpent: integer("total_spent").default(0).notNull(),
  tier: varchar("tier", { length: 50 }).default("bronze").notNull(),
  // bronze, silver, gold, platinum
  lastPointsUpdate: timestamp("last_points_update").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var paymentRecords = pgTable("payment_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id),
  stripePaymentIntentId: varchar("stripe_payment_intent_id").unique(),
  amount: integer("amount").notNull(),
  // Amount in cents
  currency: varchar("currency", { length: 10 }).default("MWK").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  // pending, succeeded, failed, cancelled
  paymentMethod: varchar("payment_method", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  // "sports", "special_event", "promotion"
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  imageUrl: text("image_url"),
  discount: integer("discount"),
  // Percentage discount
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var inventoryAlerts = pgTable("inventory_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  minimumThreshold: integer("minimum_threshold").notNull().default(50),
  // Alert when below this
  currentStock: integer("current_stock").notNull().default(0),
  isActive: boolean("is_active").default(true).notNull(),
  alertSentAt: timestamp("alert_sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var notificationLog = pgTable("notification_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  orderId: varchar("order_id").references(() => orders.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(),
  // "sms", "email", "push"
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  recipient: varchar("recipient", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  // pending, sent, failed
  externalId: varchar("external_id"),
  // ID from Twilio/SendGrid
  createdAt: timestamp("created_at").defaultNow(),
  sentAt: timestamp("sent_at")
});
var analyticsSummary = pgTable("analytics_summary", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: varchar("date", { length: 10 }).notNull().unique(),
  // YYYY-MM-DD format
  totalOrders: integer("total_orders").default(0).notNull(),
  totalRevenue: integer("total_revenue").default(0).notNull(),
  totalCustomers: integer("total_customers").default(0).notNull(),
  averageOrderValue: integer("average_order_value").default(0).notNull(),
  topProduct: varchar("top_product"),
  topCategory: varchar("top_category"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var ordersExtended = pgTable("orders_extended", {
  orderId: varchar("order_id").primaryKey().references(() => orders.id, { onDelete: "cascade" }),
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending").notNull(),
  // pending, paid, failed
  paymentMethod: varchar("payment_method", { length: 50 }),
  loyaltyPointsEarned: integer("loyalty_points_earned").default(0)
});
var loyaltyProgramRelations = relations(loyaltyProgram, ({ one }) => ({
  user: one(users, {
    fields: [loyaltyProgram.userId],
    references: [users.id]
  })
}));
var paymentRecordsRelations = relations(paymentRecords, ({ one }) => ({
  order: one(orders, {
    fields: [paymentRecords.orderId],
    references: [orders.id]
  }),
  user: one(users, {
    fields: [paymentRecords.userId],
    references: [users.id]
  })
}));
var eventsRelations = relations(events, ({ many }) => ({
  products: many(products)
}));
var inventoryAlertsRelations = relations(inventoryAlerts, ({ one }) => ({
  product: one(products, {
    fields: [inventoryAlerts.productId],
    references: [products.id]
  })
}));
var notificationLogRelations = relations(notificationLog, ({ one }) => ({
  user: one(users, {
    fields: [notificationLog.userId],
    references: [users.id]
  }),
  order: one(orders, {
    fields: [notificationLog.orderId],
    references: [orders.id]
  })
}));
var ordersExtendedRelations = relations(ordersExtended, ({ one }) => ({
  order: one(orders, {
    fields: [ordersExtended.orderId],
    references: [orders.id]
  })
}));

// server/services/stripe.ts
import Stripe from "stripe";
var stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_mock_key_for_development";
var stripe = new Stripe(stripeKey, {
  apiVersion: "2023-10-16"
});
async function createPaymentIntent(amount, orderId, customerEmail) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn("Stripe not configured, returning mock payment intent");
      return {
        id: `pi_mock_${Date.now()}`,
        client_secret: `pi_mock_${Date.now()}_secret_mock`,
        status: "requires_payment_method",
        amount: Math.round(amount * 100),
        currency: "mwk",
        metadata: { orderId },
        receipt_email: customerEmail
      };
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      // Convert to cents
      currency: "mwk",
      metadata: { orderId },
      receipt_email: customerEmail
    });
    return paymentIntent;
  } catch (error) {
    console.error("Stripe payment intent error:", error);
    throw error;
  }
}
async function confirmPayment(paymentIntentId) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return {
        id: paymentIntentId,
        status: "succeeded",
        amount: 0,
        currency: "mwk"
      };
    }
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error("Stripe retrieve error:", error);
    throw error;
  }
}

// server/services/notifications.ts
var TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
var TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
var TWILIO_PHONE = process.env.TWILIO_PHONE;
var SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
async function sendEmailNotification(email, subject, message, orderId, userId) {
  try {
    if (!SENDGRID_API_KEY) {
      console.warn("SendGrid not configured");
      if (userId) {
        await storage.logNotification({
          userId,
          orderId,
          type: "email",
          subject,
          message,
          recipient: email,
          status: "pending"
        });
      }
      return;
    }
    const sgMail = __require("@sendgrid/mail");
    sgMail.setApiKey(SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@mede-mede.mw",
      subject,
      text: message,
      html: `<p>${message}</p>`
    };
    const result = await sgMail.send(msg);
    if (userId) {
      await storage.logNotification({
        userId,
        orderId,
        type: "email",
        subject,
        message,
        recipient: email,
        status: "sent",
        externalId: result[0].messageId
      });
    }
    return result;
  } catch (error) {
    console.error("Email notification error:", error);
    if (userId) {
      await storage.logNotification({
        userId,
        orderId,
        type: "email",
        subject,
        message,
        recipient: email,
        status: "failed"
      });
    }
    throw error;
  }
}

// server/routes.ts
async function registerRoutes(app2) {
  await setupAuth(app2);
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/products", async (req, res) => {
    try {
      const products2 = await storage.getProducts();
      res.json(products2);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.post("/api/products", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(400).json({ message: error.message || "Failed to create product" });
    }
  });
  app2.patch("/api/products/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(400).json({ message: error.message || "Failed to update product" });
    }
  });
  app2.get("/api/cart", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const items = await storage.getCartItems(userId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });
  app2.post("/api/cart", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertCartItemSchema.parse({
        ...req.body,
        userId
      });
      const item = await storage.addToCart(validatedData);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(400).json({ message: error.message || "Failed to add to cart" });
    }
  });
  app2.patch("/api/cart/:id", isAuthenticated, async (req, res) => {
    try {
      const { quantity } = req.body;
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      const item = await storage.updateCartItem(req.params.id, quantity);
      if (!item) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(400).json({ message: error.message || "Failed to update cart" });
    }
  });
  app2.delete("/api/cart/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.removeCartItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });
  app2.post("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { deliveryLocation } = req.body;
      if (!deliveryLocation) {
        return res.status(400).json({ message: "Delivery location is required" });
      }
      const cartItemsData = await storage.getCartItems(userId);
      if (cartItemsData.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      let totalAmount = 0;
      const orderItemsData = cartItemsData.map((item) => {
        const subtotal = (item.product?.pricePerGram || 0) * item.quantity;
        totalAmount += subtotal;
        return {
          productId: item.productId,
          productName: item.product?.name || "Unknown Product",
          quantity: item.quantity,
          pricePerGram: item.product?.pricePerGram || 0,
          subtotal
        };
      });
      const order = await storage.createOrder(
        {
          userId,
          deliveryLocation,
          totalAmount,
          status: "pending"
        },
        orderItemsData
      );
      await storage.clearCart(userId);
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(400).json({ message: error.message || "Failed to create order" });
    }
  });
  app2.get("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders2 = await storage.getOrders(userId);
      res.json(orders2);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.patch("/api/orders/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(400).json({ message: error.message || "Failed to update order" });
    }
  });
  app2.get("/api/admin/orders", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const orders2 = await storage.getAllOrders();
      res.json(orders2);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.get("/api/driver/available", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const drivers = await storage.getAvailableDrivers();
      res.json(drivers);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      res.status(500).json({ message: "Failed to fetch drivers" });
    }
  });
  app2.get("/api/driver/stats", isAuthenticated, isDriver, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getDriverStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching driver stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });
  app2.get("/api/driver/deliveries", isAuthenticated, isDriver, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders2 = await storage.getDriverOrders(userId);
      res.json(orders2);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      res.status(500).json({ message: "Failed to fetch deliveries" });
    }
  });
  app2.post("/api/driver/location", isAuthenticated, isDriver, async (req, res) => {
    try {
      const { latitude, longitude, speed } = req.body;
      const userId = req.user.claims.sub;
      if (!latitude || !longitude) {
        return res.status(400).json({ message: "Latitude and longitude required" });
      }
      await storage.updateDriverLocation(userId, latitude, longitude);
      const orders2 = await storage.getDriverOrders(userId);
      const activeOrder = orders2.find((o) => o.status === "out_for_delivery");
      if (activeOrder) {
        await storage.updateDeliveryTracking(activeOrder.id, userId, latitude, longitude, speed || 0);
      }
      res.json({ message: "Location updated" });
    } catch (error) {
      console.error("Error updating location:", error);
      res.status(500).json({ message: "Failed to update location" });
    }
  });
  app2.post("/api/driver/accept/:orderId", isAuthenticated, isDriver, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const order = await storage.assignOrderToDriver(req.params.orderId, userId);
      res.json(order);
    } catch (error) {
      console.error("Error accepting order:", error);
      res.status(500).json({ message: "Failed to accept order" });
    }
  });
  app2.patch("/api/driver/availability", isAuthenticated, isDriver, async (req, res) => {
    try {
      const { isAvailable } = req.body;
      const userId = req.user.claims.sub;
      const user = await storage.setDriverAvailability(userId, isAvailable);
      res.json(user);
    } catch (error) {
      console.error("Error updating availability:", error);
      res.status(500).json({ message: "Failed to update availability" });
    }
  });
  app2.get("/api/delivery/:orderId/tracking", isAuthenticated, async (req, res) => {
    try {
      const tracking = await storage.getDeliveryTracking(req.params.orderId);
      res.json(tracking);
    } catch (error) {
      console.error("Error fetching tracking:", error);
      res.status(500).json({ message: "Failed to fetch tracking" });
    }
  });
  app2.post("/api/payment/create-intent", isAuthenticated, async (req, res) => {
    try {
      const { orderId, amount } = req.body;
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.email) return res.status(400).json({ message: "User email not found" });
      const paymentIntent = await createPaymentIntent(amount, orderId, user.email);
      await storage.createPaymentRecord(orderId, userId, amount, paymentIntent.id);
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Payment error:", error);
      res.status(500).json({ message: error.message || "Failed to create payment" });
    }
  });
  app2.post("/api/payment/confirm", isAuthenticated, async (req, res) => {
    try {
      const { paymentIntentId, orderId } = req.body;
      const payment = await confirmPayment(paymentIntentId);
      if (payment.status === "succeeded") {
        await storage.updateOrderStatus(orderId, "processing");
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        await storage.addLoyaltyPoints(userId, Math.floor((payment.amount || 0) / 100));
        if (user?.email) {
          await sendEmailNotification(
            user.email,
            "Payment Successful",
            "Your payment has been confirmed. Your order is being processed."
          );
        }
      }
      res.json(payment);
    } catch (error) {
      console.error("Confirm payment error:", error);
      res.status(500).json({ message: error.message || "Failed to confirm payment" });
    }
  });
  app2.get("/api/loyalty", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const account = await storage.getLoyaltyAccount(userId);
      res.json(account);
    } catch (error) {
      console.error("Error fetching loyalty:", error);
      res.status(500).json({ message: "Failed to fetch loyalty info" });
    }
  });
  app2.get("/api/events", async (req, res) => {
    try {
      const eventsList = await storage.getActiveEvents();
      res.json(eventsList || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.json([]);
    }
  });
  app2.post("/api/events", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const event = await storage.createEvent(req.body);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(400).json({ message: error.message || "Failed to create event" });
    }
  });
  app2.get("/api/admin/inventory-alerts", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const alerts = await storage.checkLowInventory();
      res.json(alerts || []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.json([]);
    }
  });
  app2.get("/api/admin/analytics", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const days = parseInt(req.query.days) || 30;
      const summary = await storage.getAnalyticsSummary(days);
      res.json(summary || []);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.json([]);
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
