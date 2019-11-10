import pluginsConfig from "./plugins";
import Utils from "@/lin/utils/util";

// eslint-disable-next-line import/no-mutable-exports
let homeRouter = [
  {
    name: "index",
    title: "博客首页",
    type: "view",
    route: "/home/index",
    filePath: "views/home/Index.vue",
    inNav: true,
    icon: "iconfont icon-tushuguanli"
  },
  {
    name: "docs",
    title: "文档",
    type: "view",
    route: "/home/docs",
    filePath: "views/home/Docs.vue",
    inNav: true,
    icon: "iconfont icon-tushuguanli"
  },
  {
    name: "comment",
    title: "评论",
    type: "view",
    route: "/home/comment",
    filePath: "views/comment/CommentList.vue",
    inNav: true,
    icon: "iconfont icon-tushuguanli"
  },
  {
    title: "博客详情页",
    type: "view",
    name: "p",
    route: "/post/:id",
    filePath: "views/article/ArticleDetail.vue",
    inNav: false
  },
  {
    title: "404",
    type: "view",
    name: Symbol("404"),
    route: "/404",
    filePath: "views/error-page/404.vue",
    inNav: false,
    icon: "iconfont icon-rizhiguanli"
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
    //   // eslint-disable-next-line no-param-reassign
    //   target.name = target.name || Utils.getRandomStr()
    //   // eslint-disable-next-line no-param-reassign
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
