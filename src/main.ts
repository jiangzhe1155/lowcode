import { createApp } from "vue";
import App from "./App.vue";
import "virtual:windi.css";
import router from "./router";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import PageContainer from '@/views/lowCode/component/PageContainer.vue'
import RootContainer from '@/views/lowCode/component/RootContainer.vue'
import ElementRender from '@/views/lowCode/component/ElementRender.vue'
import mitt from 'mitt';

const app = createApp(App);
app.use(router)
app.use(ElementPlus)
app.use(createPinia())
app.mount("#app");

app.config.globalProperties.mittBus = new mitt()

app.component('PageContainer',PageContainer) // 注册组件
app.component('RootContainer',RootContainer) // 注册组件
app.component('ElementRender',ElementRender) // 注册组件
