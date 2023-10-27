<template>
  <div class="navigation">
    <el-tabs v-model="activeTab" type="card" @tab-remove="removeTab" @tab-click="tabClick">
      <template v-for="item in navigationObj.list" :key="item.path">
         <el-tab-pane v-if="item.path != '/login'"  :label="item.title" :name="item.path" closable> </el-tab-pane>
      </template>
     
    </el-tabs>
    <div class="custom-contextmenu-box">
      <z-mask :show="showContextmenu" :bgColor="'rgba(0,0,0,0)'" @close="showContextmenu = false"></z-mask>
      <ul class="custom-contextmenu" v-show="showContextmenu">
        <li v-for="(item, i) in contextmenuArr" :key="i" @click="contextmenuClick(item.event)">{{ item.text }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
const store = useStore()
const router = useRouter()
const route = useRoute()

const activeTab = ref('') // 点击选中的当前导航
const navigationObj = reactive({ list: [] }) // 导航数组list
// 自定义右侧菜单数据
const contextmenuArr = reactive([
  { text: '重新加载', event: relaod },
  { text: '关闭所有', event: closeAll },
  { text: '关闭左侧', event: closeLeft },
  { text: '关闭右侧', event: closeRight },
  { text: '关闭其他', event: closeOthers }
])
const showContextmenu = ref(false) // 是否显示右侧菜单
const savePath = ref('') // 保存右侧菜单选中的导航栏路径

onMounted(() => {
  // 初始化快捷导航列表及当前选中项
  navigationObj.list = store.state.user.navigationList
  activeTab.value = route.path
  // 获取DOM，用于自定义右键菜单
  const itemDom = document.getElementsByClassName('el-tabs__header is-top')
  itemDom[0].oncontextmenu = openMenu
})

// 监听路由
watch(
    () => route.path,
    () => {
      activeTab.value = route.path
      addNavigation()
    },
    { immediate: true }
)

// 移除导航
function removeTab(targetPath) {
  let activePath = activeTab.value
  const tabs = navigationObj.list
  if (activePath === targetPath) {
    tabs.forEach((tab, index) => {
      if (tab.path === targetPath) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activePath = nextTab.path
        }
      }
    })
  }
  store.commit('user/REMOVE_NAVIGATIONLIST', targetPath)
  navigationObj.list = store.state.user.navigationList
  activeTab.value = activePath
  router.push(activePath)
}

// 点击导航
function tabClick(item) {
  router.push(item.props.name)
}

// 添加导航
function addNavigation() {
  const { path, meta } = route
  const tab = {
    path: path,
    title: meta.title
  }
  store.commit('user/SET_NAVIGATIONLIST', tab)
}

// 自定义右侧菜单
const openMenu = e => {
  e.preventDefault()
  savePath.value = ''
  const obj = e.srcElement || e.target
  if (!obj.id) {
    showContextmenu.value = false
  } else {
    savePath.value = obj.id.split('-')[1]
    const elTabsContent = document.getElementsByClassName('custom-contextmenu')
    elTabsContent[0].style.left = e.clientX + 'px'
    showContextmenu.value = true
  }
}

// 右侧菜单事件
const contextmenuClick = eventName => {
  eventName()
  showContextmenu.value = false
}

// 重新加载
function relaod() {
  if (activeTab.value === savePath.value) {
    router.go(0)
    return
  }
  activeTab.value = savePath.value
  router.push(savePath.value)
  setTimeout(() => router.go(0), 150)
}

// 关闭所有
function closeAll() {
  navigationObj.list.slice(1).forEach(v => {
    store.commit('user/REMOVE_NAVIGATIONLIST', v.path)
  })
  activeTab.value = navigationObj.list[0].path
  router.push(activeTab.value)
}

// 关闭左侧
function closeLeft() {
  const index = navigationObj.list.findIndex(v => v.path === savePath.value)
  if (index === 0 || index === 1) return
  navigationObj.list.slice(1, index).forEach(v => {
    store.commit('user/REMOVE_NAVIGATIONLIST', v.path)
  })
  activeTab.value = savePath.value
  router.push(activeTab.value)
}

// 关闭右侧
function closeRight() {
  const index = navigationObj.list.findIndex(v => v.path === savePath.value)
  const length = navigationObj.list.length
  if (index === length - 1) return
  navigationObj.list.slice(index + 1).forEach(v => {
    store.commit('user/REMOVE_NAVIGATIONLIST', v.path)
  })
  activeTab.value = savePath.value
  router.push(activeTab.value)
}

// 关闭其他
function closeOthers() {
  const index = navigationObj.list.findIndex(v => v.path === savePath.value)
  navigationObj.list.slice(index + 1).forEach(v => {
    store.commit('user/REMOVE_NAVIGATIONLIST', v.path)
  })
  if (navigationObj.list.length >= 3) {
    navigationObj.list.slice(1, index).forEach(v => {
      store.commit('user/REMOVE_NAVIGATIONLIST', v.path)
    })
  }
  activeTab.value = savePath.value
  router.push(activeTab.value)
}
</script>

<style lang="scss" scoped>
.navigation {
  height: 50px;
}
:deep(.el-tabs) {
  height: 100%;
  z-index: 0;
  .el-tabs__header {
    border-bottom: 0;
    margin: 0;
    .el-tabs__nav-prev,
    .el-tabs__nav-next {
      height: 100%;
      @include flex(center, center);
      border: 1px solid $color1;
      color: $color1;
    }
    .el-tabs__nav {
      border: 0;
    }
    .el-tabs__item {
      margin-right: 10px;
      color: $color5;
      height: 38px;
      line-height: 38px;
      border: 0;
      background-color: #fff;
      border-radius: 5px;
      font-size: 16px;
      &:hover,
      &.is-active {
        color: $color1;
        .el-icon,
        .el-icon-close {
          color: $color1;
          right: -4px;
          font-size: 20px;
        }
      }
      .el-icon,
      .el-icon-close:hover {
        background-color: transparent;
      }
    }
    // 导航第一项不允许删除
    .el-tabs__item:first-child > i {
      display: none;
    }
    .el-tabs__item:first-child:hover > i {
      display: none;
    }
  }
}
.custom-contextmenu-box {
  .custom-contextmenu {
    position: fixed;
    z-index: 9;
    left: 0;
    top: 100px;
    background-color: #408ea1;
    border-radius: 5px;
    padding: 10px 15px;
    font-size: 14px;
    > li {
      height: 30px;
      color: #fff;
      border-bottom: 1px dashed #fefefe;
      @include flex(center, center);
      cursor: pointer;
      user-select: none;
    }
    > li:hover {
      color: #00ffff;
      border-bottom: 1px dashed #00ffff;
    }
  }
}
</style>
