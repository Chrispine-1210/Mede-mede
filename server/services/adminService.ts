// Admin-specific business logic layer
// Handles product management, orders, drivers, and analytics

import { storage } from "../storage";
import type { Product, InsertProduct, Order } from "@shared/schema";

type OrderWithItems = Order & { orderItems?: unknown[] };

/**
 * Returns all products
 */
export async function getAllProducts(): Promise<Product[]> {
  return storage.getProducts();
}

/**
 * Creates a new product
 */
export async function createNewProduct(productData: InsertProduct): Promise<Product> {
  const hasPrice = productData.pricePerGram !== undefined || productData.totalPrice !== undefined;
  if (!productData.name || !hasPrice) {
    throw new Error("Product name and pricing are required");
  }
  return storage.createProduct(productData);
}

/**
 * Updates existing product info
 */
export async function updateProductInfo(
  productId: string,
  productData: Partial<InsertProduct>
): Promise<Product | undefined> {
  return storage.updateProduct(productId, productData);
}

/**
 * Returns all orders with their items
 */
export async function getAllOrders(): Promise<OrderWithItems[]> {
  return storage.getAllOrders();
}

/**
 * Updates order status, with validation
 */
export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<Order | undefined> {
  const validStatuses = ["pending", "confirmed", "assigned", "out_for_delivery", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }
  return storage.updateOrderStatus(orderId, status);
}

/**
 * Returns all drivers currently available for delivery
 */
export async function getAvailableDriversList(): Promise<unknown[]> {
  return storage.getAvailableDrivers();
}

/**
 * Assigns a driver to an order and sets status to 'assigned'
 */
export async function assignDriverToOrder(
  orderId: string,
  driverId: string
): Promise<Order | undefined> {
  const order = await storage.assignOrderToDriver(orderId, driverId);
  if (order) {
    await storage.updateOrderStatus(orderId, "assigned");
  }
  return order;
}

/**
 * Returns dashboard analytics for the last N days
 */
export async function getDashboardAnalytics(days: number = 30): Promise<unknown[]> {
  return storage.getAnalyticsSummary(days);
}

/**
 * Returns all active events
 */
export async function getActiveEventsList(): Promise<unknown[]> {
  return storage.getActiveEvents();
}

/**
 * Returns low-stock products (to trigger alerts)
 */
export async function checkLowStockProducts(): Promise<unknown[]> {
  return storage.checkLowInventory();
}
