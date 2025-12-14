# Pulito Wash Design Guidelines

## Design Approach
**Reference-Based:** Drawing inspiration from modern service platforms like Airbnb (booking flow), Uber (order tracking), and Stripe (clean pricing tables), adapted to laundry service context with provided blue/aqua gradient theme.

## Core Design Elements

### Typography System
**Font Families:**
- Primary: 'Poppins' (headings, buttons, navigation) - weights: 400, 500, 600, 700
- Secondary: 'Inter' (body text, forms, tables) - weights: 400, 500, 600

**Hierarchy:**
- Hero Headlines: text-5xl to text-6xl, font-bold (Poppins)
- Section Headers: text-3xl to text-4xl, font-semibold (Poppins)
- Subsections: text-xl to text-2xl, font-medium (Poppins)
- Body Text: text-base, font-normal (Inter)
- Small Text: text-sm (Inter)

### Layout System
**Spacing Primitives:** Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistent rhythm (e.g., p-4, gap-8, my-12, py-20)

**Grid Structure:**
- Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Multi-column sections: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
- Dashboard cards: grid-cols-1 md:grid-cols-2 xl:grid-cols-4

### Visual Theme (User-Specified)
**Gradient Treatment:**
Apply blue-to-aqua gradients (from-[#0077FF] via-[#00A8E8] to-[#00C2FF]) on:
- Hero backgrounds (with subtle opacity overlays)
- Primary CTAs and buttons
- Order status progress bars
- Section dividers and accents
- Card hover states (subtle)

**Background Strategy:**
- Primary BG: #F7F9FB (light gray-blue)
- Card BG: white with subtle shadow
- Admin dashboard: slightly darker tint of #F7F9FB

## Component Library

### Navigation
Top navigation with logo left, menu items center/right, user profile/cart right edge. Sticky on scroll with subtle shadow. Mobile: hamburger menu with slide-in drawer.

### Buttons
- Primary: Gradient fill (#0077FF to #00C2FF), rounded-lg, px-6 py-3, font-medium
- Secondary: Outline with gradient border, transparent background
- Accent: #FFC107 for urgent actions (Book Now, Pay Now)

### Cards
- Service Cards: Elevated shadow, rounded-xl, padding-6, hover:scale-105 transition
- Order Cards: Timeline-style with status indicators, icon left, details right
- Pricing Cards: Bordered, clear hierarchy, accent highlights for popular plans

### Forms
- Input fields: rounded-lg, border-2, focus ring with gradient glow
- Spacing: gap-6 between form groups
- Labels: text-sm font-medium mb-2
- Multi-step forms: Progress indicator at top with gradient active states

### Data Display
**Pricing Tables:** 
- Sticky header row
- Alternating row backgrounds (white/light-bg)
- Garment icons in first column
- Price columns right-aligned

**Order Tracking:**
- Horizontal stepper on desktop (8 stages)
- Vertical timeline on mobile
- Active stage: gradient circle with pulse animation
- Completed: gradient checkmark
- Pending: outlined circle

**Admin Dashboard:**
- KPI cards: Large number display, trend indicators (arrows), mini sparkline charts
- Tables: Sortable headers, action buttons right column, status badges with gradient backgrounds
- Charts: Use Chart.js with gradient fills matching theme

## Page-Specific Layouts

### Home/Landing
**Hero Section (80vh):**
Large hero image showing clean, folded laundry or professional service. Overlay gradient (from-[#0077FF]/80 to-transparent). Centered headline + subheadline + primary CTA. Hero buttons: blurred backdrop-blur-sm background.

**Services Grid:** 4-column grid (2 on tablet, 1 mobile) with icon, title, description, "Learn More" link

**How It Works:** 3-step visual process with numbered gradient badges and connecting lines

**Pricing Preview:** Featured pricing with "View Full Pricing" CTA

**Social Proof:** Customer testimonials in 3-column card layout with star ratings

**CTA Section:** Full-width gradient background with centered conversion form (schedule pickup)

### Services Page
Category tabs (Wash & Fold, Wash & Iron, Dry Cleaning, Premium) with gradient active state. Each category: description + image grid + pricing summary table.

### Booking Flow
Multi-step wizard: Service Selection → Items & Quantity → Pickup/Delivery → Payment
- Progress bar at top with gradient active steps
- Left sidebar: Order summary card (sticky)
- Right content area: Current step form
- Item selector: Grid of garment cards with +/- quantity controls

### Order Tracking
Full-width stepper across top, order details card below, delivery agent info (if assigned) in sidebar, estimated timeline, contact support button (accent color).

### Admin Dashboard
Left sidebar navigation (fixed), main content area with KPI cards at top (4-column), followed by charts (2-column: revenue graph left, order status pie right), recent orders table below.

## Images Strategy
**Hero Images:**
- Home: Professional laundry service scene (folded clothes, modern facility)
- Services: Category-specific imagery (ironing, dry cleaning equipment)
- About/Contact: Team or facility photos

**Service Cards:** Icon-based (Heroicons or Font Awesome for wash/iron/cleaning symbols)

**Testimonials:** Customer avatars (use placeholder service like UI Faces initially)

**Admin:** Chart visualizations only, no decorative images

## Accessibility & Polish
- Consistent focus states with gradient ring
- Form validation with inline error messages
- Loading states: skeleton screens for cards, spinner for buttons
- Toast notifications for success/error feedback (top-right, slide-in)
- Smooth transitions: transition-all duration-200 for interactive elements