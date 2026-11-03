import { createApp } from "vue";
import { createRouter, createMemoryHistory } from "vue-router";
import RouterDemoApp from "./RouterDemoApp.vue";
import OverviewTab from "./router_views/OverviewTab.vue";
import AnalyticsTab from "./router_views/AnalyticsTab.vue";
import SettingsTab from "./router_views/SettingsTab.vue";

const routes = [
	{ path: "/", name: "Overview", component: OverviewTab },
	{ path: "/analytics", name: "Analytics", component: AnalyticsTab },
	{ path: "/settings", name: "Settings", component: SettingsTab },
];

frappe.provide("frappe.vue_frappe_ui");

frappe.vue_frappe_ui.render_router_demo = function (target) {
	const router = createRouter({
		history: createMemoryHistory(),
		routes,
	});

	const app = createApp(RouterDemoApp);
	app.use(router);
	app.mount(target);
	return app;
};

