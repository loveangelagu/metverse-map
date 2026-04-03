import { defineConfig } from 'tsup'

export default defineConfig([
  // ESM + CJS for npm consumers (React apps)
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    external: ['react', 'react-dom'],
    sourcemap: true,
    clean: true,
  },
  // IIFE for Web Component CDN (self-contained)
  {
    entry: { widget: 'src/MetVerseMapElement.ts' },
    format: ['iife'],
    globalName: 'MetVerseMap',
    outDir: 'dist',
    noExternal: ['pixi.js', 'gsap'],
    external: ['react', 'react-dom'],
    minify: true,
    sourcemap: true,
  },
])
