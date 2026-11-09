# MenuVerse — Maison Noir Demo

A luxury restaurant digital dining frontend built with React, Vite, and Framer Motion.

## Included in this build

- Luxury Maison Noir customer-facing restaurant website
- Responsive menu with category filters and search
- Product detail modal with variants and paid add-ons
- Cart drawer with quantity controls
- Demo checkout flow
- Reservation request demo
- Restaurant admin overview
- Kitchen display interface
- Shared in-browser demo order state between customer, admin, and kitchen views

## Important demo limitations

This is **frontend MVP / interactive prototype**, not the production SaaS backend.

- Orders exist only in React state and are lost on refresh.
- No PostgreSQL, authentication, API, Socket.IO, payment gateway, email, WhatsApp, or real booking service is connected.
- Checkout and reservation confirmations are explicitly marked as demo actions.
- Dashboard analytics are derived from orders created during the current browser session.
- Restaurant and menu data are sample content.

Do not use this build to accept real customer payments or orders.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Next development milestones

1. Add Express + TypeScript API.
2. Add PostgreSQL + Prisma schema and migrations.
3. Add authentication, roles, and tenant isolation.
4. Persist orders and reservations in the database.
5. Add Socket.IO synchronization across customer, admin, and kitchen applications.
6. Add secure QR table tokens and server-side price calculation.
7. Add payment and notification provider adapters.
8. Add automated tests and production deployment configuration.

## Branding

- Product: MenuVerse
- Demo restaurant: Maison Noir
- Product owner: Pixelora
- Palette: charcoal, warm black, champagne gold, ivory
- Display typeface: Playfair Display
- UI typeface: DM Sans
