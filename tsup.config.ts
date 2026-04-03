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
  // IIFE for Web Component CDN (self-contained, includes React)
  {
    entry: { widget: 'src/widget-entry.ts' },
    format: ['iife'],
    globalName: 'MetVerseMap',
    outDir: 'dist',
    noExternal: [/.*/],
    minify: true,
    sourcemap: true,
    define: {
      'process.env.NODE_ENV': '"production"',
    },
    platform: 'browser',
    esbuildOptions(options) {
      options.jsx = 'transform'
    },
  },
])
