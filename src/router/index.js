import Vue from "vue";;
import VueRouter from "vue-router";
import routes from "./route";
import store from "../store";
import appConfig from "@/config/index";
import Util from "@/lin/util/util";

Vue.use(VueRouter)
// 判断是否需要登录访问, 配置位于 config 文件夹
let isLoginRequired = routeName => {
  // 首次执行时缓存配置
  let { notLoginRoute } = appConfig;
  const notLoginMark = {};

  // 构建标记对象
  if (Array.isArray(notLoginRoute)) {
    for (let i = 0; i < notLoginRoute.length; i += 1) {
      notLoginMark[notLoginRoute[i].toString()] = true;
    }
  }

  notLoginRoute = null; // 释放内存

  // 重写初始化函数
  isLoginRequired = name => {
    if (!name) {
      return true;
    }
    // 处理 Symbol 类型
    const target = typeof name === "symbol" ? name.description : name;
    return !notLoginMark[target];
  };

  return isLoginRequired(routeName);
};

const scrollBehavior = function (to, from, savedPosition) {
  if (to.hash) {
    return {
      // 通过 to.hash 的值來找到对应的元素
      selector: to.hash,
      offset: {
        y: 100
      }
    }
  }
}

const router = new VueRouter({
  mode: 'hash',
  scrollBehavior,
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.path) {
    if (window._hmt) {
      window._hmt.push(['_trackPageview', '/#' + to.fullPath])
    }
  }
  // 登录验证
  if (isLoginRequired(to.name) && !store.state.logined) {
    next({ path: "/login", query: { redirect: to.fullPath } });
    return;
  }

  // TODO: tab 模式重复点击验证

  // 权限验证
  if (store && store.state && store.getters) {
    const { permissions, user } = store.getters;
    if (to.path !== "/index" && !Util.hasPermission(permissions, to.meta, user)) {
      Vue.prototype.$notify({
        title: "无权限",
        dangerouslyUseHTMLString: true,
        message: '<strong class="my-notify">您无此页面的权限哟</strong>'
      });
      next({ path: "/index" });
      return;
    }
  }

  // 路由发生变化重新计时
  Vue.prototype.$_lin_jump();

  // 路由发生变化修改页面title
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  next();
});

export default router;
