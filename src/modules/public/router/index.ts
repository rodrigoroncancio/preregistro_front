const router = {
  name: "public",
  component: () => import("@/layouts/public.vue" ),
  children: [
    {
      path: "",
      name: "public-index",
      component: () => import( /* webpackChunkName: "PublicIndex" */ "@/modules/public/pages/index.vue"),
    },
    {
      path: "catatumbo",
      name: "public-catatumbo",
      children: [
        {
          path: "",
          name: "public-catatumbo-index",
          component: () => import( /* webpackChunkName: "CatatumboIndex" */ "@/modules/public/pages/catatumbo/index.vue"),
        },
        {
          path: "asociaciones",
          name: "public-catatumbo-asociaciones",
          component: () => import( /* webpackChunkName: "CatatumboAsociaciones" */ "@/modules/public/pages/catatumbo/asociaciones.vue"),
        },
        {
          path: "form1",
          name: "public-catatumbo-form1",
          component: () => import( /* webpackChunkName: "CatatumboForm1" */ "@/modules/public/pages/catatumbo/form1.vue"),
        },
      ]
    },
    {
      path: "argelia",
      name: "public-argelia",
      component: () => import( /* webpackChunkName: "PublicArgelia" */ "@/modules/public/pages/argelia.vue"),
    },
    {
      path: "dashboard",
      name: "public-dashboard",
      component: () => import( /* webpackChunkName: "PublicDashboard" */ "@/modules/public/pages/dashboard.vue"),
    },
    {
      path: "cauca",
      name: "public-cauca",
      component: () => import( /* webpackChunkName: "PublicCauca" */ "@/modules/public/pages/cauca.vue"),
    },
    {
      path: "listafichas",
      name: "public-listafichas",
      component: () => import( /* webpackChunkName: "PublicListafichas" */ "@/modules/public/pages/listafichas.vue"),
    },
  ],
};

export default router;