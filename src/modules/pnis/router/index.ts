const router = {
  name: "pnis",
  component: () => import("@/layouts/default.vue" ),
  children: [
    {
      path: "personasvalidadas",
      name: "pnis-personasvalidadas",
      component: () => import( /* webpackChunkName: "PnisUserspnis" */ "@/modules/pnis/pages/personasvalidadas.vue"),
    },
    {
      path: "fichaacuerdo",
      name: "pnis-fichaacuerdo",
      component: () => import( /* webpackChunkName: "PnisUserspnis" */ "@/modules/pnis/pages/fichaacuerdo.vue"),
    },
    {
      path: "fichaacuerdo2",
      name: "pnis-fichaacuerdo2",
      component: () => import( /* webpackChunkName: "PnisUserspnis" */ "@/modules/pnis/pages/fichaacuerdo2.vue"),
    },
    {
      path: "catatumboficha",
      name: "pnis-catatumboficha",
      component: () => import( /* webpackChunkName: "PnisUserspnis" */ "@/modules/pnis/pages/catatumboficha.vue"),
    },
    {
      path: "argeliapersonas",
      name: "pnis-argeliapersonas",
      component: () => import( /* webpackChunkName: "PnisArgeliapersonas" */ "@/modules/pnis/pages/argeliapersonas.vue"),
    },
    {
      path: "argeliapersonas/open/:id",
      name: "pnis-argeliapersonas-open",
      component: () => import( /* webpackChunkName: "PnisArgeliapersonasOpen" */ "@/modules/pnis/pages/argeliapersonas-open.vue"),
    },
    {
      path: "argeliagrupo",
      name: "pnis-argeliagrupo",
      component: () => import( /* webpackChunkName: "Pnisargeliagrupo" */ "@/modules/pnis/pages/argeliagrupo.vue"),
    },
    {
      path: "argeliagrupo/open/:id",
      name: "pnis-argeliagrupo-open",
      component: () => import( /* webpackChunkName: "PnisargeliagrupoOpen" */ "@/modules/pnis/pages/argeliagrupo-open.vue"),
    },
    {
      path: "catatumboindividual/:id",
      name: "pnis-catatumboindividual",
      component: () => import( /* webpackChunkName: "Pniscatatumboindividual" */ "@/modules/pnis/pages/catatumboindividual.vue"),
    },
    {
      path: "catatumboindividual/:id",
      name: "pnis-catatumboindividual",
      component: () => import( /* webpackChunkName: "Pniscatatumboindividual" */ "@/modules/pnis/pages/catatumboindividual.vue"),
    },
    {
      path: "catatumboindividual/:id",
      name: "pnis-catatumboindividual",
      component: () => import( /* webpackChunkName: "Pniscatatumboindividual" */ "@/modules/pnis/pages/catatumboindividual.vue"),
    },
    {
      path: "catatumboindividual/arrendatarios/:id",
      name: "pnis-catatumboindividual-arrendatarios",
      component: () => import( /* webpackChunkName: "Pniscatatumboindividual" */ "@/modules/pnis/pages/catatumboindividual-arrendatarios.vue"),
    },
    {
      path: "catatumboindividual/desplazados/:id",
      name: "pnis-catatumboindividual-desplazados",
      component: () => import( /* webpackChunkName: "Pniscatatumboindividual" */ "@/modules/pnis/pages/catatumboindividual-desplazados.vue"),
    },
    {
      path: "catatumboindividual/extranjeros/:id",
      name: "pnis-catatumboindividual-extranjeros",
      component: () => import( /* webpackChunkName: "Pniscatatumboindividual" */ "@/modules/pnis/pages/catatumboindividual-extranjeros.vue"),
    },
    {
      path: "catatumboindividual/open/:id",
      name: "pnis-catatumboindividual-open",
      component: () => import( /* webpackChunkName: "PniscatatumboindividualOpen" */ "@/modules/pnis/pages/catatumboindividual-open.vue"),
    },
    {
      path: "catatumbogrupos",
      name: "pnis-catatumbogrupos",
      component: () => import( /* webpackChunkName: "Pniscatatumbogrupos" */ "@/modules/pnis/pages/catatumbogrupos.vue"),
    },
    {
      path: "catatumbogrupos/open/:id",
      name: "pnis-catatumbogrupos-open",
      component: () => import( /* webpackChunkName: "PniscatatumbogruposOpen" */ "@/modules/pnis/pages/catatumbogrupos-open.vue"),
    },
    {
      path: "fichaacuerdo/open/:id",
      name: "pnis-fichaacuerdo-open",
      component: () => import( /* webpackChunkName: "PnisFichaacuerdoOpen" */ "@/modules/pnis/pages/fichaacuerdo-open.vue"),
    },
    {
      path: "fichaacuerdo2/open/:id",
      name: "pnis-fichaacuerdo-open2",
      component: () => import( /* webpackChunkName: "PnisFichaacuerdoOpen" */ "@/modules/pnis/pages/fichaacuerdo2-open.vue"),
    },
    {
      path: "catatumboficha/open/:id",
      name: "pnis-fichaacuerdocata-open",
      component: () => import( /* webpackChunkName: "PnisFichaacuerdoOpen" */ "@/modules/pnis/pages/catatumboficha-open.vue"),
    },  
    {
      path: "listafichas",
      name: "pnis-listafichas",
      component: () => import( /* webpackChunkName: "PnisListafichas" */ "@/modules/pnis/pages/listafichas.vue"),
    },
    {//call-center
      path: "preregistro-call-center/:id", // Ruta relativa al path padre
      name: "pnis-catatumbo-preregistro-call-center",
      component: () => import("@/modules/public/pages/catatumbo/callcenterformpreregistro.vue"),
    },
  ],
};

export default router;