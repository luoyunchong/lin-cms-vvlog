import baseRouter from "./base-router";
import BaseLayout from "@/view/layout/base-layout";
const routes = [
  {
    path: "/",
    name: "base-index",
    redirect: "/index",
    component: BaseLayout,
    children: baseRouter
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/view/account/login")
  },
  {
    path: '/p/editor/:id',
    name: 'post-editor',
    component: () => import("@/view/article/editor-form.vue"),
    meta: { title: '随笔编辑' },
  },
  {
    redirect: "/404",
    path: "/:catchAll(.*)"
  }
];

export default routes
