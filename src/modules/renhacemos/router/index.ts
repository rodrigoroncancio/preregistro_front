const router = {
  name: "renhacemos",
  component: () => import("@/layouts/default.vue" ),
  children: [
    {
      path: "catatumbo/registro",
      name: "catatumbo-registro",
      component: () => import( /* webpackChunkName: "PnisUserspnis" */ "@/modules/renhacemos/pages/catatumboregistro.vue"),
    },
    {
      path: "catatumbofase1/ficha",
      name: "catatumbo-ficha1",
      component: () => import( /* webpackChunkName: "PnisUserspnis" */ "@/modules/renhacemos/pages/catatumbofase1ficha.vue"),
    },
    {
      path: "catatumbofase2/ficha",
      name: "catatumbo-ficha2",
      component: () => import( /* webpackChunkName: "PnisUserspnis" */ "@/modules/renhacemos/pages/catatumbofase2ficha.vue"),
    },
    {
      path: "argeliafase1/registro",
      name: "argeliafase1-registro",
      component: () => import( /* webpackChunkName: "PnisUserspnis" */ "@/modules/renhacemos/pages/argeliafase1registro.vue"),
    },
    {
      path: "argeliafase2/registro",
      name: "argeliafase2-registro",
      component: () => import( /* webpackChunkName: "PnisUserspnis" */ "@/modules/renhacemos/pages/argeliafase2registro.vue"),
    },
    {
      path: "argeliafase2/ficha",
      name: "argeliafase2-ficha",
      component: () => import( /* webpackChunkName: "PnisUserspnis" */ "@/modules/renhacemos/pages/argeliafase2ficha.vue"),
    },
    {
      path: "catatumbo/registro/open/:id",
      name: "catatumbo-registro_open",
      component: () => import( /* webpackChunkName: "PnisUserspnis" */ "@/modules/renhacemos/pages/catatumboregistro_open.vue"),
    }
  ],
};

export default router;