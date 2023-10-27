<template>
  <div class="header">
    <div class="left">
      <p>{{ title }}</p>
    </div>
    <div class="right">
      <div class="user_center">
        <el-icon :size="44" color="#3165da">
          <User/>
        </el-icon>
        <el-dropdown>
          <span style="display: flex;align-items: center">
              <span style="margin-right: 5px">{{ store.state.user.userInfo.name || '超级管理员' }}</span>
              <span style="margin-right: 5px;">( {{ store.state.user.userInfo.nickname  || 'Admin' }} )</span>
             <el-icon> <ArrowDown/></el-icon>
          </span>
          <!-- <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </template> -->
        </el-dropdown>
      </div>

      <el-icon :size="44" color="#3165da" style="cursor: pointer" @click="LoginOut">
        <SwitchButton/>
      </el-icon>

    </div>

  </div>

</template>

<script setup>
import { User, ArrowDown, SwitchButton} from "@element-plus/icons-vue"

import {reactive, ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import msg from "@/utils/resetMessage";
import {loginOut} from "@/api/user.js"

const store = useStore()
const router = useRouter()
const title = ref(window.URL_CONFIG.TITLE)

function LoginOut(){
  loginOut()
    .then(res=>{
    store.commit('user/SET_TOKEN', '')
    store.commit('user/SET_USERINFOR', {})
    store.commit('user/SET_ROLES', [])
    store.commit('user/SET_MENULIST', [])
    store.commit('user/REMOVE_NAVIGATIONLIST_ALL')
    sessionStorage.setItem('store', '')
    router.push('/login')
    })

}

</script>

<style lang="scss" scoped>
.header {
  box-sizing: border-box;
  height: 100%;
  @include flex(center, space-between);
  flex-wrap: nowrap;
  color: #fff;
  background:linear-gradient(to bottom,rgba(75,160,163,.7) 0%,rgba(75,160,163,1) 100% );
  padding: 10px 35px;
  overflow: hidden;

  .left {
    @include flex();

    img {
      height: 60px;
      width: 60px;
    }

    p {
      font-weight: 900;
      font-size: 24px;
      letter-spacing: 2px;
      margin-left: 10px;
      color: #fff;
    }
  }

  .right {
    height: 100%;
    box-sizing: border-box;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    padding: 0 5px;
    background-color: #fff;
    border-radius: 7px;
    color: #666;

    // &::after {
    //   position: absolute;
    //   top: 0;
    //   left: -60px;
    //   content: '';
    //   height: 0;
    //   width: 0;
    //   border-top: 44px solid transparent;
    //   border-right: 43px solid transparent;
    //   border-bottom: 43px solid transparent;
    //   border-left: 43px solid #fff;
    //   transform: rotate(45deg) translate(27px, -4px);
    //   border-bottom-left-radius: 10px;
    //   border-top-left-radius: 10px;
    // }

    .bus_class {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 108px;
    }

    .user_center {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-dropdown{
        cursor: pointer;
      }
    }
    .el-dropdown{
      font-size: 16px;
    }
    svg {
      font-size: 24px;
      color: #4BA0A3;
    }
  }
}
</style>
