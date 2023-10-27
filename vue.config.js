const path = require('path')
const TerserWebpackPlugin = require('terser-webpack-plugin') // 直接引入，无需下载
// const CompressionWebpackPlugin = require('compression-webpack-plugin') // 开启gzip压缩,需要下载 npm i compression-webpack-plugin -D(若版本过高请降低版本重新卸载下载)
const resolve = dir => path.join(__dirname, dir)
const isProduction = process.env.NODE_ENV === 'prod'
const postCssPxToRem  = require('postcss-pxtorem')

module.exports = {
  lintOnSave: false,
  devServer: {
    port: 8088,
    host: '0.0.0.0',
    open: true,
    //  解决向服务器发送请求跨域
    proxy: {
      "^/test": {
        target: "http://116.62.210.125:8091/",
        pathRewrite: {
          "^/test": ""
        },
        logLevel: "debug",
        logProvider: () => console
      }
    }
  },
  configureWebpack: config => {
    // 添加快捷键
    config.resolve.alias['@'] = resolve('src')
    config.resolve.alias['@imgs'] = resolve('src/assets/imgs')

    if (isProduction) {
      // 去除debugger、console.log及注释
      config.plugins.push(
          new TerserWebpackPlugin({
            parallel: true, // 使用多进程并发运行
            terserOptions: {
              compress: {
                drop_console: true, //传true就是干掉所有的console.*这些函数的调用.
                drop_debugger: true, //干掉那些debugger;
                pure_funcs: ['console.log'] // 如果你要干掉特定的函数比如console.info ，又想删掉后保留其参数中的副作用，那用pure_funcs来处理
              }
            }
          })
      )

      // 开启gzip打包（需要服务端配合）
      // config.plugins.push(
      //   new CompressionWebpackPlugin({
      //     test: /\.js$|\.html$|\.css$|\.scss$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
      //     threshold: 10240, // 归档需要进行压缩的文件大小最小值，我这个是10K以上的进行压缩
      //     deleteOriginalAssets: false // 是否删除原文件
      //   })
      // )
    }
  },
  chainWebpack: config => {
    config.resolve.symlinks(true)
    // 配置JSX语法支持
    config.module
        .rule('jsx')
        .test(/\.jsx$/)
        .use('babel')
        .loader('babel-loader')
        .options({
          plugins: ['@vue/babel-plugin-jsx'],
        })
    // 配置svg
    config.module.rules.delete('svg') // 重点:删除默认配置中处理svg,
    config.module
        .rule('svg-sprite-loader')
        .test(/\.svg$/)
        .include.add(resolve('src/assets/svg')) // 处理svg目录
        .end()
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options({
          symbolId: 'icon-[name]'
        })

    // 使用webpack-bundle-analyzer分析报文件，找出最占用空间的插件有哪些，对应做出优化(看完之后要注释掉)：下载npm install webpack-bundle-analyzer -D
    // config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  },
  css: {
    extract: false,
    loaderOptions: {
      // 配置sass，使项目中能够使用sass定义的全局变量及mixin混合函数
      sass: {
        prependData: '@import "~@/assets/style/index.scss";'
      },
      //配置页面适配
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            rootValue: 192, // 1rem，根据 设计稿宽度/10 进行设置   开头大写的Px 不转换 => height: 100Px, 内联样式不转换
            propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
            minPixelValue: 0, //置要替换的最小像素值
            selectorBlackList: ['.no-rem', 'no-rem'], // 要忽略的选择器并保留为px。
            exclude: /node_modules/i, // 排除 node_modules 文件(node_modules 内文件禁止转换)
            replace: true,
            mediaQuery: false
          })
        ]
      }
    },
  }
}
