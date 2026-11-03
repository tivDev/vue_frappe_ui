<template>
  <div class="page-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-badge">
        <span class="badge-dot"></span>
        Vue 3 + Vite + Frappe Portal
      </div>
      <h1 class="hero-title">
        Modern Frontend for <span class="gradient-text">Frappe Framework</span>
      </h1>
      <p class="hero-subtitle">
        A reference Single Page Application demonstrating seamless integration between
        Vue 3 Composition API, Vite dev proxy, and Frappe's website portal system.
      </p>

      <div class="hero-actions">
        <router-link to="/dashboard" class="btn btn-primary btn-lg">
          Explore Dashboard →
        </router-link>
        <button
          v-if="!authState.isLoggedIn"
          class="btn btn-secondary btn-lg"
          @click="openLoginModal"
        >
          Sign In Dialog
        </button>
        <a
          v-else
          href="/app"
          class="btn btn-outline btn-lg"
          target="_blank"
        >
          Open Frappe Desk ↗
        </a>
      </div>
    </section>

    <!-- System Status Grid -->
    <section class="status-section">
      <div class="status-card">
        <div class="status-icon">🔌</div>
        <div class="status-info">
          <div class="status-label">Frappe Connection</div>
          <div class="status-value text-success">
            <span class="status-indicator live"></span> Connected
          </div>
        </div>
      </div>

      <div class="status-card">
        <div class="status-icon">🛡️</div>
        <div class="status-info">
          <div class="status-label">CSRF Token</div>
          <div class="status-value">
            <span v-if="csrfDetected" class="text-success">Injected</span>
            <span v-else class="text-muted">Dev Proxy Mode</span>
          </div>
        </div>
      </div>

      <div class="status-card">
        <div class="status-icon">👤</div>
        <div class="status-info">
          <div class="status-label">Session State</div>
          <div class="status-value">
            <span v-if="authState.isLoggedIn" class="text-primary font-bold">
              {{ authState.user }}
            </span>
            <span v-else class="text-muted">Guest User</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Highlights -->
    <section class="features-section">
      <h2 class="section-title">Key Integration Features</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3 class="feature-title">Vite HMR & Bench Proxy</h3>
          <p class="feature-desc">
            Develop with sub-second hot module replacement. Vite automatically proxies
            <code>/api</code>, <code>/assets</code>, and <code>/login</code> directly to Frappe's webserver.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3 class="feature-title">Native Frappe Auth</h3>
          <p class="feature-desc">
            Sign in using standard Frappe credentials. Sessions and cookies are shared between
            this Vue SPA and Frappe Desk.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🧭</div>
          <h3 class="feature-title">Smart Base Routing</h3>
          <p class="feature-desc">
            Vue Router auto-detects execution mode: running at <code>/</code> during Vite dev
            and switching to <code>/first_vue</code> when served via Frappe.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📦</div>
          <h3 class="feature-title">Automated Build Pipeline</h3>
          <p class="feature-desc">
            <code>yarn build</code> places compiled bundles into Frappe's <code>public/</code>
            folder and copies entry HTML to <code>www/first_vue.html</code> for instant delivery.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { authState, openLoginModal, getCsrfToken } from "../utils/auth";

const csrfDetected = computed(() => !!getCsrfToken());
</script>

<style scoped>
.page-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4rem;
}

.hero-section {
  text-align: center;
  padding: 3rem 1rem 3.5rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  font-size: 0.82rem;
  font-weight: 600;
  border-radius: 9999px;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  border: 1px solid rgba(99, 102, 241, 0.2);
  margin-bottom: 1.5rem;
}

.badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin: 0 0 1.25rem;
  color: var(--text-h, #111827);
}

.gradient-text {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.15rem;
  line-height: 1.6;
  max-width: 650px;
  margin: 0 auto 2.25rem;
  color: var(--text, #4b5563);
}

.hero-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.status-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  margin: 1.5rem 0 3.5rem;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  background: var(--bg, #ffffff);
  border: 1px solid var(--border, #e5e7eb);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.status-icon {
  font-size: 1.8rem;
  line-height: 1;
}

.status-label {
  font-size: 0.8rem;
  color: var(--text, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.status-value {
  font-size: 1.05rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
}

.status-indicator.live {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

.features-section {
  margin-top: 2rem;
}

.section-title {
  text-align: center;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-h, #111827);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  padding: 1.75rem;
  border-radius: 12px;
  background: var(--bg, #ffffff);
  border: 1px solid var(--border, #e5e7eb);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 0.85rem;
}

.feature-title {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--text-h, #111827);
}

.feature-desc {
  font-size: 0.92rem;
  line-height: 1.55;
  color: var(--text, #6b7280);
  margin: 0;
}

.feature-desc code {
  font-size: 0.82rem;
  padding: 0.15rem 0.35rem;
  background: rgba(99, 102, 241, 0.08);
  color: #6366f1;
  border-radius: 4px;
}

.text-success {
  color: #10b981;
}

.text-primary {
  color: #6366f1;
}

.text-muted {
  color: var(--text, #6b7280);
}

.font-bold {
  font-weight: 700;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }
  .hero-subtitle {
    font-size: 1rem;
  }
}
</style>

