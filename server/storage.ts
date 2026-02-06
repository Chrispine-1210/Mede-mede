// storage.ts
import {
  User,
  UpsertUser,
  Product,
  InsertProduct,
  Order,
  InsertOrder,
  OrderItem,
  InsertOrderItem,
  CartItem,
  InsertCartItem,
  Message,
  InsertMessage,
} from "@shared/schema";

/* ------------------------------------------------------------------ */
/* Utilities */
/* ------------------------------------------------------------------ */

const now = () => new Date();

const createIdFactory = (prefix: string) => {
  let seq = 0;
  return () => `${prefix}_${++seq}`;
};

const userId = createIdFactory("usr");
const productId = createIdFactory("prd");
const orderId = createIdFactory("ord");
const orderItemId = createIdFactory("oit");
const cartItemId = createIdFactory("crt");
const messageId = createIdFactory("msg");
const paymentId = createIdFactory("pay");
const eventId = createIdFactory("evt");
const trackingId = createIdFactory("trk");

/* ------------------------------------------------------------------ */
/* Interfaces */
/* ------------------------------------------------------------------ */

export interface IStorage {
  /* Users */
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(data: Partial<User>): Promise<User>;
  upsertUser(data: UpsertUser): Promise<User>;
  updateUserLoginStats(userId: string): Promise<void>;

  /* Products */
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(data: InsertProduct): Promise<Product>;
  updateProduct(id: string, data: Partial<InsertProduct>): Promise<Product | undefined>;

  /* Cart */
  getCartItems(userId: string): Promise<(CartItem & { product?: Product })[]>;
  addToCart(data: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: string): Promise<void>;
  clearCart(userId: string): Promise<void>;

  /* Orders */
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrders(userId: string): Promise<(Order & { orderItems: OrderItem[] })[]>;
  getAllOrders(): Promise<(Order & { orderItems: OrderItem[] })[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  /* Messaging */
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(orderId?: string, role?: string): Promise<Message[]>;
}

/* ------------------------------------------------------------------ */
/* In-Memory Implementation */
/* ------------------------------------------------------------------ */

export class MemoryStorage implements IStorage {
  private users = new Map<string, User>();
  private products = new Map<string, Product>();
  private orders = new Map<string, Order>();
  private orderItems = new Map<string, OrderItem>();
  private cartItems = new Map<string, CartItem>();
  private messages = new Map<string, Message>();

  constructor() {
    this.seedProducts();
  }

  /* ---------------------------- Users ----------------------------- */

  async getUser(id: string) {
    return this.users.get(id);
  }

  async getUserByEmail(email: string) {
    return [...this.users.values()].find(u => u.email === email);
  }

  async createUser(data: Partial<User>): Promise<User> {
    const user: User = {
      id: userId(),
      email: data.email ?? "",
      passwordHash: data.passwordHash ?? null,
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
      profileImageUrl: data.profileImageUrl ?? null,
      role: data.role ?? "customer",
      isActive: true,

      vehicleNumber: null,
      driverLicenseNumber: null,
      currentLatitude: null,
      currentLongitude: null,
      isAvailableForDelivery: false,
      totalDeliveries: 0,
      averageRating: null,

      loyaltyPoints: 0,
      loyaltyTier: "bronze",

      phoneNumber: data.phoneNumber ?? null,
      lastLoginAt: now(),
      loginCount: 1,

      preferences: null,
      createdAt: now(),
      updatedAt: now(),
    };

    this.users.set(user.id, user);
    return user;
  }

  async upsertUser(data: UpsertUser): Promise<User> {
    const existing = data.id ? this.users.get(data.id) : undefined;

    if (existing) {
      const updated: User = {
        ...existing,
        ...data,
        updatedAt: now(),
      };
      this.users.set(updated.id, updated);
      return updated;
    }

    return this.createUser(data);
  }

  async updateUserLoginStats(userIdValue: string) {
    const user = this.users.get(userIdValue);
    if (!user) return;

    user.lastLoginAt = now();
    user.loginCount += 1;
    user.updatedAt = now();
  }

  /* --------------------------- Products --------------------------- */

  async getProducts() {
    return [...this.products.values()];
  }

