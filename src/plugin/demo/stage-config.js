const DemoRouter = [{
  route: null,
  name: null,
  title: '插件Demo',
  type: 'folder',
  filePath: 'view/demo/',
  order: null,
  inNav: true,
  icon: "iconfont icon-dashboard",
  children: [
    {
      title: 'list组件',
      type: 'view',
      name: 'stage1',
      route: '/demo/list',
      filePath: 'plugin/demo/view/a-list-demo.vue',
      inNav: true,
      right: null,
      icon: "iconfont icon-tushuguanli"
    },
  ],
}]

export default DemoRouter
