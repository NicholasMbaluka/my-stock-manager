# MSM — My Stock Manager

A simple, professional web application for small businesses to manage their stock.

MSM helps a business owner answer one question: **"How much stock do I have, what came in, what went out, and what have I sold?"**

## Features

- **Dashboard** — total products, current stock, today's sales, and low-stock items at a glance.
- **Products** — add, edit, view, and delete products with SKU, selling price, cost price, and a low-stock threshold.
- **Stock In** — receive stock; the ledger records every increase.
- **Stock Out / Sales** — remove stock or record a sale (quantity × price). Stock decreases automatically and the system prevents selling more than is available.
- **Transactions** — a simple history of all stock movement (`+` in, `−` out).
- **Sales** — sales history with automatic totals.
- **Stock Status** — every product is clearly marked **In stock**, **Low stock**, or **Out of stock**.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router, server components & server actions)
- React 19
- TypeScript (strict)
- [Supabase](https://supabase.com/) for authentication, database, and Row Level Security

## Run locally

1. Install dependencies:

   ```
   npm install
   ```

2. Copy the environment template and fill in your Supabase credentials:

   ```
   copy .env.example .env.local
   ```

3. Set up the database by running `supabase/migrations/001_initial_schema.sql` in your Supabase project's SQL editor.

4. Start the development server:

   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Production build

```
npm run lint
npm run build
npm run start
```

## Environment variables

| Variable                        | Required | Description                                  |
| ------------------------------- | -------- | -------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes      | Your Supabase project URL.                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes      | Your Supabase anonymous (public) key.        |
| `NEXT_PUBLIC_SITE_URL`          | No       | Base URL used for auth email redirects.      |
| `NEXT_PUBLIC_CURRENCY`          | No       | Currency code for formatting (default `KES`).|
| `NEXT_PUBLIC_LOCALE`            | No       | Locale for formatting (default `en-KE`).     |

## Data ownership

Each user only sees their own products, stock, sales, and transactions. Supabase Row Level Security enforces this at the database level.