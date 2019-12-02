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
    children: [...baseRouter]
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
    component: () => import("@/views/login/Login")
  },
  {
    redirect: "/404",
    path: "*"
  }
];

export default routes;
