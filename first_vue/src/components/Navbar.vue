<template>
  <header class="navbar">
    <div class="nav-container">
      <!-- Brand / Logo -->
      <router-link to="/" class="nav-brand">
        <span class="brand-logo">⚡</span>
        <div class="brand-text">
          <span class="brand-title">Frappe Vue Portal</span>
          <span class="brand-badge">Vue 3 + Vite</span>
        </div>
      </router-link>

      <!-- Desktop Nav Links -->
      <nav class="nav-links" :class="{ 'is-open': mobileMenuOpen }">
        <router-link
          to="/"
          class="nav-link"
          :class="{ active: route.path === '/' }"
          @click="mobileMenuOpen = false"
        >
          Home
        </router-link>
        <router-link
          to="/dashboard"
          class="nav-link"
          :class="{ active: route.path === '/dashboard' }"
          @click="mobileMenuOpen = false"
        >
          Dashboard
        </router-link>
        <router-link
          to="/about"
          class="nav-link"
          :class="{ active: route.path === '/about' }"
          @click="mobileMenuOpen = false"
        >
          About
        </router-link>

        <!-- Mobile User Actions -->
        <div class="mobile-auth-actions" v-if="mobileMenuOpen">
          <template v-if="authState.isLoggedIn">
            <div class="user-pill">
              <span class="user-avatar">{{ userInitial }}</span>
              <span class="user-name">{{ authState.user }}</span>
            </div>
            <a href="/app" class="btn btn-secondary btn-sm" target="_blank">
              Go to Desk ↗
            </a>
            <button class="btn btn-danger btn-sm" @click="handleLogout">
              Sign Out
            </button>
          </template>
          <template v-else>
            <button class="btn btn-primary" @click="handleOpenLogin">
              Sign In
            </button>
          </template>
        </div>
      </nav>

      <!-- Desktop Auth Actions -->
      <div class="nav-actions">
        <template v-if="authState.isLoggedIn">
          <div class="user-pill" :title="'Logged in as ' + authState.user">
            <span class="user-avatar">{{ userInitial }}</span>
            <span class="user-name">{{ authState.user }}</span>
          </div>
          <a href="/app" class="btn btn-outline btn-sm" title="Open Frappe Desk (/app)">
            Desk ↗
          </a>
          <button class="btn btn-secondary btn-sm" @click="handleLogout">
            Sign Out
          </button>
        </template>
        <template v-else>
          <span class="guest-chip">Guest</span>
          <button class="btn btn-primary btn-sm" @click="handleOpenLogin">
            Sign In
          </button>
        </template>

        <!-- Mobile Menu Toggle Button -->
        <button
          class="hamburger-btn"
          aria-label="Toggle navigation menu"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span :class="{ 'is-active': mobileMenuOpen }"></span>
          <span :class="{ 'is-active': mobileMenuOpen }"></span>
          <span :class="{ 'is-active': mobileMenuOpen }"></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { authState, openLoginModal, logout } from "../utils/auth";

const route = useRoute();
const mobileMenuOpen = ref(false);

const userInitial = computed(() => {
  if (!authState.user) return "?";
  return authState.user.charAt(0).toUpperCase();
});

function handleOpenLogin() {
  mobileMenuOpen.value = false;
  openLoginModal();
}

function handleLogout() {
  mobileMenuOpen.value = false;
  logout();
}
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border, #e5e7eb);
  transition: all 0.2s ease;
}

@media (prefers-color-scheme: dark) {
  .navbar {
    background: rgba(22, 23, 29, 0.95);
  }
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.25rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
  color: var(--text-h, #111827);
  font-weight: 600;
}

.brand-logo {
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border-radius: 8px;
  color: #fff;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.2;
}

.brand-badge {
  font-size: 0.7rem;
  color: #6366f1;
  font-weight: 500;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.nav-link {
  padding: 0.45rem 0.9rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--text, #4b5563);
  transition: all 0.15s ease;
}

.nav-link:hover {
  color: var(--text-h, #111827);
  background: rgba(99, 102, 241, 0.08);
}

.nav-link.active {
  color: #6366f1;
  background: rgba(99, 102, 241, 0.12);
  font-weight: 600;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.guest-chip {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  background: rgba(156, 163, 175, 0.18);
  color: var(--text, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.65rem 0.25rem 0.25rem;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 9999px;
}

.user-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #6366f1;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-h, #111827);
  max-width: 140px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-auth-actions {
  display: none;
}

.hamburger-btn {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 28px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.hamburger-btn span {
  width: 100%;
  height: 2px;
  background: var(--text-h, #111827);
  border-radius: 2px;
  transition: all 0.2s ease;
}

@media (max-width: 768px) {
  .hamburger-btn {
    display: flex;
  }

  .nav-links {
    display: none;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background: var(--bg, #fff);
    border-bottom: 1px solid var(--border, #e5e7eb);
    flex-direction: column;
    padding: 1rem 1.25rem;
    gap: 0.75rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .nav-links.is-open {
    display: flex;
  }

  .nav-link {
    width: 100%;
    padding: 0.75rem 1rem;
    box-sizing: border-box;
  }

  .mobile-auth-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.5rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--border, #e5e7eb);
  }

  .nav-actions .user-pill,
  .nav-actions .btn,
  .nav-actions .guest-chip {
    display: none;
  }
}
</style>

