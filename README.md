# Vue Frappe UI

A sample starter project and reference implementation demonstrating how to build a modern **Vue 3** Single Page Application (SPA) using **Vite** and seamlessly connect it to the **Frappe Framework** as a full-featured web portal.

---

## 🌟 Overview

Frappe Framework is widely known for its Python/Desk backend, but modern web portals, client dashboards, and PWAs often benefit from the reactivity and ecosystem of **Vue.js 3** and **Vite**.

This repository provides a working boilerplate and pattern showing:
- How to set up a standalone **Vue 3 + Vite** project alongside a Frappe app.
- How to run a **Vite development server** with hot module replacement (HMR) while proxying Frappe APIs and auth routes.
- How to build and publish compiled assets directly into Frappe's public directory and serve them via Frappe's `www` website portal system (`/first_vue`).
- How to handle Frappe authentication and **CSRF token injection** safely for REST API calls.

---

## 🏗️ Architecture & Project Structure

The project is structured into two main parts: the **Vue 3 frontend** (`first_vue/`) and the **Frappe app backend** (`vue_frappe_ui/`).

```text
apps/vue_frappe_ui/
├── first_vue/                            # 🚀 Vue 3 + Vite Frontend Project
│   ├── index.html                        # Base HTML entry template
│   ├── package.json                      # Frontend dependencies & build scripts
│   ├── vite.config.js                    # Vite bundler, proxy & asset base configuration
│   └── src/
│       ├── main.js                       # Vue app entry point
│       ├── App.vue                       # Root Vue component with <router-view>
│       ├── router/
│       │   └── index.js                  # Vue Router (with dynamic portal base path)
│       └── components/
│           └── HelloWorld.vue            # Sample interactive component
│
├── vue_frappe_ui/                        # 🐍 Frappe App Backend & Portal Hosting
│   ├── hooks.py                          # Standard Frappe hooks configuration
│   ├── public/
│   │   └── first_vue/                    # Output directory for compiled Vue JS/CSS assets
│   └── www/
│       ├── first_vue.py                  # Python context provider (injects CSRF token)
│       └── first_vue.html                # Frappe portal webpage serving the Vue SPA
│
├── VUE_GUIDELINE.md                      # Comprehensive in-depth integration guide
└── README.md                             # This documentation
```

---

## ⚡ Key Features & How It Works

### 1. Dual Development Experience
* **Vite Dev Server**: During development, work inside `first_vue/` with ultra-fast Vite HMR at `http://localhost:8084/`.
* **Automatic Proxy**: Vite automatically reads your bench's `sites/common_site_config.json` to proxy `/api`, `/app`, `/assets`, `/files`, and `/login` requests directly to your active Frappe bench webserver.

### 2. Seamless Portal Routing & CSRF Handling
* The compiled SPA is routed through Frappe's website engine at `http://<your-site>:8000/first_vue`.
* Frappe's server-side controller (`vue_frappe_ui/www/first_vue.py`) injects a valid `csrf_token` at render time:
  ```python
  def get_context(context):
      context.csrf_token = frappe.sessions.get_csrf_token()
      return context
  ```
* The HTML entrypoint exposes `window.csrf_token` to your client-side Vue scripts, making Frappe API calls frictionless and secure.

### 3. Dynamic Vue Router Base
The client-side router dynamically detects whether the app is running under the Vite dev server or inside Frappe:
```javascript
// first_vue/src/router/index.js
const base = window.location.pathname.startsWith("/first_vue")
  ? "/first_vue"
  : "/";

const router = createRouter({
  history: createWebHistory(base),
  routes,
});
```

### 4. Single-Command Build & Deployment
The build script in `package.json` compiles assets directly to `vue_frappe_ui/public/first_vue/` and syncs `index.html` to `vue_frappe_ui/www/first_vue.html`:
```bash
vite build && cp ../vue_frappe_ui/public/first_vue/index.html ../vue_frappe_ui/www/first_vue.html
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Frappe Bench](https://frappeframework.com/) installed (v14 or v15)
- [Node.js](https://nodejs.org/) (v18+) and [Yarn](https://yarnpkg.com/) (or npm)

### 1. Install App to Bench

In your Frappe bench directory:
```bash
cd $PATH_TO_YOUR_BENCH
bench get-app https://github.com/your-repo/vue_frappe_ui.git
bench --site <your-site-name> install-app vue_frappe_ui
```

### 2. Install Frontend Dependencies

```bash
cd apps/vue_frappe_ui/first_vue
yarn install
```

### 3. Running in Development Mode

Start the Vite development server:
```bash
yarn dev
```
- Open `http://localhost:8084/` in your browser.
- Any API calls made to `/api/method/...` are automatically proxied to your local Frappe instance.

### 4. Building for Production

Compile the Vue application into the Frappe app:
```bash
yarn build
```

Then visit the portal in your browser:
```text
http://<your-site-name>:8000/first_vue
```

---

## 📡 Making API Requests to Frappe from Vue

When making `fetch` or `axios` calls to Frappe endpoints (whitelisted methods or standard REST API), include the CSRF token from `window.csrf_token`:

```javascript
// Example helper for calling Frappe methods
export async function callFrappeMethod(method, args = {}) {
  const response = await fetch(`/api/method/${method}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Frappe-CSRF-Token": window.csrf_token || "",
    },
    body: JSON.stringify(args),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data.message;
}
```

---

## 📖 Deep-Dive Documentation

For a comprehensive guide on integrating Vue 3 into existing Frappe apps, configuring Desk pages, authentication helpers, and offline bundling, see [VUE_GUIDELINE.md](file:///home/tiv/ENC_App/apps/vue_frappe_ui/VUE_GUIDELINE.md).

---

## 🛠️ Contributing

This app uses `pre-commit` for formatting and linting:

```bash
cd apps/vue_frappe_ui
pre-commit install
```

Configured tools:
- `ruff`
- `eslint`
- `prettier`
- `pyupgrade`

---

## 📄 License

MIT
