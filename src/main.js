import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
import router from './router'
import store from './store'
import "@/assets/style/reset.css"
import flexible from 'amfe-flexible'

import '@/router/permission'

// 使用element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/style/_element.scss'
import zhLocale from 'element-plus/es/locale/lang/zh-cn'

// 重写element-plus中ElMessage弹框
import msg from '@/utils/resetMessage.js'
app.config.globalProperties.$msg = msg

// 引入svg
import '@/assets/svg/index'
import Svg from '@/assets/svg/index.vue'
app.component('Svg', Svg)


app.use(store).use(router).use(flexible).use(ElementPlus, { locale: zhLocale, size: 'default', zIndex: 2000 }).mount('#app')
