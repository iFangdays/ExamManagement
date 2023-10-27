<template>
  <el-menu-item v-if="hasOneShowingChild(route.children, route) && (!onlyOneChild.obj.children || onlyOneChild.obj.noShowingChildren)" :index="onlyOneChild.obj.path">
    <Svg :name="onlyOneChild.obj.meta.svg"></Svg>
    <i class="xian" v-if="!route.children"></i>
    <template #title>{{ onlyOneChild.obj.meta.title }}</template>
  </el-menu-item>
  <el-sub-menu v-else :index="route.path">
    <template #title>
      <Svg :name="route.meta.svg"></Svg>
      <span>{{ route.meta.title }}</span>
    </template>
    <MenuItem v-for="item in route.children" :key="item.path" :route="item"></MenuItem>
  </el-sub-menu>
</template>

<script setup>
import { reactive } from 'vue'

defineProps({
  route: {
    type: Object,
    default: () => ({}),
    required: true
  }
})

/*
  解析路由
*/
const onlyOneChild = reactive({ obj: {} })
function hasOneShowingChild(children = [], parent = {}) {
  // 1、当只有一个子路由时，默认情况下显示子路由
  if (children.length === 1) {
    onlyOneChild.obj = children[0] // 临时设置（如果只有一个显示子项，则将使用）
    return true
  }
  // 2、如果没有要显示的子路由，则显示父路由
  if (children.length === 0) {
    onlyOneChild.obj = parent
    return true
  }
  return false
}
</script>
