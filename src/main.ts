import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

// prettier-ignore
createApp(App)
  .use(router)
  .mount('#app')
