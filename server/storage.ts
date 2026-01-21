// Professional E-Commerce Platform - Storage Layer with Roles Persistence
import type {
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
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(userData: Partial<User>): Promise<User>;
  updateUserLoginStats(userId: string): Promise<void>;
  upsertUser(user: UpsertUser): Promise<User>;
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  getCartItems(userId: string): Promise<(CartItem & { product?: Product })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: string): Promise<void>;
  clearCart(userId: string): Promise<void>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrders(userId: string): Promise<(Order & { orderItems?: OrderItem[] })[]>;
  getAllOrders(): Promise<(Order & { orderItems?: OrderItem[] })[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  getAvailableDrivers(): Promise<User[]>;
  getDriverStats(driverId: string): Promise<any>;
  assignOrderToDriver(orderId: string, driverId: string): Promise<Order | undefined>;
  getDriverOrders(driverId: string): Promise<(Order & { orderItems?: OrderItem[] })[]>;
  updateDriverLocation(driverId: string, lat: string, lng: string): Promise<User | undefined>;
  updateDeliveryTracking(orderId: string, driverId: string, lat: string, lng: string, speed: number): Promise<void>;
  getDeliveryTracking(orderId: string): Promise<any>;
  getDrivers(): Promise<User[]>;
  getDriverLocation(userId: string): Promise<any>;
  setDriverAvailability(driverId: string, isAvailable: boolean): Promise<User | undefined>;
  getLoyaltyAccount(userId: string): Promise<any>;
  addLoyaltyPoints(userId: string, points: number): Promise<any>;
  createPaymentRecord(orderId: string, userId: string, amount: number, stripeIntentId?: string): Promise<any>;
  updatePaymentStatus(paymentId: string, status: string): Promise<any>;
  getActiveEvents(): Promise<any[]>;
  createEvent(data: any): Promise<any>;
  checkLowInventory(): Promise<any[]>;
  updateInventoryAlert(productId: string, currentStock: number): Promise<void>;
  logNotification(data: any): Promise<any>;
  getOrCreateDailySummary(date: string): Promise<any>;
  updateAnalyticsSummary(date: string, data: any): Promise<any>;
  getAnalyticsSummary(days: number): Promise<any[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(orderId?: string, role?: string): Promise<Message[]>;
}

// In-Memory Storage with Role Persistence
export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private products: Map<string, Product> = new Map();
  private orders: Map<string, Order> = new Map();
  private orderItems: Map<string, OrderItem> = new Map();
  private cartItems: Map<string, CartItem> = new Map();
  private deliveryTracking: Map<string, any> = new Map();
  private loyaltyProgram: Map<string, any> = new Map();
  private paymentRecords: Map<string, any> = new Map();
  private events: Map<string, any> = new Map();
  private messages: Map<string, Message> = new Map();
  private notifications: any[] = [];
  private nextId = 0;

  constructor() {
    this.initializeTestData();
  }

  private generateId(): string {
    return `user_${++this.nextId}`;
  }

  private initializeTestData() {
    const flower1: Product = {
      id: 'prod_1',
      name: 'Premium Indica Flower',
      description: 'High-quality Indica strain with deep forest notes',
      productType: 'flower',
      strainType: 'Indica',
      size: null,
      pricePerGram: 3500,
      totalPrice: null,
      stockQuantity: 50,
      imageUrl: null,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const flower2: Product = {
      id: 'prod_2',
      name: 'Golden Sativa Flower',
      description: 'Energizing Sativa strain, perfect for daytime',
      productType: 'flower',
      strainType: 'Sativa',
      size: null,
      pricePerGram: 3000,
      totalPrice: null,
      stockQuantity: 40,
      imageUrl: null,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const preroll1: Product = {
      id: 'prod_3',
      name: 'Mini Pre-Roll Pack',
      description: '500mg pre-rolled package, single stick',
      productType: 'preroll',
      strainType: null,
      size: '500',
      pricePerGram: null,
      totalPrice: 500,
      stockQuantity: 100,
      imageUrl: null,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const preroll2: Product = {
      id: 'prod_4',
      name: 'Standard Pre-Roll Pack',
      description: '1000mg pre-rolled package, 2 sticks',
      productType: 'preroll',
      strainType: null,
      size: '1000',
      pricePerGram: null,
      totalPrice: 1000,
      stockQuantity: 80,
      imageUrl: null,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.products.set(flower1.id, flower1);
    this.products.set(flower2.id, flower2);
    this.products.set(preroll1.id, preroll1);
    this.products.set(preroll2.id, preroll2);

    console.log('✅ In-Memory Storage initialized with test products and role persistence');
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const user: User = {
      id: this.generateId(),
      email: userData.email || '',
      passwordHash: userData.passwordHash || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      role: userData.role || 'customer',
      isActive: true,
      vehicleNumber: userData.vehicleNumber || null,
      driverLicenseNumber: userData.driverLicenseNumber || null,
      currentLatitude: null,
      currentLongitude: null,
      isAvailableForDelivery: false,
      totalDeliveries: 0,
      averageRating: null,
      loyaltyPoints: 0,
      loyaltyTier: 'bronze',
      phoneNumber: userData.phoneNumber || null,
      lastLoginAt: new Date(),
      loginCount: 1,
      preferences: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    console.log(`✅ User created with role: ${user.role}`);
    return user;
  }

  async updateUserLoginStats(userId: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.lastLoginAt = new Date();
      user.loginCount = (user.loginCount || 0) + 1;
      this.users.set(userId, user);
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      id: userData.id || this.generateId(),
      email: userData.email || '',
      passwordHash: userData.passwordHash || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      role: userData.role || 'customer',
      isActive: userData.isActive !== false,
      vehicleNumber: userData.vehicleNumber || null,
      driverLicenseNumber: userData.driverLicenseNumber || null,
      currentLatitude: userData.currentLatitude || null,
      currentLongitude: userData.currentLongitude || null,
      isAvailableForDelivery: userData.isAvailableForDelivery || false,
      totalDeliveries: userData.totalDeliveries || 0,
      averageRating: userData.averageRating || null,
      loyaltyPoints: userData.loyaltyPoints || 0,
      loyaltyTier: userData.loyaltyTier || 'bronze',
      phoneNumber: userData.phoneNumber || null,
      lastLoginAt: null,
      loginCount: 0,
      preferences: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = {
      id: this.generateId(),
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Product;
    this.products.set(newProduct.id, newProduct);
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...product, updatedAt: new Date() };
    this.products.set(id, updated);
    return updated;
  }

  async getCartItems(userId: string): Promise<(CartItem & { product?: Product })[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.userId === userId);
    return items.map(item => ({
      ...item,
      product: this.products.get(item.productId),
    }));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const cartItem: CartItem = {
      id: this.generateId(),
      ...item,
      createdAt: new Date(),
    };
    this.cartItems.set(cartItem.id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    item.quantity = quantity;
    this.cartItems.set(id, item);
    return item;
  }

  async removeCartItem(id: string): Promise<void> {
    this.cartItems.delete(id);
  }

  async clearCart(userId: string): Promise<void> {
    Array.from(this.cartItems.entries()).forEach(([key, item]) => {
      if (item.userId === userId) {
        this.cartItems.delete(key);
      }
    });
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const newOrder: Order = {
      id: this.generateId(),
      ...order,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null,
    } as Order;
    this.orders.set(newOrder.id, newOrder);
    items.forEach(item => {
      const orderItem: OrderItem = {
        id: this.generateId(),
        ...item,
        orderId: newOrder.id,
      };
      this.orderItems.set(orderItem.id, orderItem);
    });
    return newOrder;
  }

  async getOrders(userId: string): Promise<(Order & { orderItems?: OrderItem[] })[]> {
    const userOrders = Array.from(this.orders.values()).filter(o => o.userId === userId);
    return userOrders.map(order => ({
      ...order,
      orderItems: Array.from(this.orderItems.values()).filter(item => item.orderId === order.id),
    }));
  }

  async getAllOrders(): Promise<(Order & { orderItems?: OrderItem[] })[]> {
    return Array.from(this.orders.values()).map(order => ({
      ...order,
      orderItems: Array.from(this.orderItems.values()).filter(item => item.orderId === order.id),
    }));
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    order.status = status;
    order.updatedAt = new Date();
    this.orders.set(id, order);
    return order;
  }

  async getAvailableDrivers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(u => u.role === 'driver' && u.isAvailableForDelivery);
  }

  async getDriverStats(driverId: string): Promise<any> {
    const driver = this.users.get(driverId);
    return {
      totalDeliveries: driver?.totalDeliveries || 0,
      averageRating: driver?.averageRating || 'N/A',
      isAvailable: driver?.isAvailableForDelivery || false,
    };
  }

  async assignOrderToDriver(orderId: string, driverId: string): Promise<Order | undefined> {
    const order = this.orders.get(orderId);
    if (!order) return undefined;
    order.driverId = driverId;
    order.status = 'assigned';
    this.orders.set(orderId, order);
    return order;
  }

  async getDriverOrders(driverId: string): Promise<(Order & { orderItems?: OrderItem[] })[]> {
    const driverOrders = Array.from(this.orders.values()).filter(o => o.driverId === driverId);
    return driverOrders.map(order => ({
      ...order,
      orderItems: Array.from(this.orderItems.values()).filter(item => item.orderId === order.id),
    }));
  }

  async updateDriverLocation(driverId: string, lat: string, lng: string): Promise<User | undefined> {
    const driver = this.users.get(driverId);
    if (!driver) return undefined;
    driver.currentLatitude = lat;
    driver.currentLongitude = lng;
    this.users.set(driverId, driver);
    return driver;
  }

  async updateDeliveryTracking(orderId: string, driverId: string, lat: string, lng: string, speed: number): Promise<void> {
    this.deliveryTracking.set(this.generateId(), { orderId, driverId, latitude: lat, longitude: lng, speed, timestamp: new Date() });
  }

  async getDeliveryTracking(orderId: string): Promise<any> {
    const latest = Array.from(this.deliveryTracking.values())
      .filter(t => t.orderId === orderId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    return latest || null;
  }

  async getDrivers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(u => u.role === "driver");
  }

  async getDriverLocation(userId: string): Promise<any> {
    const driver = this.users.get(userId);
    return {
      latitude: driver?.currentLatitude || "-13.9626",
      longitude: driver?.currentLongitude || "33.7741",
      speed: 0
    };
  }

  async setDriverAvailability(driverId: string, isAvailable: boolean): Promise<User | undefined> {
    const driver = this.users.get(driverId);
    if (!driver) return undefined;
    driver.isAvailableForDelivery = isAvailable;
    this.users.set(driverId, driver);
    return driver;
  }

  async getLoyaltyAccount(userId: string): Promise<any> {
    return this.loyaltyProgram.get(userId) || { userId, points: 0, totalSpent: 0, tier: 'bronze' };
  }

  async addLoyaltyPoints(userId: string, points: number): Promise<any> {
    const account = this.loyaltyProgram.get(userId) || { userId, points: 0, totalSpent: 0, tier: 'bronze' };
    account.points += points;
    this.loyaltyProgram.set(userId, account);
    return account;
  }

  async createPaymentRecord(orderId: string, userId: string, amount: number, stripeIntentId?: string): Promise<any> {
    const record = { id: this.generateId(), orderId, userId, amount, stripePaymentIntentId: stripeIntentId, status: 'pending' };
    this.paymentRecords.set(record.id, record);
    return record;
  }

  async updatePaymentStatus(paymentId: string, status: string): Promise<any> {
    const record = this.paymentRecords.get(paymentId);
    if (record) record.status = status;
    return record;
  }

  async getActiveEvents(): Promise<any[]> {
    return Array.from(this.events.values()).filter(e => e.isActive);
  }

  async createEvent(data: any): Promise<any> {
    const event = { id: this.generateId(), ...data };
    this.events.set(event.id, event);
    return event;
  }

  async checkLowInventory(): Promise<any[]> {
    return [];
  }

  async updateInventoryAlert(productId: string, currentStock: number): Promise<void> {}

  async logNotification(data: any): Promise<any> {
    this.notifications.push(data);
    return data;
  }

  async getOrCreateDailySummary(date: string): Promise<any> {
    return { date, totalOrders: 0, totalRevenue: 0 };
  }

  async updateAnalyticsSummary(date: string, data: any): Promise<any> {
    return { date, ...data };
  }

  async getAnalyticsSummary(days: number = 30): Promise<any[]> {
    return [];
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const newMessage: Message = {
      id: this.generateId(),
      ...message,
      receiverId: message.receiverId || null,
      orderId: message.orderId || null,
      role: message.role || null,
      isRead: false,
      createdAt: new Date(),
    };
    this.messages.set(newMessage.id, newMessage);
    return newMessage;
  }

  async getMessages(orderId?: string, role?: string): Promise<Message[]> {
    let all = Array.from(this.messages.values());
    if (orderId) {
      all = all.filter(m => m.orderId === orderId);
    }
    if (role) {
      all = all.filter(m => m.role === role);
    }
    return all.sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  }
}

export const storage = new MemoryStorage();
