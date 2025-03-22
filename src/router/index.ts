import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// import publicRouter from "../modules/public/router";
import authRouter from "../modules/auth/router";
import coreRouter from "../modules/core/router";
import pnisRouter from "../modules/pnis/router";

import useGlobalState from "../stores/global";

const routes: RouteRecordRaw[] = [
  // {
  //   path: "/",
  //   meta: { requiresAuth: false },
  //   ...publicRouter,
  // },
  {
    path: "/", // Añade el path raíz
    meta: { requiresAuth: false },
    name: "public",
    component: () => import("@/layouts/public.vue"),
    children: [
      {
        path: "", // Ruta raíz relativa al path padre ("/")
        name: "public-index",
        component: () => import(/* webpackChunkName: "PublicIndex" */ "@/modules/public/pages/index.vue"),
      },
      {
        path: "argelia", // Ruta relativa al path padre ("/argelia")
        name: "public-argelia",
        component: () => import("@/modules/public/pages/argelia/index.vue"), // Añade un componente para el layout de argelia
        children: [
          {
            path: "", // Ruta raíz relativa al path padre ("/catatumbo")
            name: "public-argelia-index",
            component: () => import(/* webpackChunkName: "argeliaIndex" */ "@/modules/public/pages/argelia/index.vue"),
          },
          {
            path: "fichaacuerdo", // Ruta relativa al path padre ("/catatumbo/asociaciones")
            name: "public-argelia-ficha",
            component: () => import(/* webpackChunkName: "CatatumboAsociaciones" */ "@/modules/public/pages/argelia/form1.vue"),
          },
          {
            path: "docfirmado/:id", // Ruta relativa al path padre ("/catatumbo/asociaciones")
            name: "public-doc-argelia-firmado",
            component: () => import(/* webpackChunkName: "docfirmado" */ "@/modules/public/pages/argelia/docfirmado.vue"),
          },
          {
            path: "vercupos",
            name: "public-argelia-vercupos",
            component: () => import( /* webpackChunkName: "CatatumboIndex" */ "@/modules/public/pages/argelia/vercupos.vue"),
          }
        ],
      },
      {
        path: "catatumbo", // Ruta relativa al path padre ("/catatumbo")
        name: "public-catatumbo",
        component: () => import("@/modules/public/pages/catatumbo/index.vue"), // Añade un componente para el layout de Catatumbo
        children: [
          {
            path: "", // Ruta raíz relativa al path padre ("/catatumbo")
            name: "public-catatumbo-inicio",
            component: () => import(/* webpackChunkName: "CatatumboIndex" */ "@/modules/public/pages/catatumbo/inicio.vue"),
          },
          {
            path: "", // Ruta raíz relativa al path padre ("/catatumbo")
            name: "public-catatumbo-index",
            component: () => import(/* webpackChunkName: "CatatumboIndex" */ "@/modules/public/pages/catatumbo/index.vue"),
          },
          {
            path: "docfirmado/:id", // Ruta relativa al path padre ("/catatumbo/asociaciones")
            name: "public-doc-firmado",
            component: () => import(/* webpackChunkName: "docfirmado" */ "@/modules/public/pages/catatumbo/docfirmado.vue"),
          },
          {
            path: "asociaciones", // Ruta relativa al path padre ("/catatumbo/asociaciones")
            name: "public-catatumbo-asociaciones",
            component: () => import(/* webpackChunkName: "CatatumboAsociaciones" */ "@/modules/public/pages/catatumbo/asociaciones.vue"),
          },
          {
            path: "form1", // Ruta relativa al path padre ("/catatumbo/form1")
            name: "public-catatumbo-form1",
            component: () => import(/* webpackChunkName: "CatatumboForm1" */ "@/modules/public/pages/catatumbo/form1.vue"),
          },
          {
            path: "form2", // Ruta relativa al path padre ("/catatumbo/form2")
            name: "public-catatumbo-form2",
            component: () => import(/* webpackChunkName: "CatatumboForm2" */ "@/modules/public/pages/catatumbo/form2.vue"),
          },
          {
            path: "form3", // Ruta relativa al path padre ("/catatumbo/form3")
            name: "public-catatumbo-form3",
            component: () => import(/* webpackChunkName: "CatatumboForm3" */ "@/modules/public/pages/catatumbo/form3.vue"),
          },
          {
            path: "form4", // Ruta relativa al path padre ("/catatumbo/form4")
            name: "public-catatumbo-form4",
            component: () => import(/* webpackChunkName: "CatatumboForm4" */ "@/modules/public/pages/catatumbo/form4.vue"),
          },
          {
            path: "form5", // Ruta relativa al path padre ("/catatumbo/form5")
            name: "public-catatumbo-form5",
            component: () => import(/* webpackChunkName: "CatatumboForm5" */ "@/modules/public/pages/catatumbo/form5.vue"),
          },
          {
            path: "fichaacuerdo", // Ruta relativa al path padre ("/catatumbo/asociaciones")
            name: "public-catatumbo-ficha",
            component: () => import(/* webpackChunkName: "CatatumboAsociaciones" */ "@/modules/public/pages/catatumbo/formficha.vue"),
          },
        ],
      },
      {
        path: "argeliainicio", // Ruta relativa al path padre ("/argelia")
        name: "public-argeliainicio",
        component: () => import(/* webpackChunkName: "PublicArgelia" */ "@/modules/public/pages/argelia.vue"),
      },
      {
        path: "dashboard", // Ruta relativa al path padre ("/dashboard")
        name: "public-dashboard",
        component: () => import(/* webpackChunkName: "PublicDashboard" */ "@/modules/public/pages/dashboard.vue"),
      },
      {
        path: "cauca", // Ruta relativa al path padre ("/cauca")
        name: "public-cauca",
        component: () => import(/* webpackChunkName: "PublicCauca" */ "@/modules/public/pages/cauca.vue"),
      },
      {
        path: "listafichas", // Ruta relativa al path padre ("/listafichas")
        name: "public-listafichas",
        component: () => import(/* webpackChunkName: "PublicListafichas" */ "@/modules/pnis/pages/listafichas.vue"),
      },
      {
        path: "vertest", // Ruta relativa al path padre ("/listafichas")
        name: "public-vertest",
        component: () => import(/* webpackChunkName: "PublicListafichas" */ "@/modules/public/pages/argelia/testSurvey.vue"),
      },
    ],
  },
  {
    path: "/auth",
    meta: { requiresAuth: false },
    ...authRouter,
  },
  {
    path: "/core",
    meta: { requiresAuth: true },
    ...coreRouter,
  },
  {
    path: "/pnis",
    meta: { requiresAuth: true },
    ...pnisRouter,
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/layouts/public.vue" ),
    children: [{
      path: "",
      component: () => import("@/modules/public/pages/error.vue"),
    }],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  const globalState = useGlobalState();
  if (to.meta.requiresAuth && !globalState.value.auth) {
    next({ name: "auth-login" });
  } else {
    next();
  }
});

export default router;
