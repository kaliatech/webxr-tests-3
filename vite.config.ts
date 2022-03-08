import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Disable eslint cache
    // https://stackoverflow.com/a/70662931/123378
    // https://github.com/gxmari007/vite-plugin-eslint/issues/17
    eslintPlugin({ cache: false }),
    // https://github.com/jpkleemans/vite-svg-loader
    svgLoader(),
  ],
  // As of 2022-02-23, doesn't seem to be working in IDEA, even with a jsconfig.json file added. So for now,
  // seems safer to continue using relative paths.
  // https://stackoverflow.com/questions/66043612/vue3-vite-project-alias-src-to-not-working
  // https://stackoverflow.com/questions/66878723/how-to-setup-phpstorm-webstorm-to-work-with-vite-aliases
  // resolve: {
  //   alias: {
  //     "@": fileURLToPath(new URL("./src", import.meta.url)),
  //   }
  // },
  server: {
    port: 3443,
    https: true,
    // Uncomment to allow access from network (or use `npm run dev -- -- host=0.0.0.0`)
    // host: '0.0.0.0',

    // https://github.com/vitejs/vite/issues/4403
    // This solved ERR_HTTP2_PROTOCOL_ERROR
    proxy: {
      'https://localhost:3443': 'https://localhost:3443',
    },

    // https://github.com/vitejs/vite/pull/3895
    // This did not solve ERR_HTTP2_PROTOCOL_ERROR, but might still be relevant eventually
    //@ts-ignore
    maxSessionMemory: 100,
    peerMaxConcurrentStreams: 300,

    // TBD
    // https://github.com/vitejs/vite/pull/5617
    // hmr: {
    //   host: '10.9.22.222',
    //   port: 3443,
    //   protocol: 'wss'
    // }
  },
})
