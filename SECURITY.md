# Security Overview

This project is a static frontend with a demo admin area (no backend). The following measures are in place to reduce client-side risk:

## Protections

- Content Security Policy (CSP)
  - default-src 'self'
  - script-src 'self' (no inline scripts)
  - style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
  - font-src 'self' https://fonts.gstatic.com
  - frame-ancestors 'none', base-uri 'self', form-action 'self'
- Self-hosted third-party assets under `templates/vendor/` (AOS, Swiper, Animate.css, Font Awesome)
- Removed inline event handlers and `innerHTML` based DOM insertion where user input is involved
- Admin session (demo):
  - 30-minute session expiry, 10-minute idle logout
  - `admin/auth.js` enforces expiry/idle and redirects to login

## Known Limitations

- No server-side backend: authentication/authorization is purely client-side and not secure for production
- CSRF/Session hardening requires server support (HttpOnly/SameSite cookies, CSRF tokens)

## Recommendations for Production

- Implement a real backend with:
  - Secure session cookies (HttpOnly, Secure, SameSite=Lax/Strict)
  - Server-rendered CSRF tokens and validation
  - Strong password hashing, rate limiting, and audit logging
- Serve with strict headers at the web server/CDN:
  - Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY (or rely on CSP frame-ancestors)
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: minimal features
- Self-host Google Fonts to remove external style/font origins and tighten CSP further

## Maintenance

- Keep vendor assets up-to-date under `templates/vendor/`
- Run a static analysis/lint and dependency review on updates
- Review CSP after any asset or feature changes 