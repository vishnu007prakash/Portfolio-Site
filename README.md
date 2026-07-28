# Vishnu Prakash K — Portfolio

A premium, animated single-page portfolio for a Data Analyst / BI Developer.
Pure HTML/CSS/JS — no build step, no dependencies to install.

## Structure
```
index.html
css/style.css
js/script.js
assets/profile.jpg      → your photo
assets/ring.png         → decorative hero ring graphic
assets/Vishnuprakash_K_Resume.pdf  → downloadable resume (linked from the "Download résumé" button)
```

## Run locally
Just open `index.html` in a browser. For best results (some browsers restrict
local file access), serve it with a tiny local server:
```
python3 -m http.server 8080
```
then visit `http://localhost:8080`.

## Deploy on GitHub Pages
1. Create a new GitHub repo, e.g. `vishnu-portfolio`.
2. Push all files in this folder to the repo root (so `index.html` sits at the top level).
3. In the repo: **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**, branch `main`, folder `/ (root)`.
4. Save. Your site will be live at `https://<your-username>.github.io/vishnu-portfolio/` within a minute or two.

## Deploy on Hostinger
1. Log in to **hPanel → Websites → Manage** → **File Manager** (or connect via FTP/SFTP with FileZilla).
2. Open the `public_html` folder for your domain (delete/back up any default `index.html` placed there).
3. Upload the entire contents of this folder (`index.html`, `css/`, `js/`, `assets/`) directly into `public_html` — keep the folder structure intact.
4. Visit your domain — it should load immediately, no server config needed since this is a static site.

## Updating content later
- Text and section content: edit `index.html` directly — everything is in plain, labeled sections (`hero`, `overview`, `reports`, `dashboards`, `metrics`, `credentials`, `contact`).
- Colors/fonts: all design tokens live at the top of `css/style.css` under `:root`.
- To swap your photo: replace `assets/profile.jpg` with a new square-ish image of the same filename.
- To update your resume: replace `assets/Vishnuprakash_K_Resume.pdf` with a new file of the same filename (or update the `href` in the "Download résumé" button in `index.html`).

## Notes
- Fully responsive (mobile, tablet, desktop) with a collapsing nav on small screens.
- Respects `prefers-reduced-motion` for accessibility.
- Fonts are loaded from Google Fonts via CDN (Space Grotesk, Inter, JetBrains Mono) — requires an internet connection to render the intended typefaces (falls back gracefully otherwise).
