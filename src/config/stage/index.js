import pluginsConfig from "./plugins";
import Utils from "@/lin/utils/util";

let homeRouter = [
  {
    title: "林间有风",
    type: "view",
    name: Symbol("about"),
    route: "/about",
    filePath: "views/about/About.vue",
    inNav: true,
    icon: 'iconfont icon-send',
    order: 0
  },
  {
    title: "首页",
    type: "view",
    name: Symbol("dashboard"),
    route: "/dashboard",
    filePath: "views/home/Dashboard.vue",
    inNav: true,
    icon: 'iconfont icon-appstoreadd',
    order: 1
  },
  {
    title: "404",
    type: "view",
    name: Symbol("404"),
    route: "/404",
    filePath: "views/error-page/404.vue",
    inNav: false,
    icon: "iconfont icon-Batchfolding"
  }
];

const plugins = [...pluginsConfig];

// 筛除已经被添加的插件
function filterPlugin(data) {
  if (plugins.length === 0) {
    return;
  }
  if (Array.isArray(data)) {
    data.forEach(item => {
      filterPlugin(item);
    });
  } else {
    const findResult = plugins.findIndex(item => data === item);
    if (findResult >= 0) {
      plugins.splice(findResult, 1);
    }
    if (data.children) {
      filterPlugin(data.children);
    }
  }
}

filterPlugin(homeRouter);

homeRouter = homeRouter.concat(plugins);

// 处理顺序
homeRouter = Utils.sortByOrder(homeRouter);

// 使用 Symbol 处理 name 字段, 保证唯一性
const deepReduceName = target => {
  if (Array.isArray(target)) {
    target.forEach(item => {
      if (typeof item !== "object") {
        return;
      }
      deepReduceName(item);
    });
    return;
  }
  if (typeof target === "object") {
    // if (typeof target.name !== 'symbol') {
    //   target.name = target.name || Utils.getRandomStr()
    //   target.name = Symbol(target.name)
    // }

    if (!target.name) {
      target.name = target.name || Utils.getRandomStr();
    }

    if (Array.isArray(target.children)) {
      target.children.forEach(item => {
        if (typeof item !== "object") {
          return;
        }
        deepReduceName(item);
      });
    }
  }
};

deepReduceName(homeRouter);

export default homeRouter;
