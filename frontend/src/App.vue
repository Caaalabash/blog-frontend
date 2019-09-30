<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'App',
  methods: {
    ...mapActions(['visit', 'initStatus'])
  },
  created() {
    this.visit()
    this.initStatus()
  },
}
</script>

<style lang="less">
  @import 'assets/style/iconfont.css';
  @import 'assets/style/index.less';
</style>
