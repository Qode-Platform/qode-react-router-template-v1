import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// Fleet contract: nginx forwards /direct/<agent>:<port> UNCHANGED. `basename`
// in react-router.config.ts only moves the ROUTES; the client bundle's URLs
// come from Vite's `base`, so without this every /assets/* request goes to the
// host root and misses the prefix entirely. Baked at BUILD time.
const raw = (process.env.BASE_PATH ?? "").trim();
const basePath = raw ? `/${raw.replace(/^\/+|\/+$/g, "")}` : "";

export default defineConfig({
  base: basePath ? `${basePath}/` : "/",
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});
