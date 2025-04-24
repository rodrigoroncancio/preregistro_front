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
            path: "fichaacuerdofinal", // Ruta relativa al path padre ("/catatumbo/asociaciones")
            name: "public-argelia-ficha2",
            component: () => import(/* webpackChunkName: "CatatumboAsociaciones" */ "@/modules/public/pages/argelia/formficha2.vue"),
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
        path: "narino", // Ruta relativa al path padre ("/catatumbo")
        name: "public-narino",
        component: () => import("@/modules/public/pages/narino/index.vue"), // Añade un componente para el layout de Catatumbo
        children: [
          {
            path: "iniciotumaco", // Ruta raíz relativa al path padre ("/catatumbo")
            name: "public-narino-inicio",
            component: () => import(/* webpackChunkName: "CatatumboIndex" */ "@/modules/public/pages/narino/iniciotumaco.vue"),
          },
          {
            path: "inicioroberto", // Ruta raíz relativa al path padre ("/catatumbo")
            name: "public-narino-inicioroberto",
            component: () => import(/* webpackChunkName: "CatatumboIndex" */ "@/modules/public/pages/narino/inicioroberto.vue"),
          },
          {
            path: "iniciosamaniego", // Ruta raíz relativa al path padre ("/catatumbo")
            name: "public-narino-iniciosamaniego",
            component: () => import(/* webpackChunkName: "CatatumboIndex" */ "@/modules/public/pages/narino/iniciosamaniego.vue"),
          },
          {
            path: "tumaco/preregistro", // Ruta raíz relativa al path padre ("/catatumbo")
            name: "public-narino-tumaco",
            component: () => import(/* webpackChunkName: "CatatumboIndex" */ "@/modules/public/pages/narino/tumacopreregistro.vue"),
          },
          {
            path: "robertopayan/preregistro", // Ruta raíz relativa al path padre ("/catatumbo")
            name: "public-narino-robertopayan",
            component: () => import(/* webpackChunkName: "CatatumboIndex" */ "@/modules/public/pages/narino/robertopreregistro.vue"),
          },
          {
            path: "samaniego/preregistro", // Ruta raíz relativa al path padre ("/catatumbo")
            name: "public-narino-samaniego",
            component: () => import(/* webpackChunkName: "CatatumboIndex" */ "@/modules/public/pages/narino/samaniegopreregistro.vue"),
          }
        ]
      },
      {
        path: "putumayo", // Ruta relativa al path padre ("/catatumbo")
        name: "public-putumayo",
        component: () => import("@/modules/public/pages/putumayo/index.vue"), // Añade un componente para el layout de Catatumbo
        children: [
          {
            path: "valleguamez/preregistro", // Ruta raíz relativa al path padre ("/catatumbo")
            name: "public-putumayo-valleguamez",
            component: () => import(/* webpackChunkName: "CatatumboIndex" */ "@/modules/public/pages/putumayo/valleguamezpreregistro.vue"),
          }
        ]
      },
      {
        path: "choco", // Ruta relativa al path padre ("/catatumbo")
        name: "public-choco",
        component: () => import("@/modules/public/pages/choco/index.vue"), // Añade un componente para el layout de Catatumbo
        children: [
          {
            path: "riosucio/preregistro", // Ruta raíz relativa al path padre ("/catatumbo")
            name: "public-putumayo-valleguamez",
            component: () => import(/* webpackChunkName: "CatatumboIndex" */ "@/modules/public/pages/choco/riosuciopreregistro.vue"),
          }
        ]
      },
      {
        path: "antioquia", // Ruta relativa al path padre ("/catatumbo")
        name: "public-antioquia",
        component: () => import("@/modules/public/pages/choco/index.vue"), // Añade un componente para el layout de Catatumbo
        children: [
          {
            path: "ituango/preregistro", // Ruta raíz relativa al path padre ("/catatumbo")
            name: "public-antioquia-ituango",
            component: () => import(/* webpackChunkName: "CatatumboIndex" */ "@/modules/public/pages/antioquia/ituangopreregistro.vue"),
          }
        ]
      },
      {
        path: "valle", // Ruta relativa al path padre ("/catatumbo")
        name: "public-valle",
        component: () => import("@/modules/public/pages/choco/index.vue"), // Añade un componente para el layout de Catatumbo
        children: [
          {
            path: "buenaventura/preregistro", // Ruta raíz relativa al path padre ("/catatumbo")
            name: "public-valle-buenaventura",
            component: () => import(/* webpackChunkName: "CatatumboIndex" */ "@/modules/public/pages/valle/buenaventurapreregistro.vue"),
          }
        ]
      },
      {
        path: "vichada", // Ruta relativa al path padre ("/catatumbo")
        name: "public-vichada",
        component: () => import("@/modules/public/pages/choco/index.vue"), // Añade un componente para el layout de Catatumbo
        children: [
          {
            path: "cumaribo/preregistro", // Ruta raíz relativa al path padre ("/catatumbo")
            name: "public-vichada-cumaribo",
            component: () => import(/* webpackChunkName: "CatatumboIndex" */ "@/modules/public/pages/vichada/cumaribopreregistro.vue"),
          }
        ]
      },      
      {
        path: "catatumbo", // Ruta relativa al path padre ("/catatumbo")
        name: "public-catatumbo",
        component: () => import("@/modules/public/pages/catatumbo/index.vue"), // Añade un componente para el layout de Catatumbo
        children: [
          {
            path: "inicio", // Ruta raíz relativa al path padre ("/catatumbo")
            name: "public-catatumbo-inicio1",
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
            path: "asociaciones/inscripcion", // Ruta relativa al path padre ("/catatumbo/form2")
            name: "public-catatumbo-asociaciones-inscripcion",
            component: () => import(/* webpackChunkName: "CatatumboForm2" */ "@/modules/public/pages/catatumbo/formasociaciones.vue"),
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
          {
            path: "preregistro", // Ruta relativa al path padre ("/catatumbo/asociaciones")
            name: "public-catatumbo-preregistro",
            component: () => import(/* webpackChunkName: "CatatumboAsociaciones" */ "@/modules/public/pages/catatumbo/formfichapreregistro2.vue"),
          },
          {
            path: "familiasproductores/preregistro", // Ruta relativa al path padre ("/catatumbo/asociaciones")
            name: "public-catatumbo-preregfamiliaproductores",
            component: () => import(/* webpackChunkName: "CatatumboAsociaciones" */ "@/modules/public/pages/catatumbo/formfamiliaproductores.vue"),
          },
          {
            path: "familiasdesplazados/preregistro", // Ruta relativa al path padre ("/catatumbo/asociaciones")
            name: "public-catatumbo-preregfamiliadesplazados",
            component: () => import(/* webpackChunkName: "CatatumboAsociaciones" */ "@/modules/public/pages/catatumbo/formfamiliadesplazados.vue"),
          },
          {
            path: "fichaacuerdofase2", // Ruta relativa al path padre ("/catatumbo/asociaciones")
            name: "public-catatumbo-ficha2",
            component: () => import(/* webpackChunkName: "CatatumboAsociaciones" */ "@/modules/public/pages/catatumbo/formficha2.vue"),
          },
          {
            path: "vercupos",
            name: "public-catatumbo-vercupos",
            component: () => import( /* webpackChunkName: "CatatumboIndex" */ "@/modules/public/pages/catatumbo/vercupos.vue"),
          }
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
