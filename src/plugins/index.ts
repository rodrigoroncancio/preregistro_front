// Plugins
import { loadFonts } from "./webfontloader";
import vuetify from "./vuetify";
import router from "../router";
import { createPinia } from "pinia";
import Vue3Toasity from "vue3-toastify";
import axios from "axios";
import i18n from './i18n'

import type { App } from "vue";
import useAuth from "@/modules/auth/composables/useAuth";
import useConst from "@/composables/useConst";

const uConst = useConst();
console.log(uConst);
axios.defaults.baseURL = uConst.baseApi;
console.log(axios.defaults.baseURL);

axios.interceptors.request.use((config) => {
  const auth = useAuth();
  if (auth.isAuthenticated() && auth.getToken() != "") {
    config.headers["Authorization"] = 'Bearer ' + auth.getToken();
  } else {
    if (uConst.apiKey) {
      config.headers["Authorization"] = 'Api-Key ' + uConst.apiKey;
    }
  }
  return config
})

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.status == 401) {
      const auth = useAuth();
      if (auth.isAuthenticated() && auth.getToken() != "") {
        const auth = useAuth();
        auth.authLogOut();
      }
    }
    // Aquí puedes manejar el error como quieras
    // if (error.response) {
    //   console.log('Respuesta del servidor:', error.response);
    // } else if (error.request) {
    //   console.log('No hubo respuesta del servidor:', error.request);
    // } else {
    //   console.log('Error en la configuración de la solicitud:', error.message);
    // }
    return Promise.reject(error); // Asegura que el error se propague
  }
);

export function registerPlugins(app: App) {
  loadFonts();
  app
    .use(i18n)
    .use(vuetify)
    .use(router)
    .use(createPinia())
    .use(Vue3Toasity, {
      autoClose: 5000,
    })
}
