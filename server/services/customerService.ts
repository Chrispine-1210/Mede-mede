// Customer-Specific Business Logic
import { storage } from "../storage";
import type { Order, CartItem, Product } from "@shared/schema";

export async function getCustomerCart(userId: string): Promise<(CartItem & { product?: Product })[]> {
  return storage.getCartItems(userId);
}

export async function addProductToCart(userId: string, productId: string, quantity: number): Promise<CartItem> {
  const product = await storage.getProduct(productId);
  if (!product || !product.isAvailable) {
    throw new Error("Product not available");
  }
  return storage.addToCart({ userId, productId, quantity });
}

export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<CartItem | undefined> {
  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }
  return storage.updateCartItem(itemId, quantity);
}

export async function removeFromCart(itemId: string): Promise<void> {
  return storage.removeCartItem(itemId);
}

export async function clearCustomerCart(userId: string): Promise<void> {
  return storage.clearCart(userId);
}

export async function createCustomerOrder(userId: string, deliveryLocation: string): Promise<Order> {
  const cartItems = await storage.getCartItems(userId);
  
  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  let totalAmount = 0;
  const orderItems = cartItems.map((item) => {
    const subtotal = (item.product?.pricePerGram || 0) * item.quantity;
    totalAmount += subtotal;
    return {
      productId: item.productId,
      productName: item.product?.name || "Unknown Product",
      quantity: item.quantity,
      pricePerGram: item.product?.pricePerGram || 0,
      subtotal,
      orderId: "", // Will be set by storage
    } as any;
  });

  const order = await storage.createOrder(
    {
      userId,
      deliveryLocation,
      totalAmount,
      status: "pending",
    },
    orderItems
  );

  await storage.clearCart(userId);
  return order;
}

export async function getCustomerOrders(userId: string): Promise<(Order & { orderItems?: any[] })[]> {
  return storage.getOrders(userId);
}

export async function getCustomerLoyalty(userId: string): Promise<any> {
  return storage.getLoyaltyAccount(userId);
}

export async function trackOrderDelivery(orderId: string) {
  const order = await storage.getOrder(orderId);
  if (!order) throw new Error("Order not found");
  
  // Find driver assigned to this order or related to it
  const drivers = await storage.getDrivers();
  const driver = drivers.find(d => d.role === "driver" && d.isActive); // Simplified logic
  
  if (!driver) return { status: order.status, currentLocation: null };
  
  const location = await storage.getDriverLocation(driver.id);
  return {
    status: order.status,
    currentLocation: location,
    driverName: `${driver.firstName} ${driver.lastName}`,
  };
}
