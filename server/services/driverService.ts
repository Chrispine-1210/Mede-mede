// Driver-specific business logic layer
// No HTTP concerns. No persistence logic. Pure orchestration.

import { storage } from "../storage";
import type { User, Order } from "@shared/schema";

/**
 * Canonical order statuses used by driver workflows
 * Prevents string drift across the codebase.
 */
const DRIVER_ACTIVE_STATUS = "out_for_delivery";
const DRIVER_ASSIGNED_STATUS = "assigned";
const DRIVER_COMPLETED_STATUS = "delivered";

type OrderWithItems = Order & { orderItems?: unknown[] };

/**
 * Returns all orders currently assigned to a driver.
 */
export async function getAssignedDeliveries(
  driverId: string
): Promise<OrderWithItems[]> {
  return storage.getDriverOrders(driverId);
}

/**
 * Updates driver GPS position and (if applicable) delivery tracking
 * for the currently active delivery.
 */
export async function updateDriverLocationTracking(
  driverId: string,
  latitude: string,
  longitude: string,
  speed = 0
): Promise<User | undefined> {
  const driver = await storage.updateDriverLocation(
    driverId,
    latitude,
    longitude
  );

  if (!driver) return undefined;

  const orders = await storage.getDriverOrders(driverId);
  const activeOrder = orders.find(
    (order) => order.status === DRIVER_ACTIVE_STATUS
  );

  if (!activeOrder) return driver;

  await storage.updateDeliveryTracking(
    activeOrder.id,
    driverId,
    latitude,
    longitude,
    speed
  );

  return driver;
}

/**
 * Driver accepts a delivery assignment.
 * Assignment and status update are intentionally explicit.
 */
export async function acceptDeliveryOrder(
  driverId: string,
  orderId: string
): Promise<Order | undefined> {
  const order = await storage.assignOrderToDriver(orderId, driverId);
  if (!order) return undefined;

  return storage.updateOrderStatus(orderId, DRIVER_ASSIGNED_STATUS);
}

/**
 * Marks a delivery as completed.
 */
export async function markDeliveryComplete(
  orderId: string
): Promise<Order | undefined> {
  return storage.updateOrderStatus(orderId, DRIVER_COMPLETED_STATUS);
}

/**
 * Toggles driver availability for new assignments.
 */
export async function setDriverAvailable(
  driverId: string,
  isAvailable: boolean
): Promise<User | undefined> {
  return storage.setDriverAvailability(driverId, isAvailable);
}

/**
 * Aggregated performance metrics for a driver.
 * Returned as-is from storage to avoid leaking business assumptions.
 */
export async function getDriverPerformance(
  driverId: string
): Promise<unknown> {
  return storage.getDriverStats(driverId);
}

/**
 * Historical list of completed deliveries for a driver.
 */
export async function getDeliveryHistory(
  driverId: string
): Promise<OrderWithItems[]> {
  const orders = await storage.getDriverOrders(driverId);
  return orders.filter(
    (order) => order.status === DRIVER_COMPLETED_STATUS
  );
}
