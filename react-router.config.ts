import type { Config } from "@react-router/dev/config";

// Fleet contract: nginx forwards the whole /direct/<agent>:<port> prefix
// UNCHANGED, so the router must resolve every route under it. Baked at BUILD
// time. Empty/unset => serve at the host root.
const raw = (process.env.BASE_PATH ?? "").trim();
const basePath = raw ? `/${raw.replace(/^\/+|\/+$/g, "")}` : "";

export default {
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  basename: basePath || "/",
} satisfies Config;
