# Mede-Mede Spot E-Commerce Platform

## Overview
A premium cannabis e-commerce platform for Mede-Mede Spot in Area 25, Malawi. Features role-based user authentication (customer, admin, driver), product catalog, shopping cart, order tracking, real-time delivery tracking, loyalty program, and comprehensive admin dashboard.

## Tech Stack
- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI, TanStack Query, Wouter
- **Backend**: Express.js, Node.js, Passport.js
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **Authentication**: Standalone passport-local with bcryptjs password hashing

## Recent Changes (December 2024)
- Migrated from Replit Auth to standalone passport-local authentication
- Added bcryptjs for secure password hashing (12 salt rounds)
- Created role-based access control (customer, admin, driver)
- Updated all backend routes to use req.user.id instead of req.user.claims.sub
- Updated frontend auth hooks (useAuth.ts) with login/register/logout mutations
- Fixed React hooks ordering issues in App.tsx with role-based route components

## Features

### Customer Features
- Browse premium cannabis products with filtering by strain type
- Search products by name and description
- Add products to cart with quantity management
- Secure checkout with delivery location capture
- Order history and tracking with status updates
- Dark/light theme toggle

### Admin Features
- Product inventory management (add, edit, update stock)
- Mark products as in-stock or out-of-stock
- View and manage all customer orders
- Update order status (pending → processing → out for delivery → completed)
- Dashboard with inventory and order statistics

## Database Schema

### Users
- id (varchar, primary key, UUID)
- email, firstName, lastName, profileImageUrl
- isAdmin (boolean) - for admin access
- createdAt, updatedAt

### Products
- id (varchar, primary key, UUID)
- name, description, strainType (Indica/Sativa/Hybrid)
- pricePerGram (integer, MWK 1000-5000)
- stockQuantity, imageUrl
- isAvailable (boolean)
- createdAt, updatedAt

### Orders
- id (varchar, primary key, UUID)
- userId (foreign key to users)
- status (pending/processing/out_for_delivery/completed)
- deliveryLocation, totalAmount
- createdAt, updatedAt

### Order Items
- id, orderId, productId
- productName, quantity, pricePerGram, subtotal

### Cart Items
- id, userId, productId, quantity
- createdAt

### Sessions
- sid (primary key)
- sess (jsonb), expire

## API Endpoints

### Auth (Standalone)
- POST /api/auth/register - Create new account with email/password
- POST /api/auth/login - Login with email/password
- POST /api/auth/logout - Logout and destroy session
- GET /api/auth/user - Get current authenticated user

### Products
- GET /api/products - List all products
- GET /api/products/:id - Get product details
- POST /api/products - Create product (admin)
- PATCH /api/products/:id - Update product (admin)

### Cart
- GET /api/cart - Get user's cart
- POST /api/cart - Add to cart
- PATCH /api/cart/:id - Update quantity
- DELETE /api/cart/:id - Remove item

### Orders
- POST /api/orders - Create order (checkout)
- GET /api/orders - Get user's orders
- PATCH /api/orders/:id - Update order status (admin)
- GET /api/admin/orders - Get all orders (admin)

## Design System

### Colors
- Primary: Forest green (142 45% 35%) - natural, trustworthy
- Secondary: Terracotta (38 65% 55%) - warm, Area 25 vibe
- Accent: Coral (25 80% 65%) - CTAs and highlights

### Typography
- Headings: Plus Jakarta Sans
- Body: Inter
- Accent/Pricing: Space Grotesk

### Key Design Principles
- Welcoming, comfort-focused atmosphere
- Area 25 local pride and community vibe
- Clean, modern cannabis retail aesthetic
- Mobile-first responsive design
- WCAG AA compliant accessibility

## Recent Changes
- 2025-10-10: Initial MVP implementation with full e-commerce functionality
- Database schema created with Replit Auth integration
- Complete frontend with landing, shop, orders, and admin pages
- Backend API with all CRUD operations for products, cart, and orders
- Admin role system for inventory management

## User Preferences
- N/A (new project)

## Project Architecture
- Schema-first development approach
- Horizontal batching (complete layers across all features)
- PostgreSQL for persistence with Drizzle ORM
- Replit Auth for secure user authentication
- Session-based auth with PostgreSQL session storage
