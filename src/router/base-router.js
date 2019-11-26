
import baseConfig from '@/config/base'

// 深度遍历配置树, 摘取叶子节点作为路由部分
function deepTravel(config, fuc) {
    if (Array.isArray(config)) {
        config.forEach((subConfig) => {
            deepTravel(subConfig, fuc)
        })
    } else if (config.children) {
        config.children.forEach((subConfig) => {
            deepTravel(subConfig, fuc)
        })
    } else {
        fuc(config)
    }
}

const homeRouter = []

deepTravel(baseConfig, (viewConfig) => {
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
})

export default homeRouter
