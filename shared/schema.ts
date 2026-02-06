// Database schema for Mede-Mede Spot e-commerce platform
// Professional standalone authentication system

// schema.ts - Advanced Mede-Mede Spot Schema with insert schemas & Zod validation
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

/* -------------------- Sessions -------------------- */
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

/* -------------------- Users -------------------- */
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { length: 50 }).default("customer").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  vehicleNumber: varchar("vehicle_number"),
  driverLicenseNumber: varchar("driver_license_number"),
  currentLatitude: varchar("current_latitude"),
  currentLongitude: varchar("current_longitude"),
  isAvailableForDelivery: boolean("is_available_for_delivery").default(false),
  totalDeliveries: integer("total_deliveries").default(0),
  averageRating: varchar("average_rating"),
  loyaltyPoints: integer("loyalty_points").default(0),
  loyaltyTier: varchar("loyalty_tier", { length: 50 }).default("bronze"),
  phoneNumber: varchar("phone_number"),
  lastLoginAt: timestamp("last_login_at"),
  loginCount: integer("login_count").default(0),
  preferences: jsonb("preferences"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod validation for registration
export const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["customer", "admin", "driver"]).default("customer"),
  phoneNumber: z.string().optional(),
  vehicleNumber: z.string().optional(),
  driverLicenseNumber: z.string().optional(),
});

// Insert schema for DB insertion
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
  loginCount: true,
  totalDeliveries: true,
  averageRating: true,
  loyaltyPoints: true,
  preferences: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;

/* -------------------- Products -------------------- */
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  productType: varchar("product_type", { length: 50 }).notNull(),
  strainType: varchar("strain_type", { length: 50 }),
  size: varchar("size"),
  pricePerGram: integer("price_per_gram"),
  totalPrice: integer("total_price"),
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

/* -------------------- Orders -------------------- */
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  driverId: varchar("driver_id").references(() => users.id),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  deliveryLocation: text("delivery_location").notNull(),
  deliveryLatitude: varchar("delivery_latitude"),
  deliveryLongitude: varchar("delivery_longitude"),
  totalAmount: integer("total_amount").notNull(),
  deliveryFee: integer("delivery_fee").default(0),
  distanceKm: integer("distance_km").default(0),
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

/* -------------------- Order Items -------------------- */
export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: varchar("product_id").notNull().references(() => products.id),
  productName: varchar("product_name", { length: 255 }).notNull(),
  quantity: integer("quantity").notNull(),
  pricePerGram: integer("price_per_gram").notNull(),
  subtotal: integer("subtotal").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

/* -------------------- Cart Items -------------------- */
export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: varchar("product_id").notNull().references(() => products.id, { onDelete: 'cascade' }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true, createdAt: true });
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

/* -------------------- Messages -------------------- */
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").references(() => users.id),
  orderId: varchar("order_id").references(() => orders.id),
  role: varchar("role", { length: 50 }),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

/* -------------------- Events -------------------- */
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  imageUrl: text("image_url"),
  discount: integer("discount"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

/* -------------------- Delivery Tracking -------------------- */
export const deliveryTracking = pgTable("delivery_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  driverId: varchar("driver_id").notNull().references(() => users.id),
  latitude: varchar("latitude").notNull(),
  longitude: varchar("longitude").notNull(),
  speed: integer("speed").default(0),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertDeliveryTrackingSchema = createInsertSchema(deliveryTracking).omit({ id: true, timestamp: true });
export type InsertDeliveryTracking = z.infer<typeof insertDeliveryTrackingSchema>;
export type DeliveryTracking = typeof deliveryTracking.$inferSelect;

/* -------------------- Relations -------------------- */
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  cartItems: many(cartItems),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  cartItems: many(cartItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, { fields: [cartItems.userId], references: [users.id] }),
  product: one(products, { fields: [cartItems.productId], references: [products.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
  order: one(orders, { fields: [messages.orderId], references: [orders.id] }),
}));
