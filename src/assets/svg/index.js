import './iconfont.js' // 引入阿里图标库的iconfont.js
const req = require.context('../svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
