# ACT-AI — MUET Resistance Tutor

An interactive, static HTML simulator and learning aid for resistance, Ohm's law, resistor color codes, and series/parallel networks. This project is a single-page web app that uses TailwindCSS, Font Awesome, and Chart.js via CDNs and can be hosted as a static site (GitHub Pages or Vercel).

## Features

- Atomic resistance simulator with microscopic electron drift visualization
- Ohm's Law playground and series/parallel solver
- Resistor color decoder and exam-prep quiz
- Temperature chamber with Chart.js visualizations
- Clean, responsive UI built with Tailwind CSS

## Files of interest

- `muet_resistance_tutor.html` — main static page (rename to `index.html` to serve from site root)

## Run locally

1. Open the file directly in your browser:

```powershell
start muet_resistance_tutor.html
```

2. (Recommended) Rename to `index.html` so it serves at the site root:

```powershell
ren muet_resistance_tutor.html index.html
```

## Host on GitHub Pages

1. Create a GitHub repository and push your project. Example commands (PowerShell):

```powershell
git init
git add .
git commit -m "Add ACT-AI resistance tutor"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

2. On GitHub: go to Settings → Pages, choose branch `main` and folder `/ (root)`, then Save.
3. Your site will be available at `https://<your-username>.github.io/<repo-name>/` (or append `muet_resistance_tutor.html` if you left the original filename).

## Deploy with Vercel

1. Sign in to Vercel and import the GitHub repo.
2. Choose "Other" or "Static Site" as the framework.
3. Deploy — Vercel will provide a public URL and automatic updates on push.

## Notes & Best Practices

- Keep external assets on CDNs as-is for simplicity; for offline builds consider vendoring them.
- Ensure any large assets (images) are optimized for web performance.
- If you want a custom domain, both GitHub Pages and Vercel support DNS setup.

## Contributing

Contributions are welcome — open an issue or submit a pull request.

## License

This repository has no license specified. Add a license file (for example, `LICENSE`) if you want to allow reuse. A permissive option is the MIT License.

