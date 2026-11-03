import { createApp } from "vue";
import TestingDashboard from "./TestingDashboard.vue";

frappe.provide("frappe.testing");

frappe.testing.render_dashboard = function (target) {
	const app = createApp(TestingDashboard);
	app.mount(target);
	return app;
};

