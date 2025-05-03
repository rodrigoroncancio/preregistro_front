const router = {
  name: "renhacemos",
  component: () => import("@/layouts/default.vue" ),
  children: [
    {
      path: "catatumbo/registro/:id",
      name: "catatumbo-registro",
      component: () => import( /* webpackChunkName: "PnisUserspnis" */ "@/modules/renhacemos/pages/catatumboregistro.vue"),
    },
    {
      path: "catatumbo/registro/open/:id",
      name: "catatumbo-registro_open",
      component: () => import( /* webpackChunkName: "PnisUserspnis" */ "@/modules/renhacemos/pages/catatumboregistro_open.vue"),
    }
  ],
};

export default router;