const router = {
  name: "pnis",
  component: () => import("@/layouts/default.vue" ),
  children: [
    {
      path: "fichaacuerdo",
      name: "pnis-fichaacuerdo",
      component: () => import( /* webpackChunkName: "PnisUserspnis" */ "@/modules/pnis/pages/fichaacuerdo.vue"),
    },
    {
      path: "fichaacuerdo/open/:id",
      name: "pnis-fichaacuerdo-open",
      component: () => import( /* webpackChunkName: "PnisFichaacuerdoOpen" */ "@/modules/pnis/pages/fichaacuerdo-open.vue"),
    },
  ],
};

export default router;