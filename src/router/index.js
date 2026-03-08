import { createRouter, createWebHistory } from "vue-router";
import { updateMeta } from "@/utils/seo";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/pages/Home.vue"),
    meta: {
      title: "Personal Website | f1sh.dev",
      description: "Personal portfolio and creative space of Moli, showcasing projects, photography, and digital experiences.",
    },
  },
  {
    path: "/blog",
    name: "Blog",
    component: () => import("@/pages/Blog.vue"),
    meta: {
      title: "Blog | f1sh.dev",
      description: "Thoughts on code, tools, and random stuff.",
    },
  },
  {
    path: "/uses",
    name: "Uses",
    component: () => import("@/pages/Uses.vue"),
    meta: {
      title: "Uses | f1sh.dev",
      description: "Tools, hardware, and software I use daily.",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/pages/NotFound.vue"),
    meta: {
      title: "404 Not Found | f1sh.dev",
    },
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
  updateMeta({
    title: to.meta.title,
    description: to.meta.description,
    url: `https://f1sh.dev${to.path}`,
  });
  next();
});

export default router;
