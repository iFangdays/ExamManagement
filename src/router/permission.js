import store from '@/store'
import router from '@/router'

// 在页面加载时读取sessionStorage里的状态信息，将store的所有数据重新覆盖！
if (sessionStorage.getItem('store')) {
  store.replaceState(Object.assign({}, store.state, JSON.parse(sessionStorage.getItem('store'))))
}
// 在页面刷新时将vuex里的信息保存到sessionStorage里
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('store', JSON.stringify(store.state))
})

// 权限验证处理
const whiteList = ['/login'] // 白名单
router.beforeEach(async (to, from, next) => {
  const hasToken = store.state.user.token
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (router.getRoutes().length === 1) {
        try {
          await store.dispatch('user/GET_USERINFO') // 从后端获取用户信息及用户权限信息
          await store.dispatch('user/GET_MENULIST') // 从后端获取路由表信息（解析后台的路由表信息，将其添加至路由中）
          next({ ...to, replace: true }) // 确保动态添加的路由已经被完全加载上去
        } catch (error) {
          console.log('--添加动态路由的error--', error)
          store.commit('user/SET_TOKEN', '')
          store.commit('user/SET_USERINFO', {})
          store.commit('user/SET_ROLES', [])
          store.commit('user/SET_MENULIST', [])
          store.commit('global/REMOVE_NAVIGATIONLIST_ALL')
          sessionStorage.setItem('store', '')
          next({ path: '/login' })
        }
      } else {
        next()
      }
    }
  } else {
    whiteList.indexOf(to.path) === -1 ? next({ path: '/login' }) : next()
  }
})
