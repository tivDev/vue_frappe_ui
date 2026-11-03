<template>
  <div id="vue-root" class="app-layout">
    <!-- Top Navigation Bar -->
    <Navbar />

    <!-- Routed Pages Content -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Global Footer -->
    <footer class="app-footer">
      <div class="footer-container">
        <span>⚡ <strong>Vue Frappe UI</strong> Portal</span>
        <span>Built with Vue 3, Vite & Frappe Framework</span>
      </div>
    </footer>

    <!-- Form Dialog for Login -->
    <LoginModal />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import Navbar from "./components/Navbar.vue";
import LoginModal from "./components/LoginModal.vue";
import { checkSession } from "./utils/auth";

onMounted(() => {
  // Check if active Frappe session already exists
  checkSession();
});
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1 0 auto;
}

.app-footer {
  flex-shrink: 0;
  border-top: 1px solid var(--border, #e5e7eb);
  background: var(--bg, #fff);
  padding: 1.25rem 0;
  font-size: 0.85rem;
  color: var(--text, #6b7280);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

@media (max-width: 600px) {
  .footer-container {
    flex-direction: column;
    text-align: center;
  }
}
</style>
