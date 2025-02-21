const router = {
  name: "pnis",
  component: () => import("@/layouts/default.vue" ),
  children: [
    {
      path: "survey",
      name: "pnis-survey",
      component: () => import( /* webpackChunkName: "PnisSurvey" */ "@/modules/pnis/pages/survey.vue"),
    },
    {
      path: "userspnis",
      name: "pnis-userspnis",
      component: () => import( /* webpackChunkName: "PnisUserspnis" */ "@/modules/pnis/pages/userspnis.vue"),
    },
    {
      path: "fichaacuerdo/:id",
      name: "pnis-fichaacuerdo",
      component: () => import( /* webpackChunkName: "PnisFichaacuerdo" */ "@/modules/pnis/pages/fichaacuerdo.vue"),
    },
  ],
};

export default router;