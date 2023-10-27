import Request from './request'
const http = new Request({
  baseURL: window.URL_CONFIG.URL,
  timeout: 600000,
  withCredentials: false // 设置跨域是否允许携带凭证(开发环境需要配置，因为要使用跨域；生产环境需要将其注释掉！)
})
export default http
