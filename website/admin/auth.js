// Redirect to login if not authenticated and enforce session expiry/idle time
(function enforceAdminSession() {
	const redirectToLogin = () => { window.location.replace('login.html'); };

	const now = Date.now();
	const localLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
	const sessionLoggedIn = sessionStorage.getItem('admin_logged_in') === 'true';
	const expiresAt = parseInt(sessionStorage.getItem('admin_session_expires_at') || '0', 10);
	const lastActivity = parseInt(sessionStorage.getItem('admin_last_activity') || '0', 10);
	const idleLimitMs = 10 * 60 * 1000; // 10 minutes idle timeout

	const isExpired = !expiresAt || now > expiresAt;
	const isIdle = lastActivity && now - lastActivity > idleLimitMs;

	if (!localLoggedIn || !sessionLoggedIn || isExpired || isIdle) {
		sessionStorage.clear();
		localStorage.removeItem('admin_logged_in');
		redirectToLogin();
		return;
	}

	// Refresh activity timestamp
	const touch = () => sessionStorage.setItem('admin_last_activity', String(Date.now()));
	['click','keypress','mousemove','scroll','touchstart'].forEach(evt => {
		document.addEventListener(evt, touch, { passive: true });
	});

	// Periodic expiry check
	setInterval(() => {
		const nowTick = Date.now();
		const exp = parseInt(sessionStorage.getItem('admin_session_expires_at') || '0', 10);
		const last = parseInt(sessionStorage.getItem('admin_last_activity') || '0', 10);
		if (!exp || nowTick > exp || (last && nowTick - last > idleLimitMs)) {
			sessionStorage.clear();
			localStorage.removeItem('admin_logged_in');
			redirectToLogin();
		}
	}, 30000);
})(); 