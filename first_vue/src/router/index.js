import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Dashboard from "../pages/Dashboard.vue";
import About from "../pages/About.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
];

// In production Frappe, base is "/first_vue". In Vite dev server, it is "/"
const base = window.location.pathname.startsWith("/first_vue")
  ? "/first_vue"
  : "/";

const router = createRouter({
  history: createWebHistory(base),
  routes,
});

export default router;
