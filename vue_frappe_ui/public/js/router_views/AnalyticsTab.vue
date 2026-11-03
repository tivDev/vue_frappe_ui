<template>
  <div class="tab-pane">
    <div class="card p-3">
      <h4>📊 Performance & Analytics Sub-Route</h4>
      <p class="text-muted">
        This view is mounted dynamically when route matches <code>/analytics</code>.
      </p>

      <div class="metric-list mt-3">
        <div class="metric-item">
          <span>Active Frappe Session:</span>
          <strong>{{ user }}</strong>
        </div>
        <div class="metric-item">
          <span>Current Internal Path:</span>
          <code>{{ $route.path }}</code>
        </div>
        <div class="metric-item">
          <span>Router Mode:</span>
          <span class="badge badge-success">Memory History</span>
        </div>
      </div>

      <div class="mt-4 button-row">
        <button class="btn btn-default btn-sm" @click="$router.back()">
          ← Back
        </button>
        <button class="btn btn-primary btn-sm" @click="$router.push('/settings')">
          Go to Settings →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const user = ref(frappe?.session?.user || "Administrator");
</script>

<style scoped>
.tab-pane {
  padding: 15px 0;
}

.metric-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--bg-light-gray, #f9fafb);
  border-radius: 6px;
  font-size: 14px;
}

.button-row {
  display: flex;
  gap: 10px;
}
</style>

