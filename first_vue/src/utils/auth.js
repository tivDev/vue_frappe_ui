import { reactive } from "vue";

export function getCsrfToken() {
  const token = window.csrf_token;
  if (token && !token.startsWith("{{")) {
    return token;
  }
  return "";
}

export const authState = reactive({
  user: null,
  isLoggedIn: false,
  showLoginModal: false,
  checkingSession: false,
  isSubmitting: false,
  loginError: "",
});

export function openLoginModal() {
  authState.loginError = "";
  authState.showLoginModal = true;
}

export function closeLoginModal() {
  authState.showLoginModal = false;
  authState.loginError = "";
}

export async function checkSession() {
  authState.checkingSession = true;
  try {
    const res = await fetch("/api/method/frappe.auth.get_logged_user", {
      headers: {
        "Accept": "application/json",
        "X-Frappe-CSRF-Token": getCsrfToken(),
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.message && data.message !== "Guest") {
        authState.user = data.message;
        authState.isLoggedIn = true;
        return authState.user;
      }
    }
    authState.user = null;
    authState.isLoggedIn = false;
  } catch (err) {
    console.warn("Session check error:", err);
    authState.user = null;
    authState.isLoggedIn = false;
  } finally {
    authState.checkingSession = false;
  }
  return null;
}

export async function login(usr, pwd) {
  authState.isSubmitting = true;
  authState.loginError = "";

  try {
    const headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
    const csrf = getCsrfToken();
    if (csrf) {
      headers["X-Frappe-CSRF-Token"] = csrf;
    }

    const res = await fetch("/api/method/login", {
      method: "POST",
      headers,
      body: JSON.stringify({ usr, pwd }),
    });

    const data = await res.json();

    if (res.ok && (data.message === "Logged In" || data.home_page)) {
      authState.user = data.full_name || usr;
      authState.isLoggedIn = true;
      authState.showLoginModal = false;
      authState.loginError = "";
      return { success: true, user: authState.user };
    }

    const message = data.message || "Invalid username or password";
    authState.loginError = message;
    return { success: false, error: message };
  } catch (err) {
    const errorMsg = err.message || "Network error. Please try again.";
    authState.loginError = errorMsg;
    return { success: false, error: errorMsg };
  } finally {
    authState.isSubmitting = false;
  }
}

export async function logout() {
  try {
    const headers = { "Accept": "application/json" };
    const csrf = getCsrfToken();
    if (csrf) {
      headers["X-Frappe-CSRF-Token"] = csrf;
    }
    await fetch("/api/method/logout", {
      method: "POST",
      headers,
    });
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    authState.user = null;
    authState.isLoggedIn = false;
    // Reload to refresh CSRF token and session cookies cleanly
    window.location.reload();
  }
}

