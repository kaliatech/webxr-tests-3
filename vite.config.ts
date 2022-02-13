import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslintPlugin(),
  ],
  server: {
    port: 3443,
    https: true,
    // Uncomment to allow access from network (or use `npm run dev -- -- host=0.0.0.0`)
    // host: '0.0.0.0',
  },
})
