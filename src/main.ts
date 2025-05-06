import App from "./App.vue";
import { createApp } from "vue";
import { registerPlugins } from "@/plugins";

import "vue-loading-overlay/dist/css/index.css";
import "vue3-toastify/dist/index.css";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
// import "./assets/scss/app.scss";
import WidgetCoordinates from "@/components/expSurveyjsWidgets/WidgetCoordinates.vue";

const app = createApp(App);
registerPlugins(app);
app.component("survey-coordinates-question", WidgetCoordinates);
app.mount("#app");
