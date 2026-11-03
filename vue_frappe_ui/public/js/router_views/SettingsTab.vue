<template>
  <div class="tab-pane">
    <div class="card p-3">
      <h4>⚙️ Settings & Configuration Sub-Route</h4>
      <p class="text-muted">
        Configure parameters for the internal Vue application.
      </p>

      <div class="form-group mb-3">
        <label>Display Name:</label>
        <input
          v-model="displayName"
          type="text"
          class="form-control"
          placeholder="Enter custom label"
        />
      </div>

      <div class="checkbox mb-3">
        <label>
          <input v-model="enableNotifications" type="checkbox" />
          Enable desktop notifications
        </label>
      </div>

      <div class="alert alert-secondary">
        Current value: <strong>{{ displayName }}</strong> |
        Notifications: <strong>{{ enableNotifications ? 'Enabled' : 'Disabled' }}</strong>
      </div>

      <div class="button-row">
        <button class="btn btn-default btn-sm" @click="$router.push('/')">
          Back to Overview
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const displayName = ref("Demo Page User");
const enableNotifications = ref(true);
</script>

<style scoped>
.tab-pane {
  padding: 15px 0;
}

.button-row {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
</style>

