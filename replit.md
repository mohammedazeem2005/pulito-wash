# Pulito Wash - Premium Laundry Service

## Overview
Pulito Wash is a full-stack laundry service web application with booking, order tracking, and admin management features.

## Tech Stack
- **Frontend**: React 18 with TypeScript, Vite, TailwindCSS v3, Wouter (routing)
- **Backend**: Express.js with TypeScript, MongoDB (Mongoose)
- **UI**: Radix UI components, Lucide icons, shadcn/ui patterns

## Project Structure
```
client/          # React frontend
  src/
    components/  # UI components (Radix-based)
    pages/       # Route pages
    lib/         # Context providers, utilities
    hooks/       # Custom React hooks
server/          # Express backend
  config/        # Database configuration
  models/        # Mongoose models (User, Order, Service, Coupon, Review)
  routes.ts      # API routes (auth, orders, services, admin)
  index.ts       # Server entry point
  vite.ts        # Vite dev middleware
shared/          # Shared types/schemas
```

## Running the Application
- Development: `npm run dev` (starts Express server with Vite middleware on port 5000)
- Build: `npm run build` (builds frontend and compiles TypeScript)
- Production: `npm run start` (runs compiled server)

## Environment Variables
- `MONGO_URI`: MongoDB connection string (optional - app runs without it for demo)
- `PORT`: Server port (defaults to 5000)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### User Features
- `GET /api/services` - List active services
- `GET /api/orders` - Get user orders (or all orders for admin)
- `POST /api/orders` - Create new order
- `GET /api/coupons` - List active coupons
- `POST /api/coupons/validate` - Validate coupon code
- `GET /api/reviews` - List reviews
- `POST /api/reviews` - Submit review

### Admin Features
- `GET /api/admin/customers` - List all customers with stats
- `GET /api/admin/orders` - List all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/coupons` - List all coupons
- `POST /api/admin/coupons` - Create coupon
- `PUT /api/admin/coupons/:id` - Update coupon
- `DELETE /api/admin/coupons/:id` - Delete coupon
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

## Key Features
- User authentication (login/register)
- Service booking with cart functionality
- Order tracking
- Admin dashboard (orders, services, customers, coupons)
- Light/dark theme support

## Recent Changes
- December 2024: Replit environment setup and API completion
  - Configured Vite for development with Express middleware
  - Set up TailwindCSS v3 with custom theme
  - Made MongoDB connection optional for development
  - Added complete admin API endpoints
  - Fixed order creation with proper field handling
