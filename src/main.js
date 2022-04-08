import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as echarts from 'echarts'
import * as EleIcons from '@element-plus/icons-vue'
const app = createApp(App);
for (const name in EleIcons) {
    app.component(name, EleIcons[name])
}
app.config.globalProperties.$echarts = echarts
app.use(router)
    .mount('#app')
