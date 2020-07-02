const path = require("path");
const CompressionPlugin = require('compression-webpack-plugin');//引入gzip压缩插件
const TerserPlugin = require('terser-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir);
}
console.log('当前环境', process.env.NODE_ENV)

let publicPath = process.env.VUE_APP_DEPLOY === 'github'
  ? '/lin-cms-vvlog/'
  : '/'

module.exports = {
  publicPath: publicPath,
  lintOnSave: true,
  productionSourceMap: false,
  // assetsDir: 'static',
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("lin", resolve("src/lin"))
      .set("assets", resolve("src/assets"));

    config.module
      .rule("md")
      .test(/\.md$/)
      .use("vue-loader")
      .loader("vue-loader")
      .end()
      .use("vue-markdown-loader")
      .loader("vue-markdown-loader/lib/markdown-compiler");

    /* 添加分析工具*/
    if (process.env.NODE_ENV !== 'production') {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
        .end();
      config.plugins.delete('prefetch')
    }
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV == 'production') {
      return {
        resolve: {
          extensions: [".js", ".json", ".vue", ".scss", ".html"]
        },
        plugins: [
          new CompressionPlugin({//gzip压缩配置
            test: /\.js$|\.html$|\.css/,//匹配文件名
            threshold: 10240,//对超过10kb的数据进行压缩
            deleteOriginalAssets: false,//是否删除原文件
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
        // externals: {
        //   'vue': 'Vue',
        //   'vue-router': 'VueRouter',
        //   'vuex': 'Vuex',
        //   'axios': 'axios',
        //   'element-ui': 'ELEMENT'
        // }
      }
    }
    else {
      return {
        resolve: {
          extensions: [".js", ".json", ".vue", ".scss", ".html"]
        }
        // , externals: {
        //   'vue': 'Vue',
        //   'vue-router': 'VueRouter',
        //   'vuex': 'Vuex',
        //   'axios': 'axios',
        //   'element-ui': 'ELEMENT'
        // }
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/assets/style/share.scss";'
      }
    },
  },
  devServer: {
    port: 8081
  },
  // node_modules依赖项es6语法未转换问题
  transpileDependencies: ["vuex-persist"]
};
