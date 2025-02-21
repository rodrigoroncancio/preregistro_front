import App from "./App.vue";
import { createApp } from "vue";
import { registerPlugins } from "@/plugins";

import "vue-loading-overlay/dist/css/index.css";
import "vue3-toastify/dist/index.css";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import "./assets/scss/app.scss";

const app = createApp(App);
registerPlugins(app);
app.mount("#app");
