const router = {
  name: "renhacemos",
  component: () => import("@/layouts/default.vue" ),
  children: [
    {
      path: "catatumbo/registro/:id",
      name: "catatumbo-registro",
      component: () => import( /* webpackChunkName: "PnisUserspnis" */ "@/modules/renhacemos/pages/catatumboregistro.vue"),
    }
  ],
};

export default router;