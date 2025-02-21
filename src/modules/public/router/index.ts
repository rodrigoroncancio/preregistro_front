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
      component: () => import( /* webpackChunkName: "PublicCatatumbo" */ "@/modules/public/pages/catatumbo/index.vue"),
    },
    {
      path: "catatumbo-asociaciones",
      name: "public-catatumbo-asociaciones",
      component: () => import( /* webpackChunkName: "PublicCatatumboAsociaciones" */ "@/modules/public/pages/catatumbo-asociaciones.vue"),
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