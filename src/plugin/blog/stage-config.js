const blogRouter =
  [{
    route: null,
    name: null,
    title: "工作台",
    type: "folder", // 类型: folder, tab, view
    icon: "iconfont icon-dashboard",
    filePath: "plugin/blog/",
    order: null,
    inNav: true,
    children: [
      {
        name: null,
        title: "专栏管理",
        type: "view",
        name: "ClassifyList",
        route: "/classify/list",
        filePath: "plugin/blog/view/classify/classify-list.vue",
        inNav: true
      },
    ]
  }]
  ;

export default blogRouter;
