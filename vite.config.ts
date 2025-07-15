import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";

export default defineConfig(async ({ mode }) => {
  process.env = {
    ...process.env,
    ...import.meta.env,
    ...loadEnv(mode, process.cwd(), ""),
  };

  return {
    plugins: [
      tsconfigPaths(),
      tailwindcss(),
      tanstackStart({
        customViteReactPlugin: true,
      }),
      viteReact(),
    ],
    resolve: {
      alias: {
        // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
        "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
      },
    },
  };
});
