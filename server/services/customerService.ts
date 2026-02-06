// Customer-specific business logic layer
// Handles cart, orders, loyalty, and delivery tracking

import { storage } from "../storage";
import type { Order, CartItem, Product } from "@shared/schema";

type CartItemWithProduct = CartItem & { product?: Product };
type OrderWithItems = Order & { orderItems?: unknown[] };

/**
 * Returns all items in a customer's cart
 */
export async function getCustomerCart(
  userId: string
): Promise<CartItemWithProduct[]> {
  return storage.getCartItems(userId);
}

/**
 * Adds a product to a customer's cart
 */
export async function addProductToCart(
  userId: string,
  productId: string,
  quantity: number
): Promise<CartItem> {
  const product = await storage.getProduct(productId);
  if (!product || !product.isAvailable) {
    throw new Error("Product not available");
  }
  return storage.addToCart({ userId, productId, quantity });
}

/**
 * Updates quantity of a cart item
 */
export async function updateCartItemQuantity(
  itemId: string,
  quantity: number
): Promise<CartItem | undefined> {
  if (quantity < 1) throw new Error("Quantity must be at least 1");
  return storage.updateCartItem(itemId, quantity);
}

/**
 * Removes an item from the cart
 */
export async function removeFromCart(itemId: string): Promise<void> {
  return storage.removeCartItem(itemId);
}

/**
 * Clears the customer's cart entirely
 */
export async function clearCustomerCart(userId: string): Promise<void> {
  return storage.clearCart(userId);
}

/**
 * Creates an order from the current cart
 */
export async function createCustomerOrder(
  userId: string,
  deliveryLocation: string
): Promise<Order> {
  const cartItems = await storage.getCartItems(userId);

  if (!cartItems.length) throw new Error("Cart is empty");

  let totalAmount = 0;

  const orderItems = cartItems.map((item) => {
    const price = item.product?.pricePerGram || 0;
    const subtotal = price * item.quantity;
    totalAmount += subtotal;

    return {
      productId: item.productId,
      productName: item.product?.name || "Unknown Product",
      quantity: item.quantity,
      pricePerGram: price,
      subtotal,
      orderId: "", // Set by storage
    } as unknown;
  });

  const order = await storage.createOrder(
    { userId, deliveryLocation, totalAmount, status: "pending" },
    orderItems
  );

  await storage.clearCart(userId);
  return order;
}

/**
 * Retrieves all orders for a customer
 */
export async function getCustomerOrders(
  userId: string
): Promise<OrderWithItems[]> {
  return storage.getOrders(userId);
}

/**
 * Fetches the customer's loyalty account
 */
export async function getCustomerLoyalty(userId: string): Promise<unknown> {
  return storage.getLoyaltyAccount(userId);
}

/**
 * Tracks the current delivery status of an order
 */
export async function trackOrderDelivery(
  orderId: string
): Promise<{ status: string; currentLocation: unknown; driverName?: string }> {
  const order = await storage.getOrder(orderId);
  if (!order) throw new Error("Order not found");

  if (!order.driverId) {
    return { status: order.status, currentLocation: null };
  }

  const location = await storage.getDriverLocation(order.driverId);
  const driver = await storage.getUser(order.driverId);

  return {
    status: order.status,
    currentLocation: location,
    driverName: driver ? `${driver.firstName} ${driver.lastName}` : undefined,
  };
}
