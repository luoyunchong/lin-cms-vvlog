let baseRouter = [
    {
        path: '/index/:channel?/:tag_name?',
        name: 'index',
        component: () => import("@/view/home/index.vue"),
        meta: { title: '首页' },
    },
    {
        path: '/subscribe',
        name: 'subscribe',
        component: () => import("@/view/subscribe/subscribe-article.vue"),
        meta: { title: '关注' },
    },
    {
        path: '/docs',
        name: 'docs',
        component: () => import("@/view/home/docs.vue"),
        meta: { title: '文档' },
    },
    {
        path: '/tag/subscribe/:tab',
        name: 'tag-list',
        component: () => import("@/view/tag/tag-list.vue"),
        meta: { title: '标签列表页' },
    },
    {
        path: '/tag/:id',
        name: 'tag-detail',
        component: () => import("@/view/tag/tag-detail.vue"),
        meta: { title: '标签详情页' },
    },
    {
        path: '/comment',
        name: 'comment',
        component: () => import("@/view/comment/comment-list.vue"),
        meta: { title: '评论' },
    },
    {
        path: '/post/:id',
        name: 'post',
        component: () => import("@/view/article/article-detail.vue"),
        meta: { title: '随笔详情页' },
        children: []
    },
    {
        path: '/user/:id/:name',
        name: 'user',
        component: () => import("@/view/user/index.vue"),
        meta: { title: '我的主页' },
    },
    {
        path: '/notifications/:notification_type',
        name: 'notifications',
        component: () => import("@/view/notification/index.vue"),
        meta: { title: '消息' },
        children: []
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import("@/view/settings/index.vue"),
        redirect: '/settings/profile',
        meta: { title: '设置' },
        children: [
            {
                path: '/settings/profile',
                name: 'settings-profile',
                component: () => import("@/view/settings/profile.vue"),
                meta: { title: '个人资料' },
            },
            {
                path: '/settings/security',
                name: 'settings-security',
                component: () => import("@/view/settings/security.vue"),
                meta: { title: '安全设置' },
            },
            {
                path: '/settings/blog',
                name: 'settings-blog',
                component: () => import("@/view/settings/blog.vue"),
                meta: { title: '博客设置' },
            }
        ]
    },
    {
        path: '/login-result',
        name: 'login-result',
        component: () => import("@/view/account/login-result.vue"),
        meta: { title: '第三方登录' },
    },
    {
        path: '/404',
        name: '404',
        component: () => import("@/view/error-page/404.vue"),
        meta: { title: '404' },
    }
]
export default baseRouter
