import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/pages/Home.vue"),
    meta: { title: "Personal Website | f1sh.dev" },
  },
  {
    path: "/blog",
    name: "Blog",
    component: () => import("@/pages/Blog.vue"),
    meta: { title: "Blog | f1sh.dev" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/pages/NotFound.vue"),
    meta: { title: "404 Not Found | f1sh.dev" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_, __, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

router.beforeEach((to, _, next) => {
  document.title = to.meta.title || "f1sh.dev";
  next();
});

export default router;
