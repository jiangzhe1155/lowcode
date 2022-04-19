import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:windi.css'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import PageContainer from '@/views/lowCode/component/PageContainer.vue'
import RootContainer from '@/views/lowCode/component/RootContainer.vue'
import CardComponent from '@/views/lowCode/component/CardComponent.vue'
import DialogComponent from '@/views/lowCode/component/DialogComponent.vue'
import CardConfig from '@/views/designer/config/CardConfig.vue'
import mitt from 'mitt'
import { GlobalCmComponent } from 'codemirror-editor-vue3'

export const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(GlobalCmComponent)

app.mount('#app')

app.config.globalProperties.mittBus = mitt()
app.component('Root', RootContainer)
app.component('Page', PageContainer)
app.component('Card', CardComponent)
app.component('Dialog', DialogComponent)
app.component('CardConfig', CardConfig)
