<template>
  <div
    v-if="authState.showLoginModal"
    class="modal-backdrop"
    @click.self="handleClose"
    @keydown.esc="handleClose"
    tabindex="-1"
  >
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <!-- Close Button -->
      <button
        class="modal-close-btn"
        aria-label="Close dialog"
        @click="handleClose"
        :disabled="authState.isSubmitting"
      >
        ✕
      </button>

      <!-- Modal Header -->
      <div class="modal-header">
        <div class="modal-icon">🔐</div>
        <h2 id="modal-title" class="modal-title">Sign in to Frappe</h2>
        <p class="modal-subtitle">
          Connect your session to access portal features and data
        </p>
      </div>

      <!-- Error Message Banner -->
      <div v-if="authState.loginError" class="alert-error" role="alert">
        <span class="alert-icon">⚠️</span>
        <span class="alert-text">{{ authState.loginError }}</span>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">Username or Email</label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="form-input"
            placeholder="e.g. Administrator or user@example.com"
            autocomplete="username"
            required
            :disabled="authState.isSubmitting"
            ref="usernameInputRef"
          />
        </div>

        <div class="form-group">
          <div class="label-row">
            <label for="password" class="form-label">Password</label>
            <button
              type="button"
              class="toggle-pwd-btn"
              @click="showPassword = !showPassword"
              tabindex="-1"
            >
              {{ showPassword ? "Hide" : "Show" }}
            </button>
          </div>
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="form-input"
            placeholder="Enter your password"
            autocomplete="current-password"
            required
            :disabled="authState.isSubmitting"
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-block btn-lg"
          :disabled="authState.isSubmitting"
        >
          <span v-if="authState.isSubmitting" class="spinner"></span>
          <span>{{ authState.isSubmitting ? "Signing in..." : "Sign In" }}</span>
        </button>

        <div class="form-footer">
          <p class="hint-text">
            💡 <strong>Dev Hint:</strong> Use your local bench credentials (e.g. <code>Administrator</code> / <code>admin</code>).
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { authState, login, closeLoginModal } from "../utils/auth";

const username = ref("");
const password = ref("");
const showPassword = ref(false);
const usernameInputRef = ref(null);

watch(
  () => authState.showLoginModal,
  (isOpen) => {
    if (isOpen) {
      username.value = "";
      password.value = "";
      showPassword.value = false;
      nextTick(() => {
        if (usernameInputRef.value) {
          usernameInputRef.value.focus();
        }
      });
    }
  }
);

function handleClose() {
  if (!authState.isSubmitting) {
    closeLoginModal();
  }
}

async function handleSubmit() {
  if (!username.value || !password.value) return;
  const result = await login(username.value.trim(), password.value);
  if (result.success) {
    username.value = "";
    password.value = "";
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-dialog {
  position: relative;
  background: var(--bg, #ffffff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 14px;
  width: 100%;
  max-width: 440px;
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
}

@keyframes slideUp {
  from {
    transform: translateY(12px) scale(0.97);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.modal-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text, #6b7280);
  font-size: 1.1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.modal-close-btn:hover:not(:disabled) {
  background: rgba(156, 163, 175, 0.15);
  color: var(--text-h, #111827);
}

.modal-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.modal-icon {
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
}

.modal-title {
  font-size: 1.45rem;
  font-weight: 700;
  margin: 0 0 0.35rem;
  color: var(--text-h, #111827);
}

.modal-subtitle {
  font-size: 0.88rem;
  color: var(--text, #6b7280);
  margin: 0;
}

.alert-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  border-radius: 8px;
  font-size: 0.88rem;
  margin-bottom: 1.25rem;
}

@media (prefers-color-scheme: dark) {
  .alert-error {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.3);
    color: #fca5a5;
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  text-align: left;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-label {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-h, #374151);
}

.toggle-pwd-btn {
  background: none;
  border: none;
  font-size: 0.78rem;
  color: #6366f1;
  cursor: pointer;
  padding: 0;
  font-weight: 500;
}

.toggle-pwd-btn:hover {
  text-decoration: underline;
}

.form-input {
  width: 100%;
  padding: 0.65rem 0.85rem;
  font-size: 0.95rem;
  border: 1px solid var(--border, #d1d5db);
  border-radius: 8px;
  background: var(--bg, #fff);
  color: var(--text-h, #111827);
  box-sizing: border-box;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.btn-block {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-lg {
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.form-footer {
  margin-top: 0.5rem;
  text-align: center;
}

.hint-text {
  font-size: 0.8rem;
  color: var(--text, #6b7280);
  background: rgba(156, 163, 175, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
}

.hint-text code {
  font-size: 0.78rem;
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
}
</style>

