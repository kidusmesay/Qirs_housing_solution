// Admin login handling (demo only with hardcoded credentials)
(function setupAdminLogin() {
	const ADMIN_USER = 'admin';
	const ADMIN_PASS = 'admin123';
	const form = document.getElementById('adminLoginForm');
	if (!form) return;
	form.addEventListener('submit', function(e) {
		e.preventDefault();
		const user = document.getElementById('username').value;
		const pass = document.getElementById('password').value;
		if (user === ADMIN_USER && pass === ADMIN_PASS) {
			const now = Date.now();
			const sessionDurationMs = 30 * 60 * 1000; // 30 minutes
			sessionStorage.setItem('admin_logged_in', 'true');
			sessionStorage.setItem('admin_session_expires_at', String(now + sessionDurationMs));
			sessionStorage.setItem('admin_last_activity', String(now));
			localStorage.setItem('admin_logged_in', 'true');
			window.location.href = 'dashboard.html';
		} else {
			document.getElementById('loginError').style.display = 'block';
		}
	});
})(); 