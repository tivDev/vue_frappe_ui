# Complete Guideline: Integrating Vue.js (Vue 3) in Any Frappe App

This guide explains step-by-step how to integrate **Vue.js 3** into any Frappe app (e.g. `testing`, `smarthr`, `smartasset`, etc.).

There are two primary ways to use Vue in Frappe:
* **Mode A: Standalone Web Portal / SPA** (Vite + Vue 3 + Vue Router + Authentication) — Ideal for employee portals, customer dashboards, mobile PWAs, or custom web tools.
* **Mode B: Embedded Frappe Desk Page** (Native Frappe Bundler + Vue 3) — Ideal for administrative dashboards running inside the standard Frappe Desk (`/app/...`).

---

## Mode A: Standalone SPA / Web Portal (Vite + Vue 3)

### 1. Folder Structure
In your target app directory (`apps/<app_name>/`), create the following structure:

```text
apps/<app_name>/
├── vue_frappe_ui/                     <-- Vue 3 Vite project root
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.js
│       ├── App.vue
│       ├── router/
│       │   └── index.js
│       ├── components/
│       │   ├── Navbar.vue
│       │   └── LoginModal.vue
│       ├── pages/
│       │   ├── Home.vue
│       │   ├── Dashboard.vue
│       │   └── Login.vue
│       └── utils/
│           └── auth.js
└── <app_name>/                   <-- Python app root
    ├── api.py                    <-- Custom API methods
    ├── hooks.py
    ├── public/
    │   └── vue_frappe_ui/             <-- Compiled Vite assets output here
    └── www/
        ├── <app_name>_portal.py  <-- Python context & CSRF provider
        └── <app_name>_portal.html<-- HTML entry point copied after build
```

---

### 2. Frontend Configuration Files

#### `vue_frappe_ui/package.json`
```json
{
  "name": "<app_name>-vue_frappe_ui",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build && cp ../<app_name>/public/vue_frappe_ui/index.html ../<app_name>/www/<app_name>_portal.html",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.5.12",
    "vue-router": "^4.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "4.4.0",
    "vite": "^5.4.10"
  }
}
```

---

### 3. Installing Dependencies (Generating `node_modules`)

The `node_modules` directory contains all the installed JavaScript libraries and tools (`vue`, `vite`, `vue-router`, etc.). It is created by running a package manager inside the `vue_frappe_ui` folder.

#### How to generate `node_modules`:
Open your terminal and run:
```bash
cd apps/<app_name>/vue_frappe_ui
yarn install
```
*(Or if you use npm: `npm install`)*

> [!TIP]
> **Offline Installation**: If your bench environment has no active internet connection or already cached packages from HRMS/Frappe, you can install instantly from local cache:
> ```bash
> yarn install --offline
> ```

> [!IMPORTANT]
> **Git Best Practice**: Never commit `node_modules` to Git! Ensure `node_modules` is listed in your app's `.gitignore`:
> ```text
> # apps/<app_name>/.gitignore
> node_modules/
> ```

---

### 4. Vite Configuration & HTML Entry

#### `vue_frappe_ui/vite.config.js`
This file automatically reads the `webserver_port` from `sites/common_site_config.json` so development proxying works out of the box regardless of which port your bench uses:

```javascript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import fs from "fs";

export default defineConfig({
  plugins: [vue()],
  base: "/assets/<app_name>/vue_frappe_ui/",
  build: {
    outDir: "../<app_name>/public/vue_frappe_ui",
    emptyOutDir: true,
    target: "es2015",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8082,
    proxy: getProxyOptions(),
  },
});

function getProxyOptions() {
  const config = getCommonSiteConfig();
  const webserver_port = config?.webserver_port || 8000;
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
    if (fs.existsSync(path.join(currentDir, "sites")) && fs.existsSync(path.join(currentDir, "apps"))) {
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
```

#### `vue_frappe_ui/index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App Portal</title>
  </head>
  <body>
    <div id="app"></div>
    <script>
      window.csrf_token = "{{ csrf_token }}";
    </script>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

---

### 5. Client-Side Routing with Vue Router

#### `vue_frappe_ui/src/router/index.js`
> [!IMPORTANT]
> Because Frappe serves the portal under `/<app_name>_portal`, the router base path must support both Frappe's route and Vite's local dev root (`/`).

```javascript
import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Dashboard from "../pages/Dashboard.vue";
import Login from "../pages/Login.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/login", name: "Login", component: Login },
];

const base = window.location.pathname.startsWith("/<app_name>_portal")
  ? "/<app_name>_portal"
  : "/";

const router = createRouter({
  history: createWebHistory(base),
  routes,
});

export default router;
```

#### `vue_frappe_ui/src/main.js`
```javascript
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(router);
app.mount("#app");
```

