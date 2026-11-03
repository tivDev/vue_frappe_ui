<template>
  <div class="router-demo-wrapper">
    <!-- Header -->
    <div class="demo-header">
      <div class="header-badge">Vue Router in Frappe Desk</div>
      <h3>In-Memory Vue Router Architecture</h3>
      <p class="text-muted">
        Demonstrates multi-view navigation inside a single Frappe Desk page without disrupting Frappe's main URL router.
      </p>
    </div>

    <!-- Navigation Tabs using Router-Link -->
    <div class="nav-tabs-wrapper">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <router-link
            to="/"
            class="nav-link"
            :class="{ active: $route.path === '/' }"
          >
            📋 Overview
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/analytics"
            class="nav-link"
            :class="{ active: $route.path === '/analytics' }"
          >
            📊 Analytics
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            to="/settings"
            class="nav-link"
            :class="{ active: $route.path === '/settings' }"
          >
            ⚙️ Settings
          </router-link>
        </li>
      </ul>

      <!-- Active Route Inspector -->
      <div class="route-inspector">
        Internal Memory Route: <code>{{ $route.path }}</code>
      </div>
    </div>

    <!-- Router View Display -->
    <div class="view-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.router-demo-wrapper {
  padding: 15px;
  background: var(--bg-color, #ffffff);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.demo-header {
  margin-bottom: 20px;
}

.header-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  padding: 3px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.demo-header h3 {
  margin: 0 0 5px;
  font-size: 20px;
  font-weight: 700;
  color: var(--text-color, #1f2937);
}

.nav-tabs-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.nav-tabs {
  border-bottom: none;
  display: flex;
  gap: 5px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-link {
  display: inline-block;
  padding: 8px 16px;
  border: 1px solid transparent;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  color: var(--text-muted, #6b7280);
  text-decoration: none !important;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.nav-link:hover {
  color: #6366f1;
  background: rgba(99, 102, 241, 0.05);
}

.nav-link.active {
  color: #6366f1;
  background: var(--bg-color, #ffffff);
  border-color: var(--border-color, #e5e7eb) var(--border-color, #e5e7eb) transparent;
  border-bottom: 2px solid #6366f1;
  font-weight: 600;
}

.route-inspector {
  font-size: 12px;
  color: var(--text-muted, #6b7280);
  background: var(--bg-light-gray, #f3f4f6);
  padding: 4px 10px;
  border-radius: 6px;
}

.route-inspector code {
  color: #6366f1;
  font-weight: 600;
}

.view-content {
  min-height: 250px;
}
</style>

