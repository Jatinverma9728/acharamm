# ACHARAM - Ecommerce Platform for Authentic Indian Pickles

## Project Overview
ACHARAM is a complete ecommerce platform for selling authentic Indian pickles (achaar). The platform features a customer-facing storefront and an admin dashboard for managing products, orders, and customers.

## Tech Stack
- **Frontend**: React 18 with TypeScript, TailwindCSS, Wouter (routing)
- **Backend**: Express.js with Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Payments**: Stripe integration (configured via environment variables)
- **UI Components**: Shadcn UI with Radix UI primitives
- **State Management**: TanStack Query (React Query v5)
- **Forms**: React Hook Form with Zod validation

## Project Structure

```
├── client/                      # Frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # Shadcn UI components
│   │   │   ├── navbar.tsx     # Main navigation
│   │   │   ├── footer.tsx     # Footer component
│   │   │   ├── product-card.tsx
│   │   │   └── theme-provider.tsx
│   │   ├── pages/             # Page components
│   │   │   ├── home.tsx       # Landing page with hero
│   │   │   ├── products.tsx   # Product listing with filters
│   │   │   ├── product-detail.tsx
│   │   │   ├── cart.tsx       # Shopping cart
│   │   │   ├── checkout.tsx   # Checkout flow
│   │   │   ├── auth/          # Authentication pages
│   │   │   │   ├── login.tsx
│   │   │   │   └── register.tsx
│   │   │   └── admin/         # Admin dashboard
│   │   │       ├── layout.tsx  # Admin sidebar layout
│   │   │       ├── dashboard.tsx
│   │   │       └── products.tsx
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utilities and helpers
│   │   └── index.css          # Global styles with design tokens
│   └── index.html
├── server/                     # Backend application
│   ├── routes.ts              # API endpoints
│   ├── storage.ts             # Data access layer (IStorage interface)
│   ├── db.ts                  # Database connection
│   └── index.ts               # Express server setup
├── shared/                    # Shared types and schemas
│   └── schema.ts              # Drizzle ORM schema definitions
├── attached_assets/           # Generated images and assets
│   └── generated_images/      # Product and hero images
├── design_guidelines.md       # Design system documentation
└── replit.md                  # This file

```

## Database Schema

### Core Tables
- **users**: Customer and admin accounts with role-based access
- **categories**: Product categories (Mango, Lemon, Garlic, etc.)
- **products**: Product catalog with pricing and inventory
- **productImages**: Product photo gallery (multiple images per product)
- **productVariants**: Size variants (250g, 500g, 1kg) with individual pricing
- **addresses**: Customer shipping addresses
- **carts**: Shopping cart sessions
- **cartItems**: Items in shopping cart
- **orders**: Customer orders with status tracking
- **orderItems**: Line items within orders
- **coupons**: Discount codes and promotions
- **reviews**: Product reviews and ratings
- **auditLogs**: Admin action tracking

