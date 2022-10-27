<template>
  <RouterView />
  <footer class="app-footer">
    <a target="_blank" rel="noopener noreferrer" href="http://www.beian.miit.gov.cn">蜀ICP备17031321号</a>
  </footer>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { service } from '@/service'

const userStore = useUserStore()

const init = async () => {
  const { data } = await service.checkLoginStatus({ ignoreErrorTips: true })
  userStore.setUser(data)
}

init()
</script>

<style lang="less">
@import 'assets/style/iconfont.css';
@import 'assets/style/index.less';

.app-footer {
  position: fixed;
  left: 10px;
  bottom: 10px;
  a {
    font-size: 12px;
    text-decoration: none;
    color: #bbc7cc;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
