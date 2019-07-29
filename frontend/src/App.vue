<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import switchWhenImgErr from '@/lib/autoSwitch'

  export default {
    name: 'App',
    methods: {
      ...mapActions(['visit'])
    },
    created() {
      this.visit()
    },
    mounted() {
      window.addEventListener('error', switchWhenImgErr)
    }
  }
</script>

<style lang="less">
  @import 'assets/style/iconfont.css';
  @import 'assets/style/index.less';
</style>
