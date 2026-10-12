# SOLEVA — shoes website

An independent Next.js recreation of the user-provided [Bro’s Shoes reference](https://bros-shoes.vercel.app/), with the new SOLEVA identity and cobalt blue palette. This project was created beside the other three websites.

## Run locally

Requires Node.js 24+ and pnpm.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://127.0.0.1:3003. For a production build:

```sh
pnpm build
pnpm start
```

Stop the development server before using production on the same port. Lint and typecheck scripts are available if requested.

## Pages and behavior

- `/`: film-style rotating shoe edit, oversized editorial headline, brand strip, three category tiles, trending and under-$60 product rails, lookbook, membership section, store principles, sizing table and footer.
- `/dashboard`: 11 pairs, category and condition filters, search, price/newest sorting and product quick views.
- `/auth`: matching sign-in/create-account screens, password visibility and a local demo member identity.
- `/checkout?pair=killshot&size=8`: validates delivery details and reserves available demo stock.
- `/orders`: saved browser-local demo reservations and reset controls.
- `/order-confirmation?reference=…`: saved reservation details.

Native dialogs provide quick views and the full size chart. Theme controls switch light/dark appearance. Film motion has pause, frame selection and reduced-motion support. Mobile navigation uses a disclosure menu with Escape and focus return.

## Demo boundary

No server authentication, payments, delivery or email. The account flow is explicitly a demonstration; use sample credentials. Email, passwords and delivery fields are neither saved nor sent. `soleva.demo.v1` stores only a demo member flag, theme preference and reservations (reference, product ID, size, price and timestamp). `soleva.intent.v1` holds the chosen product and size in session storage before sign-in. Stock is checked again when reserving within this browser. Real commerce requires shared authoritative inventory, authentication and order services.

Matching reference photographs are local Unsplash stock images. Product names and model/condition notes are sample catalog metadata; the images are not certified photographs of those specific models. Sources and font/icon licenses are recorded in ASSETS.md and ASSETS.json.

## Implementation

`src/components/storefront.tsx` contains the reusable page sections and dialogs. `src/lib/catalog.ts` and products.json hold catalog and sizing data. `src/lib/store.ts` isolates browser persistence and reservation operations. `src/app/globals.css` contains typography, cobalt design tokens, layout and responsive rules.

Production build completed successfully, including TypeScript compilation. Browser design inspection covered the homepage and catalog; no automated test suite was added or run for this request.
