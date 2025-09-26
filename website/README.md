# QIRS Housing Solution

A modern real estate website showcasing property listings with advanced search and filtering capabilities.

## Features

- Modern and responsive design
- Real-time property search and advanced filters (type, price, bedrooms)
- Property listings with detailed info and share/save actions
- Property detail pages with galleries and URL-driven content
- Admin area (demo) with session expiry and idle timeout
- Smooth animations (AOS, Animate.css) and carousels (Swiper)

## Technologies Used

- HTML5, CSS3, JavaScript (ES6+)
- AOS, Animate.css, Swiper.js (self-hosted under `templates/vendor/`)
- Font Awesome (self-hosted) and Google Fonts

## Project Structure

```
website/
  admin/
    dashboard.html, dashboard.css, dashboard.js
    login.html, index.html
    auth.js, login.js
  templates/
    html/ (public pages)
    css/  (styles)
    js/   (scripts)
    vendor/
      aos/, swiper/, animate/, fa/
  README.md, LICENSE, logo.png
```

## Local Development

- Open `templates/html/index.html` in a browser to view the site.
- Admin demo: open `admin/login.html` (username: `admin`, password: `admin123`).
- No backend is required; admin functions are front-end demos only.

## Security Hardening

- Content Security Policy (CSP) added across pages:
  - `default-src 'self'`
  - Only Google Fonts allowed for external styles; all other assets are self-hosted
  - `script-src 'self'` (no inline scripts)
  - `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`
- Removed inline event handlers and inline script blocks
- Replaced risky `innerHTML` insertion in admin with safe DOM APIs
- Admin session model:
  - Login sets `sessionStorage` flags with 30m expiry and tracks last activity
  - Idle logout after 10m of inactivity
  - `admin/auth.js` enforces expiry/idle and redirects to login

## Vendor Assets (Self-hosted)

- Located under `templates/vendor/`
  - AOS: `aos.css`, `aos.js`
  - Swiper: `swiper-bundle.min.css`, `swiper-bundle.min.js`
  - Animate.css: `animate.min.css`
  - Font Awesome: `fa/css/all.min.css`, `fa/webfonts/*.woff2`

## Scripts Overview

- `templates/js/app.js`:
  - Binds UI actions (save/share/view details), search and filter logic
  - Initializes AOS and Swiper when present
  - Handles index page CTAs and logo fallback
- `templates/js/property-detail.js`:
  - Gallery thumbnails, form submission UX
  - Populates details from URL params
  - Mobile nav toggle for the detail page
- `admin/auth.js`: admin session enforcement
- `admin/login.js`: admin login demo logic

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit (`git commit -m 'Add YourFeature'`)
4. Push and open a Pull Request

## License

MIT License (see `LICENSE`).

## Contact

kidus mesay - kidusmesay0@gmail.com
Project Link: https://github.com/yourusername/qirs-housing-solution 