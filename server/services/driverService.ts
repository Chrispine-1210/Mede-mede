// Driver-Specific Business Logic
import { storage } from "../storage";
import type { User, Order } from "@shared/schema";

export async function getAssignedDeliveries(driverId: string): Promise<(Order & { orderItems?: any[] })[]> {
  return storage.getDriverOrders(driverId);
}

export async function updateDriverLocationTracking(
  driverId: string,
  latitude: string,
  longitude: string,
  speed: number = 0
): Promise<User | undefined> {
  // Update driver location
  const driver = await storage.updateDriverLocation(driverId, latitude, longitude);
  
  // Update tracking for active delivery
  if (driver) {
    const orders = await storage.getDriverOrders(driverId);
    const activeDelivery = orders.find(o => o.status === "out_for_delivery");
    if (activeDelivery) {
      await storage.updateDeliveryTracking(
        activeDelivery.id,
        driverId,
        latitude,
        longitude,
        speed
      );
    }
  }
  
  return driver;
}

export async function acceptDeliveryOrder(driverId: string, orderId: string): Promise<Order | undefined> {
  const order = await storage.assignOrderToDriver(orderId, driverId);
  if (order) {
    await storage.updateOrderStatus(orderId, "assigned");
  }
  return order;
}

export async function markDeliveryComplete(orderId: string): Promise<Order | undefined> {
  return storage.updateOrderStatus(orderId, "delivered");
}

export async function setDriverAvailable(driverId: string, isAvailable: boolean): Promise<User | undefined> {
  return storage.setDriverAvailability(driverId, isAvailable);
}

export async function getDriverPerformance(driverId: string): Promise<any> {
  return storage.getDriverStats(driverId);
}

export async function getDeliveryHistory(driverId: string): Promise<(Order & { orderItems?: any[] })[]> {
  const orders = await storage.getDriverOrders(driverId);
  return orders.filter(o => o.status === "delivered");
}
