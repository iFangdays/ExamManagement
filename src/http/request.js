import axios from 'axios'
import store from '@/store'
import router from '@/router'
import notification from '@/utils/resetNotification'

/*
  过滤重复请求！
*/
const pendings = []
const CancelToken = axios.CancelToken
// 移除重复请求（如果组件在离开页面时需要清除当前axios请求，则可以调用此函数！！！）
export function removePending(config) {
  let whiteArray = ['/exam/util/img/upload']
  if(whiteArray.includes(config.url)) return
  const i = pendings.findIndex(v => v.url === config.url && v.method === config.method)
  if (i > -1) {
    pendings[i].cancel('操作太频繁，请稍后再试')
    pendings.splice(i, 1)
  }
}

export default class Request {
  instance = null // axios实例
  // 默认的url从环境变量中获取
  constructor(config) {
    this.instance = axios.create(config)
    this.instance.defaults.headers.post['Content-Type'] = 'application/json' // 设置post请求头
    this.requestFn()
    this.responseFn()
  }

  // 请求拦截器
  requestFn() {
    this.instance.interceptors.request.use(
      config => {
        // 过滤重复请求
        removePending(config)
        config.cancelToken = new CancelToken(c => pendings.push({ url: config.url, method: config.method, cancel: c }))
        if (config.method === 'get') {
          config.data = true // 这个是关键点，加入这行就可以了  解决get  请求添加不上content_type
        }
        // 设置token
        const token = store.state.user.token
        token && (config.headers.token = token)
        return config
      },
      err => {
        notification({ title: '请求错误', message: err, type: 'error' })
        return Promise.reject(err)
      }
    )
  }

  // 响应拦截器
  responseFn() {
    this.instance.interceptors.response.use(
      res => {
        removePending(res.config)
        if (res.status === 200) {
          if (res.headers.token) {
            store.commit('user/SET_TOKEN', res.headers.token)
          }
          if(res.data.code === 200){
            return Promise.resolve(res.data.data)
          }else{
            notification({ title: '接口请求错误', message: res.data.msg, type: 'error' })
          }
        }
        notification({ title: '接口请求错误', message: res.message, type: 'error' })
      },
      err => {
        errHandle(err)
      }
    )
  }

  // 注意：如果需要下载excel等文件流，config需要配置 { responseType: 'blob' }
  get(url, params = {}, config = {}) {
    return this.instance.get(url, { params: params, ...config })
  }

  delete(url, params = {}, config = {}) {
    return this.instance.delete(url, { params: params, ...config })
  }

  post(url, data = {}, config = {}) {
    return this.instance.post(url, data, config)
  }

  put(url, data = {}, config = {}) {
    return this.instance.put(url, data, config)
  }

  all(requestArr) {
    return axios.all(requestArr)
  }
}

// 状态码错误的处理函数
function errHandle(err) {
  const { response } = err
  // 当服务器返回错误码时
  if (response) {
    switch (response.status) {
      case 400:
        notification({ title: '错误请求', message: response.data.message, type: 'error' })
        break
      case 401:
        notification({ title: '用户信息已变更 / 登录过期', message: response.data.message, type: 'error', duration: 3000 })
        store.commit('user/SET_TOKEN', '')
        store.commit('user/SET_USERINFO', {})
        store.commit('user/SET_ROLES', [])
        store.commit('user/SET_MENULIST', [])
        store.commit('global/REMOVE_NAVIGATIONLIST_ALL')
        sessionStorage.setItem('store', '')
        location.reload()
        setTimeout(() => {
          router.replace('/login')
        }, 200)
        break
      case 403:
        notification({ title: '拒绝访问', message: response.data.message, type: 'error' })
        break
      case 404:
        notification({ title: '请求错误，未找到该资源', message: response.data.message, type: 'error' })
        break
      case 405:
        notification({ title: '请求方法未允许', message: response.data.message, type: 'error' })
        break
      case 408:
        notification({ title: '请求超时', message: response.data.message, type: 'error' })
        break
      case 500:
        notification({ title: '服务器错误', message: response.data.message, type: 'error' })
        break
      case 503:
        notification({ title: '服务器暂时无法使用', message: response.data.message, type: 'error' })
        break
      default:
        notification({ title: '请求数据失败', message: response.data.message, type: 'error' })
    }
    return Promise.reject(response.data)
  } else {
    // 当服务器没有返回结果时，可能是没有网(如果断网了：可以跳转到断网页面)
    if (!window.navigator.onLine) {
      notification({ title: '提示', message: '请检查网络是否连接正常', type: 'error' })
      return
    }
    return Promise.reject(err)
  }
}
