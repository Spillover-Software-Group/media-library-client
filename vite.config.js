import path from "path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 1234,
  },
  build: {
    lib: {
      // eslint-disable-next-line no-undef
      entry: path.resolve(__dirname, "src/main.jsx"),
      formats: ["es"],
      // Force extension to .es
      fileName: () => "media-library.es.js",
    },
    rollupOptions: {
      external: ["react", "react-dom"],
    },
  },
});
