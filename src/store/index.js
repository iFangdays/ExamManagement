import { createStore } from 'vuex'

const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = createStore({
  modules
})
export default store

/*
  在vue文件中使用store：
        import { useStore } from 'vuex'
        const store = useStore()
        store.commit('user/SET_TOKEN', 'FGHKJHKHLUKHKLUYULJKHJK')
        console.log(123, store.state.user.token)
  
  在js文件中使用store
        import store from '@/store'
*/
