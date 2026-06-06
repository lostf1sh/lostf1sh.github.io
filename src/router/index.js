import { createRouter, createWebHistory } from "vue-router";
import { updateMeta } from "@/utils/seo";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/pages/Home.vue"),
    meta: {
      title: "moli — developer blog & terminal portfolio",
      description: "moli's terminal-styled personal site: projects, blog posts, live status, music, and developer notes.",
    },
  },
  {
    path: "/blog/:slug?",
    name: "Blog",
    component: () => import("@/pages/Blog.vue"),
    meta: {
      title: "Blog | moli",
      description: "Thoughts on code, tools, and random stuff.",
    },
  },
{
    path: "/projects",
    name: "Projects",
    component: () => import("@/pages/Projects.vue"),
    meta: {
      title: "Projects | moli",
      description: "Open source projects and experiments.",
    },
  },
  {
    path: "/now",
    name: "Now",
    component: () => import("@/pages/Now.vue"),
    meta: {
        title: "Now | moli",
        description: "What I'm currently working on.",
    },
  },
  {
    path: "/uses",
    name: "Uses",
    component: () => import("@/pages/Uses.vue"),
    meta: {
        title: "Uses | moli",
        description: "Tools, hardware, and software I use daily.",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/pages/NotFound.vue"),
    meta: {
      title: "404 Not Found | moli",
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
    url: `https://moli.codes${to.path}`,
  });
  next();
});

export default router;
