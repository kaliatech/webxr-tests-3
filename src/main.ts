import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap'

// prettier-ignore
createApp(App)
  .use(router)
  .mount('#app')
