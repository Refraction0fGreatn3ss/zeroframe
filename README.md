# ZeroFlash Enterprise

Security operations console for network detection and response (NDR): incidents, alerts, asset identity, threat hunting, OT/SCADA monitoring, governed response, evidence and sensor fleet management.

The frontend is a React 19 + Vite + Tailwind single-page app. The `server/` directory is a local Express + WebSocket API that serves seeded tenant data for development.

## Getting started

Requires Node.js 22 or later.

```bash
npm install
npm run dev        # API + Vite dev server on http://localhost:3000
```

In development, the server seeds an operator session, so the console opens already signed in.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the API server with Vite middleware |
| `npm run build` | Build the client (`dist/`) and bundle the server (`dist-server/`) |
| `npm start` | Run the production build |
| `npm run typecheck` | Type-check with `strict` mode |
| `npm run lint` | Lint and format-check with Biome |
| `npm run format` | Apply Biome formatting and safe fixes |
| `npm test` | Run the test suites in `tests/` |

## Project layout

```
server/
  main.ts           HTTP server entry: static/Vite hosting, API mount, WebSocket
  api.ts            Express app: security middleware chain + routes
  config.ts         Constants and environment
  routes/           One router per API area; handlers only parse and respond
  services/         Business logic called by routes
  middleware/       Authentication and tenant scoping
  security/         Headers, rate limiting, WAF, CSRF, error masking
  realtime/         WebSocket server, client registry, event broadcast
  stores/           In-memory session and tenant state
  data/             Seed data per tenant
  types/            Shared server types

src/
  pages/<page>/     One folder per page: Page.tsx, components/, hooks/, *.data.ts, *.utils.ts, *.types.ts
  components/       Layout shell, page primitives and shared widgets
  stores/           Domain stores built on lib/create-store
  services/         Typed API and realtime clients
  hooks/            Reusable React hooks
  lib/              Pure helpers
  data/             Static seed data used by stores
  config/           Navigation and runtime configuration
  types/            Domain types
```

## Conventions

- **State.** Each store calls `createStore()` and exposes `useXxxStore()` and an `xxxActions` object. State updates are immutable.
- **Data access.** Pages never call `fetch`. They go through `services/` and the stores.
- **File names.** Components use PascalCase file names. Everything else uses kebab-case.
- **Types.** TypeScript `strict` is on and `any` is a lint error.
- **Comments.** Keep comments rare. Use them only to explain a non-obvious *why*.
