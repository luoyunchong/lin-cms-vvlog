// 本文件是自动生成, 请勿修改
import blog from '@/plugin/blog/stage-config'
import demo from '@/plugin/demo/stage-config'

const pluginsConfig = [
  blog,
  demo,
]

let pluginsNewConfig = [];
pluginsConfig.forEach(stageConfig => {
  if (Array.isArray(stageConfig)) {
    stageConfig.forEach(config => {
      pluginsNewConfig.push(config)
    })
  } else {
    pluginsNewConfig.push(stageConfig)
  }
})

export default pluginsNewConfig
