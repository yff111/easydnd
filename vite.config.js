import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      dnd-ts: new URL('./src', import.meta.url).pathname,
    },
  },
})
