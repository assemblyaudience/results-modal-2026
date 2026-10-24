import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig(
{plugins: [
      tanstackRouter({
            target: 'react',
            autoCodeSplitting: true,
      }),
      react(),
      // This is for the Cloudflare Wrangler/Vite plugin
      cloudflare({ viteEnvironment: { name: "worker" } })],
      environments: {
		worker: { build: { sourcemap: true } },
	},
});
