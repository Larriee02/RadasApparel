# Radas Apparel

Radas Apparel is a React storefront for browsing menswear, requesting fittings, and submitting order requests.

## Run locally

Use Node.js 24 or newer.

```sh
npm ci
npm run dev
```

Vite runs the storefront and the request API on the same origin. To run the production build locally, use `npm run build` followed by `npm start`. The production server defaults to `127.0.0.1:4173` and accepts `HOST` and `PORT` overrides.

Run `npm test` to check request handling, including persisted receipts and duplicate retries.

## Workroom inbox

Concierge inquiries, fittings, and order requests are stored in SQLite. The workroom can read the inbox on the server with `npm run inbox`. It prints one JSON record per request, newest first, with the reference shown to the customer. Orders are requests for follow-up, with payment arranged separately.

The inbox defaults to `var/requests.sqlite`. In production, set `RADAS_INBOX_PATH` to a file on a persistent volume and pass the same path to the inbox command. Keep the database and any exports private because they contain contact details and can contain body measurements. Serve the app over HTTPS on a Node host and build before starting it. A static-only host can serve `dist/` if it also forwards `/api/v1/*` to the request server on the same origin.

## Deploy on Vercel

Import this repository as a Vite project using Node.js 24. Connect a **private** Vercel Blob store to the project so the deployment receives `BLOB_READ_WRITE_TOKEN`. The Vercel API writes request records into the store's `requests/` folder. The workroom can read those records through the authenticated Vercel Storage dashboard. Use a separate store for preview deployments if they will accept test submissions.
