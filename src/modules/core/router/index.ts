const router = {
  name: "",
  component: () => import("@/layouts/default.vue" ),
  children: [
    {
      path: "",
      name: "core-index",
      component: () => import( /* webpackChunkName: "CoreIndex" */ "@/modules/core/pages/index.vue"),
    },
    {
      path: "staff",
      name: "core-staff",
      component: () => import( /* webpackChunkName: "CoreStaff" */ "@/modules/core/pages/staff.vue"),
    },
    {
      path: "survey",
      name: "core-survey",
      component: () => import( /* webpackChunkName: "CoreStaff" */ "@/modules/core/pages/survey.vue"),
    }
  ],
};

export default router;