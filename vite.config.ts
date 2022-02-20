import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Disable eslint cache
    // https://stackoverflow.com/a/70662931/123378
    // https://github.com/gxmari007/vite-plugin-eslint/issues/17
    eslintPlugin({ cache: false }),
  ],
  server: {
    port: 3443,
    https: true,
    // Uncomment to allow access from network (or use `npm run dev -- -- host=0.0.0.0`)
    // host: '0.0.0.0',

    // TBD
    // https://github.com/vitejs/vite/pull/5617
    hmr: {
      host: '10.9.22.222',
      port: 3443,
      protocol: 'wss'
    }
  },
})
