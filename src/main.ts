import { createApp } from "vue";
import App from "./App.vue";
import "virtual:windi.css";
import router from "./router";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

createApp(App).use(router)
  .use(ElementPlus)
  .use(createPinia())
  .mount("#app");
