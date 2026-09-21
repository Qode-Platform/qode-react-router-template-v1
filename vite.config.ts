import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// NOTE: Vite's `base` is deliberately NOT set to $BASE_PATH here, unlike the
// other Vite-based templates in this set.
//
// react-router-serve mounts its static handler at `<publicPath>/assets` in
// Express, and BASE_PATH contains a colon (/direct/<agent>:<port>).
// path-to-regexp v8 reads that colon as a route parameter and throws at boot:
//
//   TypeError: Missing parameter name at index 20: /direct/agent-x:8998/assets
//
// so setting `base` stops the server starting at all. Routing still resolves
// under the prefix via `basename` in react-router.config.ts; the client bundle
// is requested from the host root (/assets/*), and nginx recovers those from
// the Referer of the /direct/<agent>:<port>/ page that asked for them
// (web/nginx.conf, the $direct_up map + the `location /` fallback).
//
// Trade-off: asset loading here depends on the Referer header. If you need it
// self-contained, replace react-router-serve with your own Express server that
// mounts the static dir with a plain string path, then set `base` below.
export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});
