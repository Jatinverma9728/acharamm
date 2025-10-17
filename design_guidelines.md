# ACHARAM Pickle Brand - Design Guidelines

## Design Approach: E-commerce Reference-Based

Drawing inspiration from artisan food e-commerce platforms (Thrive Market, Diaspora Co.) and premium product showcases (Shopify stores, Etsy), combined with food photography best practices.

**Core Design Principles:**
- Appetizing visual presentation that showcases product quality
- Warm, trustworthy aesthetic reflecting artisan craftsmanship
- Clean, intuitive shopping experience with minimal friction
- Cultural authenticity celebrating Indian pickle traditions

---

## Color Palette

### Light Mode
- **Primary Brand**: 25 75% 45% (Deep Spice Red-Brown - representing rich pickles)
- **Secondary**: 38 85% 50% (Golden Turmeric - warm accent)
- **Neutral Base**: 30 8% 96% (Warm Off-White background)
- **Text Primary**: 25 15% 20% (Deep Brown)
- **Text Secondary**: 25 10% 45% (Medium Brown)
- **Success/CTA**: 145 65% 42% (Fresh Green - representing herbs/freshness)

### Dark Mode
- **Primary Brand**: 25 65% 55% (Lighter spice tone)
- **Secondary**: 38 75% 60% (Muted turmeric)
- **Background**: 25 12% 12% (Deep warm charcoal)
- **Surface**: 25 10% 18% (Elevated surface)
- **Text Primary**: 30 5% 92% (Warm white)
- **Text Secondary**: 30 5% 70% (Muted warm gray)

---

## Typography

**Font Families:**
- **Display/Headings**: 'Playfair Display' (Google Fonts) - elegant serif for brand personality
- **Body/UI**: 'Inter' (Google Fonts) - clean, readable sans-serif

**Scale:**
- Hero Headline: text-5xl md:text-7xl, font-bold
- Section Headings: text-3xl md:text-4xl, font-semibold
- Product Titles: text-xl md:text-2xl, font-medium
- Body Text: text-base, font-normal
- Small/Meta: text-sm, font-normal

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 8, 12, 16, 20, 24, 32
- Micro spacing: p-2, gap-2 (8px)
- Small spacing: p-4, m-4 (16px)
- Medium spacing: p-8, gap-8 (32px)
- Large spacing: py-16, py-20 (section padding)
- XL spacing: py-24, py-32 (hero sections)

**Grid Systems:**
- Product Grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Feature Sections: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Container Max-Width: max-w-7xl mx-auto px-4 md:px-8

---

## Component Library

### Navigation
- **Header**: Sticky top navigation with transparent-to-solid scroll effect
- Logo left, centered category menu, cart/account icons right
- Mobile: Hamburger menu with slide-in drawer
- Cart icon with badge count overlay

### Product Cards
- Clean white/elevated cards with subtle shadow (shadow-md hover:shadow-xl)
- 4:3 aspect ratio product images with rounded-lg corners
- Product name, price prominently displayed
- Quick add-to-cart button on hover
- Rating stars and review count

### Hero Section
- Full-width hero with high-quality lifestyle photography showing pickles in use
- Large heading with brand story ("Authentic Indian Pickles, Made with Love")
- Primary CTA: "Shop Pickles" (bg-primary with white text)
- Secondary CTA: "Our Story" (outline variant with blurred background when over image)
- Height: min-h-[70vh] md:min-h-[85vh]

### Shopping Cart
- Slide-out drawer from right side
- Line items with thumbnail, name, quantity stepper, remove option
- Subtotal calculation, prominent checkout button
- Empty state with "Continue Shopping" CTA

### Product Detail Page
- 2-column layout: Image gallery left (60%), Details right (40%)
- Sticky add-to-cart section on scroll
- Tabs for Description, Ingredients, Reviews
- Related products carousel at bottom

### Admin Dashboard
- Sidebar navigation with sections: Products, Orders, Customers, Analytics
- Data tables with search, filter, sort capabilities
- Form inputs with validation states
- Action buttons: Primary (bg-primary), Secondary (outline), Danger (red)

### Forms & Inputs
- Floating labels for text inputs
- Rounded-lg borders with focus ring (ring-2 ring-primary)
- Error states in red with helper text below
- Select dropdowns with custom styling matching brand

---

## Images Strategy

**Product Photography:**
- Clean, well-lit shots on neutral backgrounds
- Lifestyle images showing pickles with Indian meals
- Ingredient close-ups highlighting quality

**Key Image Placements:**
1. **Hero Section**: Large lifestyle image (family enjoying meal with ACHARAM pickles), 1920x1080px minimum
2. **Category Cards**: Square format images, 600x600px
3. **Product Pages**: Multiple angles, 800x800px minimum
4. **About/Story Section**: Kitchen/production photos showing artisan process
5. **Testimonials**: Customer photos (circular avatars, 120x120px)

---

## Unique Design Elements

**Authentication Pages:**
- Split-screen design: Left side with brand imagery/messaging, Right side with form
- Social proof elements (customer count, review scores)

**Checkout Flow:**
- Step indicator (Cart → Shipping → Payment → Confirmation)
- Order summary sticky on right (desktop)
- Trust badges near payment section

**Footer:**
- 4-column layout: About ACHARAM, Quick Links, Customer Service, Newsletter Signup
- Social media icons, payment method logos
- Regional language selector (English/Hindi toggle)

**Animations:** Minimal and purposeful
- Smooth page transitions (duration-200)
- Product card hover lift effect (transform scale-105)
- Cart slide-in animation (translate-x)
- Skeleton loading states for async content

---

## Accessibility & Quality
- WCAG AA contrast ratios maintained
- Focus indicators on all interactive elements
- Alt text for all product images
- Keyboard navigation fully supported
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)