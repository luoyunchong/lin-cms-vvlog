let homeRouter = []

// 深度遍历配置树, 摘取叶子节点作为路由部分
function deepTravel(config) {
    if (Array.isArray(config)) {
        config.forEach((subConfig) => {
            return deepTravel(subConfig)
        })
    } else if (config.children) {
        config.children.forEach((subConfig) => {
            return deepTravel(subConfi)
        })
    } else {
        return viewConfig(config)
    }
}

function viewConfig(viewConfig) {
    // 构造舞台view路由
    const viewRouter = {}
    viewRouter.path = viewConfig.route
    viewRouter.name = viewConfig.name
    viewRouter.component = () => import(`@/${viewConfig.filePath}`)
    viewRouter.meta = {
        title: viewConfig.title,
        icon: viewConfig.icon,
        right: viewConfig.right,
        type: viewConfig.type,
        blueBaseColor: viewConfig.blueBaseColor ? 'viewConfig.blueBaseColor' : '',
    }
    homeRouter.push(viewRouter)
    return homeRouter;
}

export default deepTravel
