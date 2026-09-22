# React Router (Remix) template

Provisioned from [`Qode-Platform/fleet-template-v1`](https://github.com/Qode-Platform/fleet-template-v1) — the fleet
lifecycle contract (`bin/`, `fleet.conf`, deploy workflows) with a
React Router (Remix) starter laid on top.

## Origin

    npx create-react-router@latest react-router --no-install

Generated 2026-09-21 on Node v22.12.0 / Python 3.12.3. **Dependencies were
never installed and this has never been built or run.** Boot it once before
trusting it.

## Fleet lifecycle

`fleet.conf` drives every script in `bin/`:

| step | command |
|---|---|
| install | `npm install` |
| build | `npm run build` |
| start | `npx react-router-serve ./build/server/index.js` |

    ./bin/run       # install, build, start in the foreground
    ./bin/start     # start from existing build artifacts
    ./bin/restart   # rebuild and restart
    ./bin/stop      # stop whatever holds the port

Listens on `$PORT` (default `3000`); health check hits `/`.

## BASE_PATH

The fleet injects `BASE_PATH` (`/direct/<agent>:<port>`) and nginx forwards
that prefix **unchanged** — so this app serves every route and asset under
it. An empty or unset value means standalone mode: serve at the host root.

- React Router `basename` in react-router.config.ts, baked at BUILD time.
- `HEALTH_PATH` in `fleet.conf` stays un-prefixed; the fleet prepends `$BASE_PATH` itself.
- A value like `direct/x:3000/` is normalised to `/direct/x:3000`.

## What differs from stock output

- react-router-serve reads $PORT from the environment, which bin/_common.sh exports.

---

# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.

## Rule: everything under BASE_PATH

This app is not served at the host root. The fleet ingress serves it under a
proxy prefix and forwards that prefix **unchanged**:

```
BASE_PATH=/direct/<agent>:<port>
```

**Every API call and every asset reference must carry that base path.** A bare
`"/..."` literal resolves against the host root, so it works on localhost and
404s in the fleet.

**What React Router / Vite rewrites for you:** route resolution - `<Link>`,
`<NavLink>`, `navigate()` and loader/action paths all go through the `basename`
set in `react-router.config.ts` from `BASE_PATH` - plus Vite's handling of
imported assets (`import logo from "./logo.svg"`).

**What is NOT rewritten:** `fetch`/XHR/axios URLs, plain `<a href>` and
`<img src>` string literals, CSS `url(...)`, and any URL built from a string in
code.

**Use this framework's mechanism:** the Vite mechanism is normally
`import.meta.env.BASE_URL` - but in **this** template Vite's `base` is
deliberately left unset (`BASE_PATH` contains a colon, which crashes
`path-to-regexp` inside `react-router-serve`; see the comment in
`vite.config.ts`), so `import.meta.env.BASE_URL` is `"/"` here and must not be
relied on. Use the router's `basename` instead, most simply via `useHref`:

```tsx
import { useHref } from "react-router";

const itemsUrl = useHref("/api/items"); // basename applied
const res = await fetch(itemsUrl);
```

**Verify with:**

```bash
npm run check:base-path
```

A line that is genuinely framework-handled can be exempted with a trailing
`// base-path-ok` comment (say why).
