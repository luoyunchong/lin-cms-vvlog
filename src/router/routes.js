import Home from "@/views/home/Home";
import homeRouter from "./home-router";
import baseRouter from "./base-router";
import Base from "@/views/home/Base";
const routes = [
  {
    path: "/",
    name: "base-index",
    redirect: "/index",
    component: Base,
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
    path: '/post/:id/edit',
    name: 'post-edit',
    component: () => import("@/views/article/EditorForm.vue"),
    meta: { title: '随笔编辑' },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/Login")
  },
  {
    redirect: "/404",
    path: "*"
  }
];

export default routes;
