<template>
  <main class='index-layout'>
    <RouterView class="index-layout-content"/>
    <div class="invisible-login" @click="openDialog"></div>
    <LoginDialog :visible="loginDialogVisible" @close="closeDialog" />
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { service } from '@/service'

const router = useRouter()
const loginDialogVisible = ref(false)

const checkLogin = () => service.checkLoginStatus({ ignoreErrorTips: true })

const openDialog = async () => {
  try {
    await checkLogin()
    router.push('/admin')
  } catch (e) {
    loginDialogVisible.value = true
  }
}
const closeDialog = (loginSuccess) => {
  loginDialogVisible.value = false
  if (loginSuccess) {
    router.push('/admin')
  }
}
</script>

<style lang='less' scoped>
.index-layout-content {
  box-sizing: border-box;
}
.invisible-login {
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 30px;
}
</style>