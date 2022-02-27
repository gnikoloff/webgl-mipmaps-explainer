import glsl from 'vite-plugin-glsl'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [glsl()],
  base: '/webgl-mipmaps-explainer/',
  build: {
    outDir: 'docs',
  },
})
