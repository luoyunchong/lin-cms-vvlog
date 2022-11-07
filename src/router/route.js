import Home from "@/view/home/home";
import homeRouter from './home-router'
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
    path: '/home',
    name: 'Home',
    redirect: '/about',
    component: Home,
    children: [
      ...homeRouter,
    ],
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
