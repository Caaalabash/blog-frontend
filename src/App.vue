<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import register from './register-service-worker'
  export default {
    name:'App',
    mounted() {
      window.addEventListener('load', register)
    },
    beforeDestroy() {
      window.removeEventListener('load', register)
    },
  }
</script>

<style lang="less">
  @import './assets/style/index.less';
</style>
