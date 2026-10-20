# Ekattra Edge

React + Vite + Three.js (via `@react-three/fiber`). The single-page site supports legacy section deep-links (`/about`, `/services`, `/sectors`, `/engage`, `/contact`); `vercel.json` rewrites paths to `index.html` so refreshes do not 404.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

- `src/content.js` contains the site copy.
- `src/three/` contains the particle scene, shape definitions, and shaders.
- `src/styles.css` contains the design tokens and responsive styles.