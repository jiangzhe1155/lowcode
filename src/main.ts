import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:windi.css'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import CardConfig from '@/components/card/CardConfig.vue'
import mitt from 'mitt'
import { GlobalCmComponent } from 'codemirror-editor-vue3'
import Card from '@/components/card/Card.vue'
import Page from '@/components/page/Page.vue'
import Dialog from '@/components/dialog/Dialog.vue'
import Root from '@/components/root/Root.vue'
import Table from '@/components/table/Table.vue'
import TableConfig from '@/components/table/TableConfig.vue'


export const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(GlobalCmComponent)

app.mount('#app')

app.config.globalProperties.mittBus = mitt()
app.component('Root', Root)
app.component('Page', Page)
app.component('Card', Card)
app.component('Dialog', Dialog)
app.component('Table', Table)

app.component('CardConfig', CardConfig)
app.component('TableConfig', TableConfig)
