import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import Blog from "@/pages/Blog.vue";
import NotFound from "@/pages/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { title: "Personal Website | f1sh.dev" },
  },
  {
    path: "/blog",
    name: "Blog",
    component: Blog,
    meta: { title: "Blog | f1sh.dev" },
  },
  {
    path: "/github",
    name: "GitHubRedirect",
    beforeEnter() {
      window.location.href = "https://github.com/lostf1sh";
    },
  },
  {
    path: "/instagram",
    name: "InstagramRedirect",
    beforeEnter() {
      window.location.href = "https://www.instagram.com/kawaiimoli";
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
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
