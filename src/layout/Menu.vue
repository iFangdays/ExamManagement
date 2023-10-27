<template>
  <el-menu class="el-menu-vertical-demo scrollbar" :default-active="route.path" background-color="transparent" unique-opened router :collapse="store.state.user.expansion">
    <MenuItem v-for="item in routes" :key="item.path" :route="item"></MenuItem>
  </el-menu>
</template>

<script setup>
import MenuItem from './MenuItem.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
const store = useStore()
const route = useRoute()

// 解析路由数据
const routes = computed(() => {
  analysisRoutes(store.state.user.menuList)
  return store.state.user.menuList
})
function analysisRoutes(arr) {
  arr.forEach(v => {
    if (v?.children?.length) {
      v.children.forEach(item => {
        item.path = v.path === '/' ? '/' + item.path : v.path + '/' + item.path
      })
      analysisRoutes(v.children)
    }
  })
}
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 220px;
}

.el-menu-vertical-demo {
  height: 100%;
  overflow-y: auto;
}
</style>
