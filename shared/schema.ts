// Database schema for Mede-Mede Spot e-commerce platform
// Professional standalone authentication system

import { sql, relations } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for express-session
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with standalone authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash"), // For standalone auth
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { length: 50 }).default("customer").notNull(), // customer, admin, driver
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
  loyaltyTier: varchar("loyalty_tier", { length: 50 }).default("bronze"), // bronze, silver, gold, platinum
  phoneNumber: varchar("phone_number"), // For SMS notifications
  // ML/Analytics metadata
  lastLoginAt: timestamp("last_login_at"),
  loginCount: integer("login_count").default(0),
  preferences: jsonb("preferences"), // User preferences for ML recommendations
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Registration schema with validation
export const registerUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["customer", "admin", "driver"]).default("customer"),
  phoneNumber: z.string().optional(),
  vehicleNumber: z.string().optional(),
  driverLicenseNumber: z.string().optional(),
});

export type RegisterUser = z.infer<typeof registerUserSchema>;

// Login schema
export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Products table - supports both flowers and pre-rolled packages
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  productType: varchar("product_type", { length: 50 }).notNull(), // "flower" or "preroll"
  strainType: varchar("strain_type", { length: 50 }), // Indica, Sativa, Hybrid (for flowers)
  size: varchar("size"), // For prerolls: 500, 1000, 1500, 2000 (mg)
  pricePerGram: integer("price_per_gram"), // Price in MWK per gram (for flowers)
  totalPrice: integer("total_price"), // Fixed price (for prerolls/packages)
  stockQuantity: integer("stock_quantity").notNull().default(0),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Delivery Tracking table for real-time driver location updates
export const deliveryTracking = pgTable("delivery_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  driverId: varchar("driver_id").notNull().references(() => users.id),
  latitude: varchar("latitude").notNull(),
  longitude: varchar("longitude").notNull(),
  speed: integer("speed").default(0),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Orders table with driver assignment and tracking
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  driverId: varchar("driver_id").references(() => users.id),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, processing, assigned, out_for_delivery, completed, cancelled
  deliveryLocation: text("delivery_location").notNull(),
  deliveryLatitude: varchar("delivery_latitude"),
  deliveryLongitude: varchar("delivery_longitude"),
  totalAmount: integer("total_amount").notNull(),
  deliveryFee: integer("delivery_fee").default(0),
  distanceKm: integer("distance_km").default(0), // For calculating delivery fee
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Order Items table
export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: varchar("product_id").notNull().references(() => products.id),
  productName: varchar("product_name", { length: 255 }).notNull(), // Store product name at time of order
  quantity: integer("quantity").notNull(),
  pricePerGram: integer("price_per_gram").notNull(), // Store price at time of order
  subtotal: integer("subtotal").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

// Cart Items table
export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: varchar("product_id").notNull().references(() => products.id, { onDelete: 'cascade' }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  cartItems: many(cartItems),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  cartItems: many(cartItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const deliveryTrackingRelations = relations(deliveryTracking, ({ one }) => ({
  order: one(orders, {
    fields: [deliveryTracking.orderId],
    references: [orders.id],
  }),
  driver: one(users, {
    fields: [deliveryTracking.driverId],
    references: [users.id],
  }),
}));

// Loyalty Program table - track customer points and rewards
export const loyaltyProgram = pgTable("loyalty_program", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  points: integer("points").default(0).notNull(),
  totalSpent: integer("total_spent").default(0).notNull(),
  tier: varchar("tier", { length: 50 }).default("bronze").notNull(), // bronze, silver, gold, platinum
  lastPointsUpdate: timestamp("last_points_update").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payment Records table - track Stripe transactions
export const paymentRecords = pgTable("payment_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  userId: varchar("user_id").notNull().references(() => users.id),
  stripePaymentIntentId: varchar("stripe_payment_intent_id").unique(),
  amount: integer("amount").notNull(), // Amount in cents
  currency: varchar("currency", { length: 10 }).default("MWK").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, succeeded, failed, cancelled
  paymentMethod: varchar("payment_method", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Events Calendar table - track events and special occasions
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventType: varchar("event_type", { length: 50 }).notNull(), // "sports", "special_event", "promotion"
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  imageUrl: text("image_url"),
  discount: integer("discount"), // Percentage discount
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Inventory Alerts table - track low-stock warnings
export const inventoryAlerts = pgTable("inventory_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id, { onDelete: 'cascade' }),
  minimumThreshold: integer("minimum_threshold").notNull().default(50), // Alert when below this
  currentStock: integer("current_stock").notNull().default(0),
  isActive: boolean("is_active").default(true).notNull(),
  alertSentAt: timestamp("alert_sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notification Log table - track sent notifications
export const notificationLog = pgTable("notification_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  orderId: varchar("order_id").references(() => orders.id, { onDelete: 'cascade' }),
  type: varchar("type", { length: 50 }).notNull(), // "sms", "email", "push"
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  recipient: varchar("recipient", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, sent, failed
  externalId: varchar("external_id"), // ID from Twilio/SendGrid
  createdAt: timestamp("created_at").defaultNow(),
  sentAt: timestamp("sent_at"),
});

// Analytics Summary table - cache aggregated data for dashboard
export const analyticsSummary = pgTable("analytics_summary", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: varchar("date", { length: 10 }).notNull().unique(), // YYYY-MM-DD format
  totalOrders: integer("total_orders").default(0).notNull(),
  totalRevenue: integer("total_revenue").default(0).notNull(),
  totalCustomers: integer("total_customers").default(0).notNull(),
  averageOrderValue: integer("average_order_value").default(0).notNull(),
  topProduct: varchar("top_product"),
  topCategory: varchar("top_category"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Update orders table to include payment status
export const ordersExtended = pgTable("orders_extended", {
  orderId: varchar("order_id").primaryKey().references(() => orders.id, { onDelete: 'cascade' }),
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending").notNull(), // pending, paid, failed
  paymentMethod: varchar("payment_method", { length: 50 }),
  loyaltyPointsEarned: integer("loyalty_points_earned").default(0),
});

// Relations
export const loyaltyProgramRelations = relations(loyaltyProgram, ({ one }) => ({
  user: one(users, {
    fields: [loyaltyProgram.userId],
    references: [users.id],
  }),
}));

export const paymentRecordsRelations = relations(paymentRecords, ({ one }) => ({
  order: one(orders, {
    fields: [paymentRecords.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [paymentRecords.userId],
    references: [users.id],
  }),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  products: many(products),
}));

export const inventoryAlertsRelations = relations(inventoryAlerts, ({ one }) => ({
  product: one(products, {
    fields: [inventoryAlerts.productId],
    references: [products.id],
  }),
}));

export const notificationLogRelations = relations(notificationLog, ({ one }) => ({
  user: one(users, {
    fields: [notificationLog.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [notificationLog.orderId],
    references: [orders.id],
  }),
}));

export const ordersExtendedRelations = relations(ordersExtended, ({ one }) => ({
  order: one(orders, {
    fields: [ordersExtended.orderId],
    references: [orders.id],
  }),
}));
