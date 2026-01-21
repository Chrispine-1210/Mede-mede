// OOP-based Role System with Professional Principles

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  DRIVER = 'driver',
}

export interface RoleConfig {
  id: UserRole;
  label: string;
  description: string;
  icon: string;
  color: string;
  permissions: Permission[];
  features: RoleFeature[];
  dashboardRoute: string;
  setupFields: string[];
}

export interface Permission {
  action: string;
  resource: string;
  description: string;
}

export interface RoleFeature {
  name: string;
  description: string;
  route: string;
}

// Role Definitions following OOP principles
export const RoleConfigurations: Record<UserRole, RoleConfig> = {
  [UserRole.CUSTOMER]: {
    id: UserRole.CUSTOMER,
    label: 'Customer',
    description: 'Browse and purchase premium products',
    icon: 'shopping-bag',
    color: 'primary',
    permissions: [
      { action: 'read', resource: 'products', description: 'View products' },
      { action: 'create', resource: 'orders', description: 'Create orders' },
      { action: 'read', resource: 'own_orders', description: 'View own orders' },
      { action: 'read', resource: 'loyalty', description: 'View loyalty points' },
      { action: 'read', resource: 'events', description: 'View events' },
    ],
    features: [
      { name: 'Shop', description: 'Browse and purchase products', route: '/shop' },
      { name: 'My Orders', description: 'Track your orders', route: '/orders' },
      { name: 'Loyalty', description: 'Earn and redeem points', route: '/loyalty' },
      { name: 'Events', description: 'Discover special events', route: '/events' },
    ],
    dashboardRoute: '/shop',
    setupFields: ['location', 'phone'],
  },
  [UserRole.ADMIN]: {
    id: UserRole.ADMIN,
    label: 'Store Manager',
    description: 'Manage inventory and operations',
    icon: 'chart-bar',
    color: 'secondary',
    permissions: [
      { action: 'create', resource: 'products', description: 'Create products' },
      { action: 'update', resource: 'products', description: 'Update products' },
      { action: 'delete', resource: 'products', description: 'Delete products' },
      { action: 'read', resource: 'analytics', description: 'View analytics' },
      { action: 'create', resource: 'events', description: 'Create events' },
      { action: 'read', resource: 'all_orders', description: 'View all orders' },
    ],
    features: [
      { name: 'Inventory', description: 'Manage product inventory', route: '/admin' },
      { name: 'Analytics', description: 'View sales and trends', route: '/analytics' },
      { name: 'Events', description: 'Manage events and promotions', route: '/events' },
      { name: 'Orders', description: 'Process customer orders', route: '/orders' },
    ],
    dashboardRoute: '/admin',
    setupFields: ['businessName', 'licenseNumber'],
  },
  [UserRole.DRIVER]: {
    id: UserRole.DRIVER,
    label: 'Delivery Partner',
    description: 'Deliver orders and earn',
    icon: 'truck',
    color: 'accent',
    permissions: [
      { action: 'read', resource: 'assigned_orders', description: 'View assigned orders' },
      { action: 'update', resource: 'own_deliveries', description: 'Update delivery status' },
      { action: 'create', resource: 'location_updates', description: 'Send location updates' },
      { action: 'read', resource: 'earnings', description: 'View earnings' },
    ],
    features: [
      { name: 'Deliveries', description: 'Manage active deliveries', route: '/driver' },
      { name: 'Earnings', description: 'Track your earnings', route: '/driver#earnings' },
      { name: 'History', description: 'View delivery history', route: '/driver#history' },
      { name: 'Map', description: 'Real-time delivery tracking', route: '/driver#map' },
    ],
    dashboardRoute: '/driver',
    setupFields: ['vehicleNumber', 'driverLicenseNumber'],
  },
};

// Role Service - OOP Pattern
export class RoleService {
  static getConfig(role: UserRole): RoleConfig {
    return RoleConfigurations[role];
  }

  static hasPermission(role: UserRole, action: string, resource: string): boolean {
    const config = this.getConfig(role);
    return config.permissions.some(p => p.action === action && p.resource === resource);
  }

  static getFeatures(role: UserRole): RoleFeature[] {
    return this.getConfig(role).features;
  }

  static getDashboardRoute(role: UserRole): string {
    return this.getConfig(role).dashboardRoute;
  }

  static getSetupFields(role: UserRole): string[] {
    return this.getConfig(role).setupFields;
  }

  static canSwitchTo(currentRole: UserRole, targetRole: UserRole): boolean {
    // Only allow switching within same company/account context
    // For now, allow for demo purposes
    return true;
  }
}
