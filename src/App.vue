<template>
  <div id="app">
    <router-view />
    <footer class="app-footer">
      <a target="_blank" rel="noopener noreferrer" href="http://www.beian.miit.gov.cn">蜀ICP备17031321号</a>
    </footer>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'App',
  methods: {
    ...mapActions(['getUserInfo'])
  },
  created() {
    this.getUserInfo()
  },
}
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
      color: #BBC7CC;
      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
