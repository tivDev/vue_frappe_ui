<template>
  <div class="page-container">
    <div class="about-header">
      <h1 class="page-title">About Vue Frappe UI</h1>
      <p class="page-subtitle">
        Understanding the architecture connecting Vue 3, Vite, and Frappe Framework.
      </p>
    </div>

    <div class="about-grid">
      <!-- Workflow Card -->
      <div class="card">
        <h2 class="card-title">🚀 How It Works</h2>
        <ul class="steps-list">
          <li>
            <strong>1. Development Mode (Vite Server):</strong>
            Runs locally on port <code>8084</code> with instant Hot Module Replacement (HMR).
            All requests to <code>/api</code>, <code>/assets</code>, and <code>/login</code> are automatically proxied
            to Frappe bench.
          </li>
          <li>
            <strong>2. CSRF Token Injection:</strong>
            Served through Frappe's website route <code>/first_vue</code>. Frappe's Python controller
            (<code>www/first_vue.py</code>) injects <code>window.csrf_token</code> directly into the page context.
          </li>
          <li>
            <strong>3. Unified Session:</strong>
            Logging in authenticates against standard Frappe user accounts, allowing shared sessions
            between this SPA and Frappe Desk.
          </li>
          <li>
            <strong>4. Production Deployment:</strong>
            Running <code>yarn build</code> bundles static assets into <code>vue_frappe_ui/public/first_vue/</code>
            and updates <code>vue_frappe_ui/www/first_vue.html</code> for Frappe portal delivery.
          </li>
        </ul>
      </div>

      <!-- Quick Reference -->
      <div class="card">
        <h2 class="card-title">🛠️ Quick Command Reference</h2>
        <div class="code-block">
          <div class="code-title">Start Vite Dev Server</div>
          <pre><code>cd apps/vue_frappe_ui/first_vue
yarn dev</code></pre>
        </div>

        <div class="code-block">
          <div class="code-title">Build for Production Portal</div>
          <pre><code>cd apps/vue_frappe_ui/first_vue
yarn build</code></pre>
        </div>

        <div class="code-block">
          <div class="code-title">Frappe Portal URL</div>
          <pre><code>http://&lt;your-site&gt;:8000/first_vue</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4rem;
}

.about-header {
  margin-bottom: 2.5rem;
  text-align: center;
}

.page-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 0.5rem;
  color: var(--text-h, #111827);
}

.page-subtitle {
  font-size: 1.05rem;
  color: var(--text, #4b5563);
}

.about-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.card {
  background: var(--bg, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 14px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0 0 1.25rem;
  color: var(--text-h, #111827);
}

.steps-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.steps-list li {
  line-height: 1.6;
  font-size: 0.95rem;
  color: var(--text, #374151);
}

.steps-list code {
  font-size: 0.85rem;
  padding: 0.15rem 0.4rem;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  border-radius: 4px;
}

.code-block {
  margin-bottom: 1.25rem;
}

.code-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.35rem;
}

.code-block pre {
  margin: 0;
  padding: 0.75rem 1rem;
  background: #1e1e2e;
  color: #cdd6f4;
  border-radius: 8px;
  font-size: 0.88rem;
  overflow-x: auto;
}
</style>

