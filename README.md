# Seoul Market — starter project

This is a starter template, not a finished production store. It includes a responsive product catalog, search/category filters, a client-side cart, a checkout form, and a server route that can save orders to Supabase.

## 1. Install Node.js
Install a current Node.js LTS release from https://nodejs.org/.

## 2. Run the site
Unzip the project, open a terminal in this folder, then run:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## 3. Configure Supabase (to save orders)
1. Create a project at https://supabase.com/.
2. In SQL Editor, run `supabase-schema.sql`.
3. Copy `.env.example` to `.env.local`.
4. Fill in `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from your Supabase project settings.
5. Restart the dev server after changing environment variables.

The service-role key is a secret: only use it on the server, never commit `.env.local`, never expose it in client code, and never name it `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`.

## 4. Before accepting real orders
- Replace demo product names, descriptions, prices, and emoji with your actual catalog.
- Store products and prices in the database. The current starter has hard-coded demo products.
- Calculate prices on the server from trusted product records; never trust a browser-submitted total.
- Add rate limiting, spam protection, privacy policy, terms, return/refund rules, tax and shipping settings.
- Confirm business registration, import/food/cosmetics rules, cross-border shipping and customs for both markets.

## 5. Online payments
Payment is intentionally NOT enabled in this starter. Do not tell customers payment succeeded and do not ship goods based only on a browser redirect.
1. Choose a provider and merchant account for each market.
2. Complete their business verification and obtain credentials.
3. Add a server-side payment-session endpoint using the provider's current official SDK/API.
4. Verify payment status on your server using the provider's API/webhook and match amount, currency, and order ID.
5. Only then change an order's status to `paid`.

Potential providers to investigate: PortOne for supported Korean payment methods; for Uzbekistan, investigate local providers such as Click or Payme and confirm merchant eligibility and current API terms. One provider may not cover both markets. Official starting points:
- PortOne Korea: https://docs.portone.cloud/docs/portone-korea
- Supabase + Next.js: https://supabase.com/docs/guides/auth/quickstarts/nextjs
- Next.js deployment: https://nextjs.org/docs/app/getting-started/deploying
- Vercel Next.js: https://vercel.com/docs/frameworks/full-stack/nextjs

## 6. Deploy
Push the project to a private GitHub repository, import it into Vercel, add the environment variables in project settings, then deploy. Test in a staging environment before public launch.
