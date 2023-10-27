<template>
  <el-container class="layout">
    <el-header style="height: 70px; padding: 0">
      <Header></Header>
    </el-header>
    <el-container style="height: calc(100% - 70px)">
      <el-aside>
        <Menu></Menu>
      </el-aside>
      <el-main>
        <Navigation></Navigation>
        <router-view v-slot="{ Component }">
          <Transition name="slide-fade">
            <keep-alive include="home">
              <component :is="Component" class="mainss scrollbar"></component>
            </keep-alive>
          </Transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import Header from './Header.vue'
import Menu from './Menu.vue'
import Navigation from './Navigation.vue'
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
  flex-direction: column;
  .el-aside {
    width: auto;
    background-color: #fff;
  }
  .el-header {
    height: 50px;
    border-bottom: 1px solid #ddd;
  }
  .el-main {
    padding: 10px 20px;
    background-color: #f5f7fa;
    overflow: hidden;
    :deep(.mainss) {
      width: 100%;
      min-width: 100%;
      // min-width: 800px;
      height: calc(100% - 50px);
      border-radius: 5px;
      overflow: auto;
    }
  }
}
.slide-fade-enter-active {
  transition:all 0.5s cubic-bezier(0.5, 0.5, 0.8, 1);
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.5, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
