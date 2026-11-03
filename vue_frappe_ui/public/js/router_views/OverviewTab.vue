<template>
  <div class="tab-pane">
    <div class="alert alert-info">
      <strong>💡 In-Memory Routing Active:</strong>
      Notice that the browser address bar stays at <code>/app/router-demo</code>.
      Navigation between these tabs happens entirely inside Vue Router via <code>createMemoryHistory()</code>.
    </div>

    <div class="row">
      <div class="col-md-4">
        <div class="stat-box">
          <div class="stat-number">3</div>
          <div class="stat-label">Registered Sub-Routes</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="stat-box">
          <div class="stat-number">0</div>
          <div class="stat-label">Desk URL Collisions</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="stat-box">
          <div class="stat-number">100%</div>
          <div class="stat-label">Vue 3 Composition API</div>
        </div>
      </div>
    </div>

    <div class="card p-3 mt-3">
      <h5>Programmatic Navigation Demo</h5>
      <p class="text-muted">
        Clicking the button below invokes <code>router.push('/analytics')</code> using the Vue Router instance.
      </p>
      <button class="btn btn-primary btn-sm" @click="goToAnalytics">
        Go to Analytics Tab →
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function goToAnalytics() {
  router.push("/analytics");
}
</script>

<style scoped>
.tab-pane {
  padding: 15px 0;
}

.stat-box {
  background: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #d1d5db);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #6366f1;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  margin-top: 5px;
}
</style>

