
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

- 本项目swagger地址 [https://igeekfan.cn/swagger/index.html](https://igeekfan.cn/swagger/index.html)
- 用户端 lin-cms-vvlog [https://vvlog.igeekfan.cn](https://vvlog.igeekfan.cn)
  - 普通用户：710277267@qq.com
  - 密码：123qwe

- 管理员 lin-cms-vue [https://cms.igeekfan.cn/](https://cms.igeekfan.cn)
  - 管理员： admin
  - 密码：123qwe


## 线上文档地址(完善中)
- [https://luoyunchong.github.io/vuepress-docs/dotnetcore/lin-cms/](https://luoyunchong.github.io/vuepress-docs/dotnetcore/lin-cms/)
- [https://igeekfan.gitee.io/vuepress-docs/dotnetcore/lin-cms/](https://igeekfan.gitee.io/vuepress-docs/dotnetcore/lin-cms/)
- 
#### Lin CMS 是一个前后端分离的 CMS 解决方案
## 快速上手

- NVM 

node 请安装 14版本，不要升级到最新的16，如果有多个版本，可以使用nvm管理多个node版本。
- Linux [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)
- MAC [https://github.com/tj/n](https://github.com/tj/n)
- windows 下安装 [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)

```sh
# 获取所有可以安装的 Node.js 版本
nvm list available
# 安装指定版本的 Node.js
- nvm install 14.17.4
# 列出所有已经安装的版本
- nvm list
# 指定当前要使用的 Node.js 版本,只用指定使用的 Node.js 版本后，nodejs 的才真正安装了。
- nvm use 14.17.4
```
- run
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
npm install compression-webpack-plugin@6.1.1 -D
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
npm install compression-webpack-plugin@6.1.1 -D
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

