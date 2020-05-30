
<p align="center">
  <a href="http://doc.cms.7yue.pro/">
    <img width="200" src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/left-logo.png">
  </a>
</p>

<p align="center">
  <a href="#简介">简介</a>&nbsp;|&nbsp;<a href="#快速上手">快速上手</a>&nbsp;|&nbsp;<a href="#版本日志">版本日志</a>
</p>

![](https://img.shields.io/badge/版本-0.0.1-3963bc.svg)
![](https://img.shields.io/badge/node-8.11.0+-3963bc.svg)
![](https://img.shields.io/badge/脚手架-vuecli3-3963bc.svg)
![](https://img.shields.io/badge/license-MIT-3963bc.svg)

![](https://img.shields.io/badge/developer-@igeekfan-3963bc.svg)

## 简介
- 功能简介 [https://github.com/luoyunchong/lin-cms-dotnetcore/issues/3](https://github.com/luoyunchong/lin-cms-dotnetcore/issues/3)
## 开源
- 后端接口 [https://github.com/luoyunchong/lin-cms-dotnetcore](https://github.com/luoyunchong/lin-cms-dotnetcore)
- 管理后台UI [https://github.com/luoyunchong/lin-cms-vue](https://github.com/luoyunchong/lin-cms-vue)
- 前端UI[https://github.com/luoyunchong/lin-cms-vvlog](https://github.com/luoyunchong/lin-cms-vvlog)


## 线上 Demo
- 本项目swagger地址 [https://baimocore.cn/swagger/index.html](https://baimocore.cn/swagger/index.html)
- 用户端 lin-cms-vvlog [http://vvlog.baimocore.cn](http://vvlog.baimocore.cn) 
  - 普通用户：710277267@qq.com
  - 密码：123qwe

- 管理员 lin-cms-vue [http://cms.baimocore.cn/](http://cms.baimocore.cn)
  - 管理员： admin
  - 密码：123qwe


## 线上文档地址(完善中)
- [https://luoyunchong.github.io/vuepress-docs/dotnetcore/lin-cms/](https://luoyunchong.github.io/vuepress-docs/dotnetcore/lin-cms/)
- [https://igeekfan.gitee.io/vuepress-docs/dotnetcore/lin-cms/](https://igeekfan.gitee.io/vuepress-docs/dotnetcore/lin-cms/)
- 
#### Lin CMS 是一个前后端分离的 CMS 解决方案
## 快速上手

```sh
# clone the project
git clone https://github.com/luoyunchong/lin-cms-vvlog

# install dependency
npm install or yarn (install)

# develop
npm run serve or yarn (run) serve

#upgrade package
yarn upgrade element-ui
yarn upgrade element-ui@2.13.0
```

## 性能优化
- 1.gzip压缩
```
npm install compression-webpack-plugin -D
```

修改vue.config.js
```
const CompressionPlugin = require('compression-webpack-plugin');//引入gzip压缩插
configureWebpack: config => {
    const baseConfig = {
        name: name,
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    }
    if (process.env.NODE_ENV === 'production') {
        return {
            plugins: [
                // 压缩代码
                new CompressionPlugin({
                    test: /\.js$|\.html$|.\css/, // 匹配文件名
                    threshold: 10240, // 对超过10k的数据压缩
                    deleteOriginalAssets: false // true 不删除源文件 false 删除源文件
                })
            ],
            ...baseConfig
        }
    } else {
        return { ...baseConfig }
    }
}
```



- 去除console.log与警告
```
npm install compression-webpack-plugin -D
```

```
const TerserPlugin = require('terser-webpack-plugin')
configureWebpack: config => {
    const baseConfig = {
        name: name,
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    }
    if (process.env.NODE_ENV === 'production') {
        return {
            plugins: [
                // 压缩代码
                new CompressionPlugin({
                    test: /\.js$|\.html$|.\css/, // 匹配文件名
                    threshold: 10240, // 对超过10k的数据压缩
                    deleteOriginalAssets: false // 不删除源文件
                }),
                // 去除console.log
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            warnings: false,
                            drop_console: true,
                            drop_debugger: true,
                            pure_funcs: ['console.log']
                        }
                    }
                })
            ],
            ...baseConfig
        }
    } else {
        return { ...baseConfig }
    }
}

```

## 版本日志

