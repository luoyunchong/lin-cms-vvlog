let baseRouter = [
    {
        name: "index",
        title: "首页",
        type: "view",
        route: "/index",
        filePath: "views/home/Index.vue",
        inNav: true,
        icon: "iconfont icon-tushuguanli"
    },
    {
        name: "docs",
        title: "文档",
        type: "view",
        route: "/docs",
        filePath: "views/home/Docs.vue",
        inNav: true,
        icon: "iconfont icon-tushuguanli"
    },
    {
        name: "tag-detail",
        title: "标签详情页",
        type: "view",
        route: "/tag/:id",
        filePath: "views/tag/TagDetail.vue",
        inNav: true,
        icon: "iconfont icon-tushuguanli"
    },
    {
        name: "tag",
        title: "标签",
        type: "view",
        route: "/tag",
        filePath: "views/tag/TagList.vue",
        inNav: true,
        icon: "iconfont icon-tushuguanli"
    },
    {
        name: "comment",
        title: "评论",
        type: "view",
        route: "/comment",
        filePath: "views/comment/CommentList.vue",
        inNav: true,
        icon: "iconfont icon-tushuguanli"
    },
    {
        title: "详情页",
        type: "view",
        name: "post",
        route: "/post/:id",
        filePath: "views/article/ArticleDetail.vue",
        inNav: false
    },
    {
        title: "我的主页",
        type: "view",
        name: "user",
        route: "/user/:id/:name",
        filePath: "views/user/Index.vue",
        inNav: false
    },
    {
        title: "设置",
        type: "view",
        name: "settings",
        route: "/settings/",
        filePath: "views/user/Index.vue",
        inNav: false,
        children: [
            {
                name: null,
                title: "专栏管理",
                type: "view",
                name: "ClassifyList",
                route: "/cms/classify/list",
                filePath: "plugins/Blog/views/classify/ClassifyList.vue",
                inNav: true
            }]
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

export default baseRouter;
