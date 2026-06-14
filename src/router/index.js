import { createRouter, createWebHistory } from "vue-router";
import { nextTick } from "vue";
import { updateMeta } from "@/utils/seo";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/pages/Home.vue"),
    meta: {
      title: "moli - developer, blog & portfolio",
      description: "moli's personal site: projects, blog posts, live status, music, and developer notes.",
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
    path: "/colophon",
    name: "Colophon",
    component: () => import("@/pages/Colophon.vue"),
    meta: {
      title: "Colophon | moli",
      description: "How this site is built — the stack, the live data, and the edge.",
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

// Cross-fade between pages with the View Transitions API where supported.
// Skips the initial load and honors prefers-reduced-motion; falls back to an
// instant swap everywhere else.
router.beforeResolve((to, from) => {
  if (
    typeof document === "undefined" ||
    typeof document.startViewTransition !== "function" ||
    !from.matched.length ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  return new Promise((resolve) => {
    document.startViewTransition(async () => {
      resolve();
      await nextTick();
    });
  });
});

export default router;
