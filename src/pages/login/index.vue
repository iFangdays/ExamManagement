<template>
  <div class="login-page">
    <div class="textTitle">
      <div>{{ title }}</div>
    </div>
    <div class="login-box">
      <div>
        <div class="title1">欢迎登录</div>
        <div class="title2">欢迎回来，请登录您的账号</div>
      </div>
      <div>
        <el-input @keydown.enter="login" v-model="form.user_name" :prefix-icon="User" placeholder="请输入账号"></el-input>
      </div>
      <div>
        <el-input @keydown.enter="login" v-model="form.user_pwd" :prefix-icon="Lock" placeholder="请输入密码"
                  type="password"></el-input>
      </div>
      <div>
        <el-checkbox v-model="checked1" label="记住密码" />
      </div>
      <div>
        <el-button v-loading.fullscreen.lock="loading" element-loading-text="登录中..." round type="primary" @click="login"
                   @keyup.enter="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import msg from '@/utils/resetMessage.js'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import {loginIn} from "@/api/user.js"

const store = useStore()
const router = useRouter()
const checked1 = ref(true)
const loading = ref(false)
const form = reactive({ user_name: '', user_pwd: '' })
const title = ref(window.URL_CONFIG.TITLE)

function login() {
  if (!form.user_name) {
    msg.warning('用户名不能为空')
  } else if (!form.user_pwd) {
    msg.warning('密码不能为空')
  } else {
    inLogin()
  }
}

function inLogin() {
  loading.value = true
  let { user_pwd: password, user_name: username } = form
  let params = { password, username }
  loginIn(params)
    .then(res=>{
    msg.success('登录成功, 即将跳转')
    store.commit('user/SET_TOKEN', res.token)
    store.commit('user/SET_USERINFOR',res.user)
    store.dispatch('user/GET_MENULIST')
    router.replace('/')
    })
    .finally(()=>loading.value = false)

}


</script>

<style lang="scss" scoped>
.login-page {
  width: 100%;
  height: 100%;
  background-image: url('~@imgs/login/login-bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .textTitle {
    position: absolute;
    top: 17%;
    left: 16%;
    font-size: 40px;
    font-weight: bolder;
    font-style: italic;
    letter-spacing: 5px;
    color: #ffffff;
    &>div:nth-child(2) {
      padding: 15px 0px;
      margin-left: 80px;
    }
  }

  .login-box {
    position: absolute;
    right: 12%;
    top: 20%;
    width: 480px;
    height: 560px;
    background-image: url('~@imgs/login/kuang.png');
    background-repeat: no-repeat;
    background-size: contain;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    font-size: 16px;

    &>div:nth-child(1) {
      width: 100%;
      height: 54px;
      position: absolute;
      text-align: left;
      top: 8%;
      left: 10%;

      .title1 {
        font-size: 42px;
        font-weight: bold;
        color: #ffffff;
        padding: 20px 0px;
      }

      .title2 {
        font-size: 18px;
        color: #ffffff;
        opacity: 0.6;
      }
    }

    &>div:nth-child(2) {
      width: 80%;
      height: 54px;
      position: relative;
      top: 32%;

      :deep(.el-input__wrapper) {
        border-radius: 25px;
      }

      :deep(.el-input__inner) {
        height: 48px;
        line-height: 48px;
      }
    }

    &>div:nth-child(3) {
      width: 80%;
      height: 54px;
      position: relative;
      top: 22%;

      :deep(.el-input__wrapper) {
        border-radius: 25px;
      }

      :deep(.el-input__inner) {
        height: 48px;
        line-height: 48px;
      }
    }

    &>div:nth-child(4) {
      width: 76%;
      height: 30px;
      position: relative;
      top: 10%
    }
    &>div:nth-child(5) {
      width: 78%;
      height: 48px;
      position: relative;
      top: 0%;

      .el-button {
        width: 100%;
        height: 100%;
        font-size: 18px;
        font-weight: bold;
        letter-spacing: 10px;
      }
    }
  }
  :deep(.el-button--primary){
    background: #226367 !important;
    border: 1px solid #226367;
  }
  :deep(.el-input){
    font-size: 18px;
    .el-input__wrapper{
      background-color: #FFFFFF;
      box-shadow: 0 0 0 2px #dfe3ec inset;
      .el-input__inner{
        color: #8c93a0;
      }
    }
  }
  :deep(.el-checkbox){
    .el-checkbox__inner{
      width: 18px;
      height: 18px;
    }
    .el-checkbox__label{
      font-size: 16px;
    }
  }
  :deep(.el-checkbox.is-checked){
    .el-checkbox__label{
      color: #ffffff !important;
    }
    .el-checkbox__inner::after{
      height: 10px;
      left: 6px;
    }
  }
}</style>
