let baseRouter = [
  {
    path: '/index/:channel?/:tag_name?/:sort?',
    name: 'index',
    component: () => import("@/view/home/index.vue"),
    meta: { title: '首页' },
    props: route => ({ sort: route.query.sort })
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
    path: '/tag/subscribe/:tab/:sort?',
    name: 'tag-list',
    component: () => import("@/view/tag/tag-list.vue"),
    meta: { title: '标签列表页' }
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
    component: () => import("@/view/article/vditor-detail.vue"),
    meta: { title: '随笔详情页' },
    children: []
  },

  {
    path: '/p/:id',
    name: 'p',
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
    path: '/notification/:notification_type',
    name: 'notification',
    component: () => import("@/view/notification/index.vue"),
    meta: { title: '消息' },
    children: []
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import("@/view/setting/index.vue"),
    redirect: '/setting/profile',
    meta: { title: '设置' },
    children: [
      {
        path: '/setting/profile',
        name: 'setting-profile',
        component: () => import("@/view/setting/profile.vue"),
        meta: { title: '个人资料' },
      },
      {
        path: '/setting/security',
        name: 'setting-security',
        component: () => import("@/view/setting/security.vue"),
        meta: { title: '安全设置' },
      },
      {
        path: '/setting/binding',
        name: 'setting-binding',
        component: () => import("@/view/setting/binding.vue"),
        meta: { title: '第三方帐号绑定' },
      },
      {
        path: '/setting/blog',
        name: 'setting-blog',
        component: () => import("@/view/setting/blog.vue"),
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
    path: 'account/password-reset',
    name: 'password-reset',
    component: () => import("@/view/account/password-reset.vue"),
    meta: { title: '密码重置' },
  },
  {
    path: '/bind-result',
    name: 'bind-result',
    component: () => import("@/view/account/bind-result.vue"),
    meta: { title: '第三方账号绑定' },
  },
  {
    path: '/404',
    name: '404',
    component: () => import("@/view/error-page/404.vue"),
    meta: { title: '404' },
  }
]
export default baseRouter
