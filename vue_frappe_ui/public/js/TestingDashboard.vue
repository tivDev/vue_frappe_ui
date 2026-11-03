<template>
  <div class="testing-vue-dashboard">
    <!-- Header Banner -->
    <div class="dashboard-header">
      <div class="header-icon">⚡</div>
      <div>
        <h2 class="header-title">Vue 3 in Frappe Desk</h2>
        <p class="header-subtitle">Running natively inside the Testing App with reactivity and backend API communication.</p>
      </div>
    </div>

    <!-- Cards Grid -->
    <div class="dashboard-grid">
      <!-- Card 1: Reactive State Demo -->
      <div class="card">
        <h3 class="card-title">1. Reactive State Demo</h3>
        <p class="card-description">Demonstrating Vue 3 Composition API reactivity in Desk.</p>
        <div class="counter-display">
          Count: <strong>{{ counter }}</strong>
        </div>
        <div class="button-group">
          <button class="btn btn-primary btn-sm" @click="increment">+ Increment</button>
          <button class="btn btn-default btn-sm" @click="decrement">- Decrement</button>
          <button class="btn btn-danger btn-sm" @click="reset">Reset</button>
        </div>
      </div>

      <!-- Card 2: Two-way Data Binding -->
      <div class="card">
        <h3 class="card-title">2. Two-Way Binding</h3>
        <p class="card-description">Type below to see instant Vue model updates:</p>
        <input
          v-model="inputText"
          type="text"
          class="form-control"
          placeholder="Type something here..."
        />
        <div class="preview-box">
          Live preview: <em>{{ inputText || '(empty)' }}</em>
        </div>
      </div>

      <!-- Card 3: Backend API Integration -->
      <div class="card full-width">
        <div class="api-header">
          <div>
            <h3 class="card-title">3. Frappe Backend Integration</h3>
            <p class="card-description">Fetches live data from <code>vue_frappe_ui.api.get_dashboard_stats</code> via <code>frappe.call</code></p>
          </div>
          <button class="btn btn-primary btn-sm" :disabled="loading" @click="fetchData">
            {{ loading ? 'Loading...' : '🔄 Refresh Backend Data' }}
          </button>
        </div>

        <div v-if="apiData" class="stats-row">
          <div class="stat-item">
            <span class="stat-label">Current User</span>
            <span class="stat-value">{{ apiData.user }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Active Site</span>
            <span class="stat-value">{{ apiData.site }}</span>
          </div>
          <div class="stat-item" v-if="apiData.stats">
            <span class="stat-label">Total Users</span>
            <span class="stat-value">{{ apiData.stats.total_users }}</span>
          </div>
          <div class="stat-item" v-if="apiData.stats">
            <span class="stat-label">Total Roles</span>
            <span class="stat-value">{{ apiData.stats.total_roles }}</span>
          </div>
        </div>

        <div v-else class="text-muted">
          Click the refresh button above to load backend data.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const counter = ref(0);
const inputText = ref("Frappe + Vue 3 is awesome!");
const apiData = ref(null);
const loading = ref(false);

const increment = () => counter.value++;
const decrement = () => counter.value--;
const reset = () => (counter.value = 0);

const fetchData = () => {
  if (typeof frappe === "undefined") {
    console.warn("frappe object not available");
    return;
  }
  loading.value = true;
  frappe.call({
    method: "vue_frappe_ui.api.get_dashboard_stats",
    callback: (r) => {
      loading.value = false;
      if (r.message) {
        apiData.value = r.message;
      }
    },
    error: () => {
      loading.value = false;
    }
  });
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.testing-vue-dashboard {
  padding: 20px;
  font-family: inherit;
}

.dashboard-header {
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
  color: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.header-icon {
  font-size: 36px;
}

.header-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: white;
}

.header-subtitle {
  margin: 4px 0 0 0;
  opacity: 0.9;
  font-size: 14px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.card {
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card.full-width {
  grid-column: 1 / -1;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 6px;
}

.card-description {
  font-size: 13px;
  color: var(--text-muted, #6b7280);
  margin-bottom: 16px;
}

.counter-display {
  font-size: 20px;
  margin-bottom: 14px;
}

.button-group {
  display: flex;
  gap: 8px;
}

.preview-box {
  margin-top: 12px;
  padding: 10px;
  background: var(--bg-light-gray, #f9fafb);
  border-radius: 6px;
  font-size: 13px;
}

.api-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.stat-item {
  background: var(--bg-light-gray, #f9fafb);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted, #6b7280);
  text-transform: uppercase;
  font-weight: 600;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-color, #111827);
  margin-top: 4px;
}
</style>

