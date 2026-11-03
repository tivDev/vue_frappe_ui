import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import fs from "fs";

export default defineConfig({
  plugins: [vue()],
  // Tells the browser to load compiled assets from Frappe's /assets route
  base: "/assets/vue_frappe_ui/first_vue/",
  build: {
    // Outputs compiled bundles directly into Frappe's public assets folder
    outDir: "../vue_frappe_ui/public/first_vue",
    emptyOutDir: true,
    target: "es2015",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8084, // Dedicated port for this Vue app (e.g., 8084)
    proxy: getProxyOptions(),
  },
});

function getProxyOptions() {
  const config = getCommonSiteConfig();
  const webserver_port = config ? config.webserver_port : 8000;
  return {
    "^/(app|api|assets|files|login)": {
      target: `http://127.0.0.1:${webserver_port}`,
      changeOrigin: true,
      ws: true,
    },
  };
}

function getCommonSiteConfig() {
  let currentDir = path.resolve(".");
  while (currentDir !== "/") {
    if (
      fs.existsSync(path.join(currentDir, "sites")) &&
      fs.existsSync(path.join(currentDir, "apps"))
    ) {
      let configPath = path.join(currentDir, "sites", "common_site_config.json");
      if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath));
      }
      return null;
    }
    currentDir = path.resolve(currentDir, "..");
  }
  return null;
}