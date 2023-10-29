import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/mathrepl/',
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => ['math-field'].indexOf(tag) !== -1,
      }
    }
  })],
})
