// Admin-Specific Business Logic
import { storage } from "../storage";
import type { Product, InsertProduct, Order } from "@shared/schema";

export async function getAllProducts(): Promise<Product[]> {
  return storage.getProducts();
}

export async function createNewProduct(productData: InsertProduct): Promise<Product> {
  if (!productData.name || !productData.pricePerGram === undefined && !productData.totalPrice) {
    throw new Error("Product name and pricing are required");
  }
  return storage.createProduct(productData);
}

export async function updateProductInfo(productId: string, productData: Partial<InsertProduct>): Promise<Product | undefined> {
  return storage.updateProduct(productId, productData);
}

export async function getAllOrders(): Promise<(Order & { orderItems?: any[] })[]> {
  return storage.getAllOrders();
}

export async function updateOrderStatus(orderId: string, status: string): Promise<Order | undefined> {
  const validStatuses = ["pending", "confirmed", "assigned", "out_for_delivery", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
  }
  return storage.updateOrderStatus(orderId, status);
}

export async function getAvailableDriversList(): Promise<any[]> {
  return storage.getAvailableDrivers();
}

export async function assignDriverToOrder(orderId: string, driverId: string): Promise<Order | undefined> {
  const order = await storage.assignOrderToDriver(orderId, driverId);
  if (order) {
    await storage.updateOrderStatus(orderId, "assigned");
  }
  return order;
}

export async function getDashboardAnalytics(days: number = 30): Promise<any[]> {
  return storage.getAnalyticsSummary(days);
}

export async function getActiveEventsList(): Promise<any[]> {
  return storage.getActiveEvents();
}

export async function checkLowStockProducts(): Promise<any[]> {
  return storage.checkLowInventory();
}
