# Mede-Mede Spot E-Commerce Design Guidelines

## Design Approach: Reference-Based with Cannabis Retail Innovation

**Primary Inspiration**: Blend of modern dispensary UIs (like Dutchie, Leafly) + Shopify's clean e-commerce + Airbnb's welcoming atmosphere

**Core Philosophy**: Create a premium, trustworthy cannabis retail experience that feels like a comfortable neighborhood spot rather than a clinical dispensary.

---

## Color Palette

### Light Mode
- **Primary Brand**: 142 45% 35% (Deep forest green - natural, trustworthy)
- **Primary Hover**: 142 45% 28%
- **Secondary**: 38 65% 55% (Warm terracotta - comfort, Area 25 warmth)
- **Accent**: 25 80% 65% (Soft coral - CTAs, special offers)
- **Background**: 40 20% 97% (Warm off-white)
- **Surface**: 0 0% 100% (Pure white cards)
- **Text Primary**: 142 20% 15%
- **Text Secondary**: 142 15% 45%

### Dark Mode
- **Primary Brand**: 142 40% 65% (Sage green - softer for dark)
- **Primary Hover**: 142 40% 58%
- **Secondary**: 38 50% 45%
- **Accent**: 25 70% 60%
- **Background**: 142 15% 12%
- **Surface**: 142 12% 16%
- **Text Primary**: 40 20% 95%
- **Text Secondary**: 40 15% 70%

---

## Typography

**Font Stack**: 
- **Headers**: 'Plus Jakarta Sans' (via Google Fonts) - Modern, friendly, professional
- **Body**: 'Inter' (via Google Fonts) - Excellent readability for product info
- **Accent/Special**: 'Space Grotesk' for pricing, stats - distinctive character

**Scale**:
- Hero Headline: text-5xl md:text-6xl lg:text-7xl, font-bold
- Section Headers: text-3xl md:text-4xl, font-semibold
- Product Names: text-xl md:text-2xl, font-medium
- Body Text: text-base, leading-relaxed
- Small Print/Labels: text-sm, font-medium

---

## Layout System

**Spacing Units**: Consistent use of 4, 6, 8, 12, 16, 24 (in Tailwind units)
- Component padding: p-4 to p-8
- Section spacing: py-16 md:py-24
- Card gaps: gap-6 md:gap-8
- Container: max-w-7xl mx-auto px-4

**Grid Patterns**:
- Product Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Feature Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Admin Dashboard: 2-column split (sidebar + main content)

---

## Component Library

### Navigation
- Sticky header with blurred backdrop (backdrop-blur-md bg-background/80)
- Logo left, primary nav center, cart + user right
- Mobile: Slide-in menu with category navigation
- Cart icon with badge showing item count

### Product Cards
- Image top (aspect-ratio 4/3), rounded-xl overflow-hidden
- Product name + strain type badge
- Price prominent (text-2xl, accent color)
- In-stock indicator (green dot + text) or "Out of Stock" overlay
- Quick add button + details link
- Hover: Subtle lift (shadow-lg transform scale-[1.02])

### Hero Section
- Split layout: 60% compelling imagery (cannabis products, cozy interior), 40% content
- Headline: "Your Trusted Spot in Area 25"
- Subheadline: Brief about comfort, quality, community
- Dual CTAs: "Shop Now" (primary) + "Explore Events" (outline with blur backdrop)
- Trust indicators below: "Premium Quality • Safe & Secure • Fast Delivery"

### Shopping Cart
- Slide-over panel from right
- Product thumbnails with quantity steppers
- Real-time total calculation in MWK
- Location capture section before checkout
- Progress indicator: Cart → Location → Checkout

### Admin Dashboard
- Left sidebar: Product Management, Inventory, Orders, Analytics
- Main area: Data tables with inline editing
- Quick actions: Mark in/out of stock toggle switches
- Inventory status charts (donut chart for stock levels)
- Recent orders feed with status badges

### Order Tracking
- Timeline visualization (vertical stepper)
- Status: Pending → Processing → Out for Delivery → Completed
- Real-time updates with animations on status change
- Map integration showing delivery location (placeholder for now)

### Authentication
- Modal-based login/signup (not full page)
- Replit Auth integration with social options
- Admin has separate secure login with role indicators

---

## Images

### Hero Section Image
Large, high-quality photograph (60% of hero) showing:
- Well-lit, inviting interior of Mede-Mede Spot
- Comfortable seating area with plants
- Professional product display in background
- Warm, natural lighting
Position: Right side of hero, subtle parallax scroll

### Product Images
- Clean, white/neutral background product shots
- Consistent lighting and angle across all items
- Show texture and quality of cannabis
- Secondary images: Close-ups, packaging

### About/Story Section
- Community-focused imagery: Area 25 location, gathering spaces
- Sports viewing area, event hosting setup
- Team members (if applicable)

### Category Headers
- Subtle, atmospheric background images for each strain category
- Overlaid with semi-transparent gradient for text legibility

---

## Interaction Patterns

**Micro-interactions** (minimal, purposeful):
- Add to cart: Subtle bounce animation + cart badge pulse
- Product card hover: Smooth lift with shadow
- Stock status toggle: Color transition (green ↔ red)
- Order status change: Smooth timeline progression

**Navigation**:
- Smooth scroll to sections
- Breadcrumbs for deep product navigation
- Filter sidebar toggles on mobile

**Feedback**:
- Toast notifications (top-right): Success (green), Error (red), Info (blue)
- Loading states: Skeleton screens for product grids
- Form validation: Inline with helpful messaging

---

## Unique Brand Elements

**"Comfort Spot" Features**:
- "What's Happening" section: Upcoming sports events, special occasions
- Community vibe: User testimonials with warm, personal touch
- Local pride: Subtle Area 25 references (map pin, local imagery)
- Educational content: Strain information, usage tips (responsible consumption)

**Trust Builders**:
- Clear pricing (no hidden fees)
- Product authenticity badges
- Secure checkout indicators
- Delivery time estimates
- Customer support accessibility (WhatsApp, phone prominent)

**Mobile-First Considerations**:
- Thumb-friendly navigation (bottom tab bar for key actions)
- Quick reorder from order history
- One-tap checkout for returning customers
- Simplified product filters (drawer-based)

---

## Accessibility & Polish

- WCAG AA compliant contrast ratios
- Focus indicators on all interactive elements
- Keyboard navigation support
- Screen reader friendly labels
- Consistent dark mode throughout (including form inputs)
- Responsive images with proper loading states

This design creates a professional, welcoming cannabis retail experience that balances modern e-commerce functionality with the comfort and community feel of Mede-Mede Spot.