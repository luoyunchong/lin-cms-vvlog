let baseRouter = [
    {
        path: '/index/:channel?/:tag_name?',
        name: 'index',
        component: () => import("@/views/home/Index.vue"),
        meta: { title: '首页' },
    },
    {
        path: '/subscribe',
        name: 'subscribe',
        component: () => import("@/views/subscribe/SubscribeArticle.vue"),
        meta: { title: '关注' },
    },
    {
        path: '/docs',
        name: 'docs',
        component: () => import("@/views/home/Docs.vue"),
        meta: { title: '文档' },
    },
    {
        path: '/tag/subscribe/:tab',
        name: 'tag-list',
        component: () => import("@/views/tag/TagList.vue"),
        meta: { title: '标签列表页' },
    },
    {
        path: '/tag/:id',
        name: 'tag-detail',
        component: () => import("@/views/tag/TagDetail.vue"),
        meta: { title: '标签详情页' },
    },
    {
        path: '/comment',
        name: 'comment',
        component: () => import("@/views/comment/CommentList.vue"),
        meta: { title: '评论' },
    },
    {
        path: '/post/:id',
        name: 'post',
        component: () => import("@/views/article/ArticleDetail.vue"),
        meta: { title: '随笔详情页' },
        children: []
    },
    {
        path: '/p/:id',
        name: 'p',
        component: () => import("@/views/article/MavonEditorPreview.vue"),
        meta: { title: 'MavonEditorPreview' },
        children: []
    },
    {
        path: '/user/:id/:name',
        name: 'user',
        component: () => import("@/views/user/Index.vue"),
        meta: { title: '我的主页' },
    },
    {
        path: '/notifications/:notification_type',
        name: 'notifications',
        component: () => import("@/views/notification/Index.vue"),
        meta: { title: '消息' },
        children: []
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import("@/views/settings/Index.vue"),
        redirect: '/settings/profile',
        meta: { title: '设置' },
        children: [
            {
                path: '/settings/profile',
                name: 'settings-profile',
                component: () => import("@/views/settings/Profile.vue"),
                meta: { title: '个人资料' },
            },
            {
                path: '/settings/security',
                name: 'settings-security',
                component: () => import("@/views/settings/Security.vue"),
                meta: { title: '安全设置' },
            },
            {
                path: '/settings/blog',
                name: 'settings-blog',
                component: () => import("@/views/settings/Blog.vue"),
                meta: { title: '博客设置' },
            }
        ]
    },
    {
        path: '/login-result',
        name: 'login-result',
        component: () => import("@/views/account/LoginResult.vue"),
        meta: { title: '第三方登录' },
    },
    {
        path: '/404',
        name: '404',
        component: () => import("@/views/error-page/404.vue"),
        meta: { title: '404' },
    }
]
export default baseRouter
