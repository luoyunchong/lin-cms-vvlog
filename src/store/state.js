import appConfig from '@/config/index' // 引入项目配置

export default {
  user: {}, // 当前用户
  loggedIn: false, // 是否登录
  permissions: [], // 每个用户的所有权限

  // 推送消息
  unreadMessages: [],
  alreadyReadMessages: [],

  // 当前页信息
  currentRoute: {
    config: null,
    treePath: [],
  },

  sidebarLevel: appConfig.sidebarLevel || 3,
  defaultRoute: appConfig.defaultRoute || '/login',
}
