import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import publicRouter from "../modules/public/router";
import authRouter from "../modules/auth/router";
import coreRouter from "../modules/core/router";
import pnisRouter from "../modules/pnis/router";

import useGlobalState from "../stores/global";

const routes: RouteRecordRaw[] = [
  {
    path: "",
    meta: { requiresAuth: false },
    ...publicRouter,
  },
  {
    path: "/auth",
    meta: { requiresAuth: false },
    ...authRouter,
  },
  {
    path: "/core",
    meta: { requiresAuth: true },
    ...coreRouter,
  },
  {
    path: "/pnis",
    meta: { requiresAuth: true },
    ...pnisRouter,
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/layouts/public.vue" ),
    children: [{
      path: "",
      component: () => import("@/modules/public/pages/error.vue"),
    }],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});

router.beforeEach(async (to, from, next) => {
  const globalState = useGlobalState();
  if (to.meta.requiresAuth && !globalState.value.auth) {
    next({ name: "auth-login" });
  } else {
    next();
  }
});

export default router;