  async getProduct(id: string) {
    return this.products.get(id);
  }

  async createProduct(data: InsertProduct): Promise<Product> {
    const product: Product = {
      id: productId(),
      ...data,
      createdAt: now(),
      updatedAt: now(),
    };
    this.products.set(product.id, product);
    return product;
  }

  async updateProduct(id: string, data: Partial<InsertProduct>) {
    const existing = this.products.get(id);
    if (!existing) return undefined;

    const updated: Product = {
      ...existing,
      ...data,
      updatedAt: now(),
    };

    this.products.set(id, updated);
    return updated;
  }

  /* ----------------------------- Cart ----------------------------- */

  async getCartItems(userIdValue: string) {
    return [...this.cartItems.values()]
      .filter(i => i.userId === userIdValue)
      .map(i => ({ ...i, product: this.products.get(i.productId) }));
  }

  async addToCart(data: InsertCartItem) {
    const item: CartItem = {
      id: cartItemId(),
      ...data,
      createdAt: now(),
    };
    this.cartItems.set(item.id, item);
    return item;
  }

  async updateCartItem(id: string, quantity: number) {
    const item = this.cartItems.get(id);
    if (!item) return undefined;

    item.quantity = quantity;
    return item;
  }

  async removeCartItem(id: string) {
    this.cartItems.delete(id);
  }

  async clearCart(userIdValue: string) {
    for (const [id, item] of this.cartItems) {
      if (item.userId === userIdValue) this.cartItems.delete(id);
    }
  }

  /* ---------------------------- Orders ---------------------------- */

  async createOrder(order: InsertOrder, items: InsertOrderItem[]) {
    const newOrder: Order = {
      id: orderId(),
      ...order,
      createdAt: now(),
      updatedAt: now(),
      completedAt: null,
    };

    this.orders.set(newOrder.id, newOrder);

    for (const item of items) {
      this.orderItems.set(orderItemId(), {
        id: orderItemId(),
        ...item,
        orderId: newOrder.id,
      });
    }

    return newOrder;
  }

  async getOrders(userIdValue: string) {
    return [...this.orders.values()]
      .filter(o => o.userId === userIdValue)
      .map(o => ({
        ...o,
        orderItems: [...this.orderItems.values()].filter(i => i.orderId === o.id),
      }));
  }

  async getAllOrders() {
    return [...this.orders.values()].map(o => ({
      ...o,
      orderItems: [...this.orderItems.values()].filter(i => i.orderId === o.id),
    }));
  }

  async updateOrderStatus(id: string, status: string) {
    const order = this.orders.get(id);
    if (!order) return undefined;

    order.status = status;
    order.updatedAt = now();
    return order;
  }

  /* --------------------------- Messages --------------------------- */

  async createMessage(data: InsertMessage): Promise<Message> {
    const msg: Message = {
      id: messageId(),
      ...data,
      receiverId: data.receiverId ?? null,
      orderId: data.orderId ?? null,
      role: data.role ?? null,
      isRead: false,
      createdAt: now(),
    };

    this.messages.set(msg.id, msg);
    return msg;
  }

  async getMessages(orderId?: string, role?: string) {
    return [...this.messages.values()]
      .filter(m => (orderId ? m.orderId === orderId : true))
      .filter(m => (role ? m.role === role : true))
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  /* ---------------------------- Seeds ----------------------------- */

  private seedProducts() {
    const products: InsertProduct[] = [
      {
        name: "Premium Indica Flower",
        description: "High-quality Indica strain",
        productType: "flower",
        strainType: "Indica",
        size: null,
        pricePerGram: 3500,
        totalPrice: null,
        stockQuantity: 50,
        imageUrl: null,
        isAvailable: true,
      },
      {
        name: "Golden Sativa Flower",
        description: "Energizing daytime strain",
        productType: "flower",
        strainType: "Sativa",
        size: null,
        pricePerGram: 3000,
        totalPrice: null,
        stockQuantity: 40,
        imageUrl: null,
        isAvailable: true,
      },
    ];

    products.forEach(p => this.createProduct(p));
  }
}

export const storage = new MemoryStorage();
