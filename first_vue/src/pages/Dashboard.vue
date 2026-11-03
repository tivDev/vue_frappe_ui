<template>
  <div class="page-container">
    <!-- Logged In View -->
    <template v-if="authState.isLoggedIn">
      <div class="dashboard-header">
        <div>
          <h1 class="page-title">Portal Dashboard</h1>
          <p class="page-subtitle">
            Welcome back, <strong>{{ authState.user }}</strong>. Your Frappe session is active.
          </p>
        </div>
        <div class="header-actions">
          <a href="/app" target="_blank" class="btn btn-outline btn-sm">
            Open Desk (/app) ↗
          </a>
          <button class="btn btn-secondary btn-sm" @click="logout">
            Sign Out
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-title">Logged-in User</div>
          <div class="stat-number">{{ authState.user }}</div>
          <div class="stat-footnote">Active Frappe session cookie</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Connected App</div>
          <div class="stat-number">vue_frappe_ui</div>
          <div class="stat-footnote">Portal route: /first_vue</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">Frontend Stack</div>
          <div class="stat-number">Vue 3 + Vite</div>
          <div class="stat-footnote">Composition API & Vue Router</div>
        </div>
      </div>

      <!-- Live API Tester -->
      <div class="card api-card">
        <div class="card-header">
          <h2 class="card-title">Live Frappe API Request Tester</h2>
          <p class="card-desc">
            Test real-time communication between this Vue 3 client and the Frappe backend.
          </p>
        </div>

        <div class="api-actions">
          <button
            class="btn btn-primary"
            :disabled="loadingApi"
            @click="testApi('/api/method/frappe.auth.get_logged_user')"
          >
            <span v-if="loadingApi" class="spinner-sm"></span>
            Test Session API
          </button>

          <button
            class="btn btn-secondary"
            :disabled="loadingApi"
            @click="testApi('/api/method/frappe.client.get_list', { doctype: 'User', limit_page_length: 5 })"
          >
            <span v-if="loadingApi" class="spinner-sm"></span>
            Fetch Users List
          </button>
        </div>

        <!-- API Output Console -->
        <div v-if="apiResponse || apiError" class="console-box">
          <div class="console-header">
            <span>Response from {{ lastEndpoint }}</span>
            <span v-if="apiError" class="badge-error">Error</span>
            <span v-else class="badge-success">200 OK</span>
          </div>
          <pre class="console-content">{{ formattedOutput }}</pre>
        </div>
      </div>
    </template>

    <!-- Guest / Locked View -->
    <template v-else>
      <div class="locked-card">
        <div class="lock-icon">🔒</div>
        <h2 class="lock-title">Authentication Required</h2>
        <p class="lock-desc">
          You are currently browsing as a <strong>Guest</strong>. To access dashboard metrics,
          run authenticated Frappe API queries, and manage your account, please sign in.
        </p>
        <button class="btn btn-primary btn-lg" @click="openLoginModal">
          Sign In with Frappe
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { authState, openLoginModal, logout, getCsrfToken } from "../utils/auth";

const loadingApi = ref(false);
const lastEndpoint = ref("");
const apiResponse = ref(null);
const apiError = ref(null);

const formattedOutput = computed(() => {
  if (apiError.value) {
    return JSON.stringify(apiError.value, null, 2);
  }
  if (apiResponse.value) {
    return JSON.stringify(apiResponse.value, null, 2);
  }
  return "";
});

async function testApi(endpoint, body = null) {
  loadingApi.value = true;
  lastEndpoint.value = endpoint;
  apiResponse.value = null;
  apiError.value = null;

  try {
    const options = {
      headers: {
        "Accept": "application/json",
        "X-Frappe-CSRF-Token": getCsrfToken(),
      },
    };

    if (body) {
      options.method = "POST";
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    } else {
      options.method = "GET";
    }

    const res = await fetch(endpoint, options);
    const data = await res.json();

    if (!res.ok) {
      apiError.value = data;
    } else {
      apiResponse.value = data;
    }
  } catch (err) {
    apiError.value = { error: err.message };
  } finally {
    loadingApi.value = false;
  }
}
</script>

<style scoped>
.page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.35rem;
  color: var(--text-h, #111827);
}

.page-subtitle {
  font-size: 1rem;
  color: var(--text, #4b5563);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--bg, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.stat-title {
  font-size: 0.8rem;
  color: var(--text, #6b7280);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 0.35rem;
}

.stat-number {
  font-size: 1.35rem;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 0.35rem;
}

.stat-footnote {
  font-size: 0.78rem;
  color: var(--text, #9ca3af);
}

.card {
  background: var(--bg, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 14px;
  padding: 1.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.card-header {
  margin-bottom: 1.25rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.35rem;
  color: var(--text-h, #111827);
}

.card-desc {
  font-size: 0.92rem;
  color: var(--text, #6b7280);
  margin: 0;
}

.api-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}

.spinner-sm {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.6s linear infinite;
  margin-right: 0.35rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.console-box {
  background: #1e1e2e;
  color: #cdd6f4;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 1rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.console-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #181825;
  padding: 0.5rem 0.85rem;
  font-size: 0.8rem;
  color: #a6adc8;
}

.badge-success {
  color: #a6e3a1;
  font-weight: 600;
}

.badge-error {
  color: #f38ba8;
  font-weight: 600;
}

.console-content {
  margin: 0;
  padding: 1rem;
  font-size: 0.85rem;
  line-height: 1.45;
  overflow-x: auto;
  max-height: 320px;
}

.locked-card {
  text-align: center;
  padding: 4rem 1.5rem;
  background: var(--bg, #fff);
  border: 1px dashed var(--border, #d1d5db);
  border-radius: 16px;
  max-width: 520px;
  margin: 3rem auto;
}

.lock-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.lock-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: var(--text-h, #111827);
}

.lock-desc {
  font-size: 0.95rem;
  color: var(--text, #4b5563);
  line-height: 1.55;
  margin: 0 auto 1.75rem;
}
</style>

