import Home from "@/views/home/Home";
import homeRouter from "./home-router";
import baseRouter from "./base-router";
import BaseLayout from "@/views/layout/BaseLayout";
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
    component: () => import("@/views/account/Login")
  },
  {
    path: '/post/editor/:id',
    name: 'post-editor',
    component: () => import("@/views/article/EditorForm.vue"),
    meta: { title: '随笔编辑' },
  },

  {
    redirect: "/404",
    path: "*"
  }
];

export default routes;
