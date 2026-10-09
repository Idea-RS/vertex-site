import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // the PostHog project key keeps the name it has on the app (NEXT_PUBLIC_POSTHOG_KEY); VITE_ is Vite's own prefix
  envPrefix: ['VITE_', 'NEXT_PUBLIC_POSTHOG_KEY'],
  resolve: {
    alias: {
      '@designcodeio/threeui/style.css': path.resolve(__dirname, 'src/shaders/threeui.css'),
      '@designcodeio/threeui': path.resolve(__dirname, 'src/shaders/landing-pages/LandingPages.tsx'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});
