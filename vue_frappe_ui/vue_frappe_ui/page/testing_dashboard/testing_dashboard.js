frappe.pages['testing-dashboard'].on_page_load = function (wrapper) {
	let page = frappe.ui.make_app_page({
		parent: wrapper,
		title: __('Testing Dashboard'),
		single_column: true
	});

	frappe.require('testing_dashboard.bundle.js', () => {
		frappe.testing.render_dashboard(page.main[0]);
	});
};

