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
      path: "argelia",
      name: "public-argelia",
      children: [
        {
          path: "",
          name: "public-argelia-index",
          component: () => import( /* webpackChunkName: "argeliaIndex" */ "@/modules/public/pages/argelia/index.vue"),
        },
        {
          path: "argelia/fichaacuerdo",
          name: "public-argelia-fichaacuerdo",
          component: () => import( /* webpackChunkName: "CatatumboIndex" */ "@/modules/public/pages/argelia/form1.vue"),
        },
        {
          path: "argelia/vercupos",
          name: "public-argelia-vercupos",
          component: () => import( /* webpackChunkName: "CatatumboIndex" */ "@/modules/public/pages/argelia/vercupos.vue"),
        }
      ]
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
        {
          path: "form2",
          name: "public-catatumbo-form2",
          component: () => import( /* webpackChunkName: "CatatumboForm2" */ "@/modules/public/pages/catatumbo/form2.vue"),
        },
        {
          path: "form3",
          name: "public-catatumbo-form3",
          component: () => import( /* webpackChunkName: "CatatumboForm3" */ "@/modules/public/pages/catatumbo/form3.vue"),
        },
        {
          path: "form4",
          name: "public-catatumbo-form4",
          component: () => import( /* webpackChunkName: "CatatumboForm4" */ "@/modules/public/pages/catatumbo/form4.vue"),
        },
        {
          path: "form5",
          name: "public-catatumbo-form5",
          component: () => import( /* webpackChunkName: "CatatumboForm5" */ "@/modules/public/pages/catatumbo/form5.vue"),
        },
      ]
    },
    {
      path: "argeliainicio",
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
    }
  ],
};

export default router;