import router from '@/router'
import Layout from '@/layout/index.vue'
import asyncRoutes from '@/router/asyncRoutes'

const state = {
  token: '', // token值
  userInfo: {}, // 用户信息
  menuList: [], // 左侧菜单列表（动态路由）
  roles: [], // 用户角色的按钮权限列表
  navigationList: [], // 快捷导航
  expansion: false // 控制左侧菜单的展开与收缩
}

const mutations = {
  SET_TOKEN: (state, str) => {
    state.token = str
  },
  SET_USERINFOR: (state, obj) => {
    state.userInfo = obj
  },
  // 添加动态路由
  SET_MENULIST(state, arr) {
    state.menuList = arr
  },
  // 设置用户角色的按钮权限列表
  SET_ROLES(state, arr) {
    state.roles = arr
  },
  // 添加快捷导航
  SET_NAVIGATIONLIST(state, obj) {
    if (state.navigationList.some(v => v.path === obj.path)) return
    state.navigationList.push(obj)
  },
  // 移除快捷导航(某一项)
  REMOVE_NAVIGATIONLIST(state, str) {
    const index = state.navigationList.findIndex(v => v.path === str)
    state.navigationList.splice(index, 1)
  },
  // 移除快捷导航(所有)
  REMOVE_NAVIGATIONLIST_ALL(state) {
    state.navigationList = []
  },
  // 控制左侧菜单的展开与收缩
  SET_EXPANSION(state, boo) {
    state.expansion = boo
  }
}

const actions = {
  // 从后端获取用户信息及用户权限信息
  GET_USERINFO({ commit }) {
    // return new Promise(async resolve => {
    //   const res = await userInfo()
    //   commit('SET_USERINFO', res.data.userInfo)
    //   commit('SET_ROLES', res.data.roles)
    //   resolve(res)
    // })
  },

  // 从后端获取路由表信息（解析后台的路由表信息，将其添加至路由中）
  GET_MENULIST({ commit }) {
    return new Promise(resolve => {
      setTimeout(() => {
        const asyncRoutesNew = formatRoutes(asyncRoutes)
        asyncRoutesNew.forEach(v => {
          router.addRoute(v)
        })
        router.addRoute({ path: '/:pathMatch(.*)*', redirect: '/' }) // 地址栏的路由输入错误后直接跳转到第一项
        commit('SET_MENULIST', asyncRoutesNew)
        resolve(asyncRoutesNew)
      }, 300)
    })
  }
}
const getters = {
  getUserId(state){
    return state.userInfo.id || null
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

// 解析后台的路由表信息，将其添加至路由中
function formatRoutes(routes) {
  const arr = []
  routes.forEach(route => {
    const tmp = { ...route }
    const comp = tmp.component
    if (comp) {
      switch (comp) {
        case 'Layout':
          tmp.component = Layout
          break
        default:
          tmp.component = () => import(`@/pages/${comp}/index.vue`)
        // tmp.component = modules[`/src/pages/${comp}/index.vue`]
      }
    }
    if (tmp.children && tmp.children.length) {
      tmp.children = formatRoutes(tmp.children)
    }
    // router.addRoute(tmp)  // addRoute不可在此处添加，源码中会报错，因为子路由中的path没有'/'
    arr.push(tmp)
  })
  return arr
}
