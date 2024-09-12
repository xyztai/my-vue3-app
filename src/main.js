import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
axios.defaults.baseURL = '/e'
axios.defaults.proxy = {
  host: '142.171.151.123',
  port: 51666,
  protocol: 'http'
}

createApp(App).mount('#app')