### Key Features
- Prices stored in paise (smallest currency unit) for precision
- Role-based access control (CUSTOMER, ADMIN)
- Order status tracking (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- Product variants for different sizes
- Multiple images per product
- Coupon system with usage tracking

## Environment Variables

Required environment variables (see `.env.example`):

```
# Database (auto-configured by Replit)
DATABASE_URL=
PGHOST=
PGPORT=
PGUSER=
PGPASSWORD=
PGDATABASE=

# Stripe Payment Processing
VITE_STRIPE_PUBLIC_KEY=  # Publishable key (pk_...)
STRIPE_SECRET_KEY=        # Secret key (sk_...)

# Session Management
SESSION_SECRET=           # Auto-generated
```

## Design System

The application follows a warm, appetizing design inspired by artisan food ecommerce platforms:

### Colors
- **Primary**: Deep Spice Red-Brown (representing rich pickles)
- **Secondary**: Golden Turmeric (warm accent)
- **Accent**: Fresh Green (herbs/freshness for CTAs)
- **Background**: Warm Off-White (light) / Deep Warm Charcoal (dark)

### Typography
- **Headings**: Playfair Display (elegant serif)
- **Body**: Inter (clean sans-serif)

### Key Design Principles
1. Appetizing visual presentation
2. Warm, trustworthy aesthetic
3. Clean, minimal friction shopping experience
4. Cultural authenticity celebrating Indian pickle traditions
5. Full dark mode support

## Key Features

### Customer Features
- Browse products with category filtering and search
- Product detail pages with image gallery, variants, and reviews
- Shopping cart with quantity management
- Checkout flow with address and payment
- User authentication (login/register)
- Order history and tracking
- Product reviews and ratings

### Admin Features
- Dashboard with sales analytics and statistics
- Product management (CRUD operations)
- Order management with status updates
- Customer management
- Inventory tracking
- Audit log of admin actions

### Technical Features
- Responsive design (mobile-first)
- Dark mode support
- Optimistic UI updates
- Form validation with Zod
- Type-safe API calls
- Session-based authentication
- Stripe payment integration

## API Routes

All API routes are prefixed with `/api`:

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove cart item

### Orders
- `GET /api/orders` - List user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status (admin)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Payments
- `POST /api/create-payment-intent` - Create Stripe payment intent

## Development Workflow

1. **Database Changes**: 
   - Update `shared/schema.ts` with Drizzle ORM models
   - Run `npm run db:push` to sync database

2. **Adding Features**:
   - Define types in `shared/schema.ts`
   - Update storage interface in `server/storage.ts`
   - Add API routes in `server/routes.ts`
   - Create/update React components in `client/src/`
   - Use TanStack Query for data fetching

3. **Running the Application**:
   - Development: `npm run dev`
   - The workflow automatically restarts on file changes

## Image Assets

Product images are stored in `attached_assets/generated_images/`:
- Mango Pickle product photo
- Mixed Vegetable Pickle photo
- Lemon Pickle product photo
- Garlic Pickle product photo
- Family dining hero image
- Indian meal with pickle (lifestyle shot)

## Current Status

### Completed ✅
- **Database Schema**: All tables created with Drizzle ORM (users, products, categories, orders, cart, reviews, coupons, addresses, variants)
- **Design System**: Configured in Tailwind with brand colors, typography (Playfair Display/Inter), and design tokens
- **Frontend Pages**: 
  - Customer: Home (with hero), Products (with filters), Product Detail, Cart, Checkout
  - Admin: Dashboard, Products Management, Orders Management
  - Auth: Login, Register
- **UI Components**: Navbar with cart count, Footer, Product Card, Theme Provider (dark mode)
- **Backend API**: Complete implementation with all CRUD endpoints
  - Products, Categories, Cart, Orders, Checkout
  - Authentication (register, login, logout, current user)
  - Stripe payment integration
  - Role-based access control
- **Database**: PostgreSQL with Drizzle ORM, seeded with initial data
- **Integration**: Frontend connected to backend APIs with loading states and error handling
- **Product Images**: Generated and integrated for all products

### Seed Data
- Admin user: admin@acharam.com / admin123
- Customer user: customer@example.com / customer123
- 4 product categories with products and variants
- Sample reviews and coupon (WELCOME10 for 10% off)

### Testing Required
- Complete user journey testing (browse → cart → checkout → order)
- Admin dashboard functionality
- Authentication flows
- Payment processing with Stripe (requires API keys)

### Notes
- Stripe API keys required: `VITE_STRIPE_PUBLIC_KEY` and `STRIPE_SECRET_KEY`
- All prices stored in paise (1 rupee = 100 paise)
- Session-based authentication implemented
- Cart persists in database for logged-in users

## Notes

- The application uses in-memory storage by default
- Database will be migrated to PostgreSQL in Task 2
- Stripe integration requires API keys to be configured
- All prices are stored in paise (1 rupee = 100 paise)
- Admin routes are at `/admin/*`
- Customer routes are at root level

## Contact & Support

For questions or issues, refer to the design guidelines in `design_guidelines.md` for UI/UX specifications.
