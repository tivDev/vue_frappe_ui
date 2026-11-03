frappe.pages['router-demo'].on_page_load = function (wrapper) {
	let page = frappe.ui.make_app_page({
		parent: wrapper,
		title: __('Vue Router Demo'),
		single_column: true
	});

	frappe.require('router_demo.bundle.js', () => {
		if (frappe.vue_frappe_ui && frappe.vue_frappe_ui.render_router_demo) {
			frappe.vue_frappe_ui.render_router_demo(page.main[0]);
		}
	});
};

