import { reactRouter } from "@react-router/dev/vite";
import { vercelPreset } from "@react-router/dev/presets/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    reactRouter({
      presets: [vercelPreset()],
    }),
    tailwindcss(),
  ],
});

