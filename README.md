# Pulse — Premium Medical PG Education Website

A cinematic, premium SaaS website for a medical education platform focused on NEET PG, INI-CET, and FMGE. Inspired by Poly, Linear, Arc, Raycast, Vercel, Stripe, and Apple product pages.

## Tech

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** with custom design system
- **Framer Motion** for component-level animation
- **GSAP** (available for advanced scroll)
- **Lenis** for smooth scrolling
- **Three.js + React Three Fiber + Drei** for 3D
- **lucide-react** for icons

## Design system

- Dark luxury theme (`#0A0A0A` background, `#121212` surface, `#4F8CFF` accent, `#00E5A8` mint)
- Inter / Inter Tight typography
- 60+ design tokens (colors, shadows, easings, animations)
- Glass panels, gradient borders, noise textures, particle fields
- Custom magnetic cursor, animated noise overlay, loading screen
- Custom easings: `cubic-bezier(0.16, 1, 0.3, 1)` (apple-like)

## Sections (in order)

1. **Hero** — 3D floating medical workspace (Three.js), particle field, parallax
2. **Knowledge Universe** — Poly-style floating cards, 3D depth, cursor parallax
3. **Question Bank** — Interactive MCQ dashboard, subject filters, AI explanation
4. **Video Learning** — 3D floating laptop (Three.js) with surgical video UI
5. **AI Medical Tutor** — Glassmorphism chat with typing animation
6. **Mock Test Command Center** — SVG charts, percentile rings, subject performance
7. **AI Viva Simulator** — Voice waveform, case panel, examiner conversation
8. **Success Stories** — Infinite marquee with student testimonials
9. **Feature Grid** — Bento layout of 12 features
10. **Final CTA** — Animated particle network, magnetic buttons, pricing tiers

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm start
```

## Performance

- Dynamic imports for Three.js scenes (no SSR)
- Image optimization configured in `next.config.ts`
- Code splitting via `optimizePackageImports`
- GPU-accelerated transforms only
- Respects `prefers-reduced-motion`
- Custom CSS for scrollbar, focus rings, selection

## Accessibility

- Skip-to-content link
- ARIA labels on icon-only buttons
- Reduced motion support
- Semantic HTML
- High contrast text on dark surface

## SEO

- `metadata` + `viewport` exports
- Open Graph + Twitter card
- JSON-LD Organization schema
- `robots.txt` included

## Deploy

### Vercel
```bash
vercel --prod
```

### Netlify
Build command: `npm run build`
Publish directory: `.next`

### Self-hosted
```bash
npm run build
npm start
```

## License

Private. © Pulse.