---

### 6. Frappe Server-Side Configuration

#### Catch-All Web Routing in `apps/<app_name>/<app_name>/hooks.py`
Add this rule so that refreshing deep routes (like `/<app_name>_portal/dashboard`) does not throw a 404 error:

```python
website_route_rules = [
    {"from_route": "/<app_name>_portal/<path:app_path>", "to_route": "<app_name>_portal"},
]
```

#### Context Provider in `apps/<app_name>/<app_name>/www/<app_name>_portal.py`
```python
import frappe

def get_context(context):
    context.csrf_token = frappe.sessions.get_csrf_token()
    return context
```

---

### 7. Authentication & Calling Backend APIs

#### Python Backend Method (`apps/<app_name>/<app_name>/api.py`):
```python
import frappe

# Requires login (Guest access blocked with PermissionError):
@frappe.whitelist()
def get_data():
    return {
        "user": frappe.session.user,
        "records": frappe.get_all("DocType Name", fields=["name", "creation"])
    }

# Publicly accessible to Guests:
@frappe.whitelist(allow_guest=True)
def get_public_info():
    return {"status": "ok"}
```

#### Vue Authentication Helper (`vue_frappe_ui/src/utils/auth.js`):
```javascript
import { reactive, computed } from "vue";

export const authState = reactive({
  user: null,
  isLoggedIn: computed(() => !!authState.user),
  showLoginModal: false,
});

export async function login(usr, pwd) {
  const res = await fetch("/api/method/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usr, pwd }),
  });
  const data = await res.json();
  if (res.ok && data.message === "Logged In") {
    authState.user = data.full_name || usr;
    authState.showLoginModal = false;
    return { success: true };
  }
  return { success: false, error: data.message || "Invalid credentials" };
}

export async function logout() {
  await fetch("/api/method/logout", { method: "POST" });
  authState.user = null;
  window.location.reload();
}
```

---

## Mode B: Embedded Frappe Desk Page (Admin Desk)

Use this when you want a Vue 3 component inside the official Frappe Desk admin portal (`/app/<page-name>`).

> [!NOTE]
> **No `node_modules` needed for Mode B**: Unlike Mode A, you do **not** need a `node_modules` folder inside your custom app for Desk pages. Frappe's built-in bundler (`apps/frappe/esbuild`) already has Vue 3 and `esbuild-plugin-vue3` available in `apps/frappe/node_modules`.

### 1. Create the Desk Page Document
Create directory `apps/<app_name>/<app_name>/<module_name>/page/<page_name>/`:

#### `<page_name>.json`:
```json
{
 "doctype": "Page",
 "module": "<Module_Name>",
 "name": "<page_name>",
 "page_name": "<page_name>",
 "roles": [],
 "standard": "Yes",
 "title": "My Vue Dashboard"
}
```

#### `<page_name>.js`:
```javascript
frappe.pages['<page_name>'].on_page_load = function (wrapper) {
    let page = frappe.ui.make_app_page({
        parent: wrapper,
        title: __('My Vue Dashboard'),
        single_column: true
    });

    frappe.require('<page_name>.bundle.js', () => {
        frappe.<app_name>.render_dashboard(page.main[0]);
    });
};
```

---

### 2. Create the Vue 3 Bundle in `public/js/`

#### `apps/<app_name>/<app_name>/public/js/<page_name>.bundle.js`:
```javascript
import { createApp } from "vue";
import DashboardComponent from "./DashboardComponent.vue";

frappe.provide("frappe.<app_name>");

frappe.<app_name>.render_dashboard = function (target) {
    const app = createApp(DashboardComponent);
    app.mount(target);
    return app;
};
```

#### `apps/<app_name>/<app_name>/public/js/DashboardComponent.vue`:
```vue
<template>
  <div class="p-4">
    <h3>{{ title }}</h3>
    <p>Reactive Count: {{ count }}</p>
    <button class="btn btn-primary btn-sm" @click="count++">Increment</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
const title = ref("Native Vue 3 inside Frappe Desk");
const count = ref(0);
</script>
```

#### Compile the Desk Bundle:
```bash
bench build --app <app_name>
```
*(Or during development: `bench watch --app <app_name>`)*

---

## Summary Command Cheat Sheet

| Task | Command |
| :--- | :--- |
| **Run SPA Dev Server** | `cd apps/<app_name>/vue_frappe_ui && yarn dev` |
| **Build SPA for Production** | `cd apps/<app_name>/vue_frappe_ui && yarn build` |
| **Build Desk Bundle (Mode B)** | `bench build --app <app_name>` |
| **Watch Desk Bundle changes** | `bench watch --app <app_name>` |
| **Sync new Page in Database** | `bench --site <site_name> reload-doc <module> page <page_name>` |

