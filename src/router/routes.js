import Home from "@/views/home/Home";
import homeRouter from "./home-router";
import Base from "@/views/home/Base";
const routes = [
  {
    path: "/",
    name: "Home",
    redirect: "/home/index",
    component: Base,
    children: [...homeRouter]
  },
  {
    name: "p",
    path: "/p",
    component: () => import("@/views/home/Index.vue"),
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
