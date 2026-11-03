import frappe

@frappe.whitelist()
def get_dashboard_stats():
    """Returns sample statistics and session details to the Vue component."""
    return {
        "user": frappe.session.user,
        "site": frappe.local.site,
        "app_title": "Testing App",
        "message": "Hello from Frappe Python Backend!",
        "stats": {
            "total_users": frappe.db.count("User"),
            "total_roles": frappe.db.count("Role"),
        }
    }

