# 🛒 বাজার দর — BazarDor

প্রয়োজনীয় পণ্যের দাম এক নজরে।

BazarDor is a responsive market-price application for viewing everyday
product prices in Bangladesh. Users can browse categories, compare price
changes, and view market-level prices after signing in.

## Features

- Responsive home page with a banner and product grids.
- Top six price risers and fallers.
- Bengali price formatting and price-change badges.
- Category filtering with default, ascending, and descending price sorting.
- Protected product details with minimum, maximum, and average prices.
- Market-level price comparison.
- Email/password, Google, and GitHub authentication with Better Auth.
- Profile page with a separate name-update form.
- Toast notifications for authentication and protected-route redirects.
- Loading skeletons, retry controls, and a friendly 404 page.
- Product API fallback endpoints and temporary server caching.

## Technologies

| Technology | Purpose |
|---|---|
| Next.js App Router | Pages, routing, and API handlers |
| React | Interactive user interface |
| TypeScript | Type checking |
| Tailwind CSS | Styling and responsive layouts |
| Better Auth | Authentication and session management |
| Neon PostgreSQL | Authentication database |
| node-postgres | PostgreSQL connection pool |
| react-hot-toast | Notifications |

## Run Locally

Install dependencies:

```bash
npm install
```

Create `.env.local` in the project root:

```env
DATABASE_URL="your-neon-postgresql-connection-string"
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-generated-secret"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

Create the authentication tables for a new database:

```bash
npx auth@latest migrate --config ./lib/auth.ts
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000.

## OAuth Configuration

Local callback URLs:

- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

For deployment, configure callback URLs using the live domain and set
`BETTER_AUTH_URL` to the live website URL.

Keep database credentials and authentication secrets out of Git.

## Available Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Product API

Primary API:

https://openapi.programming-hero.com/api/bazardor

Fallback APIs:

- https://api.api-store.workers.dev/api/bazardor
- https://api.abcz.workers.dev/api/bazardor

The application's `/api/products` handler retrieves product data and
tries fallback endpoints when necessary.

## Main Routes

| Route | Description |
|---|---|
| `/` | Home and product lists |
| `/category/[slug]` | Category products and sorting |
| `/product/[slug]` | Protected product details |
| `/signin` | Sign in |
| `/signup` | Registration |
| `/profile` | Protected user profile |
| `/profile/update` | Update profile name |

## Project Links

- Live website: To be added after deployment.
- GitHub repository: To be added after creating the repository.

## Assignment

Programming Hero — B14 Assignment 07: Bazar Dor.