const blogRouter = [
  {
    route: null,
    name: null,
    title: "工作台",
    type: "folder", // 类型: folder, tab, view
    icon: "iconfont icon-dashboard",
    filePath: "plugins/Blog/",
    order: null,
    inNav: true,
    children: [
      {
        name: null,
        title: "专栏管理",
        type: "view",
        name: "ClassifyList",
        route: "/classify/list",
        filePath: "plugins/Blog/views/classify/ClassifyList.vue",
        inNav: true
      },
    ]
  }
];

export default blogRouter;
