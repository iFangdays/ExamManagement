# vue3_webpack

## 项目的下载、启动、打包

```
npm install
npm run dev
npm run build
```

## src 目录结构

```
- - api（存放所有接口）
- - assets（静态资源文件）
- - components（功能公共组件）
- - http（axios封装）
- - layout（入口组件）
- - pages（业务组件目录）
- - router（路由）
      asyncRoutes.js        异步路由
      permission.js         路有权限拦截
- - store（vuex模块化）
- - utils（工具类函数）
      reg.js                  表单校验类型及函数
      resetMessage.js         element的message弹框重写
      resetNotification.js    element的notification弹框重写
```
