<template>
  <el-menu default-active="发布文章" class="manage-left el-menu-vertical-demo" :collapse="isCollapse">
    <el-menu-item
      v-for="(item, index) in menu"
      :index="item.label"
      :key="index"
      @click="handleClick(item)"
    >
      <i :class="item.icon"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script type="text/ecmascript-6">
  import { mapActions, mapGetters } from 'vuex'

  export default{
    name: 'ManageSideBar',
    props: ['innerWidth', 'menu'],
    computed: {
      ...mapGetters(['userName']),
      isCollapse() {
        return this.innerWidth <= 480
      },
    },
    methods: {
      ...mapActions(['logout']),
      handleClick(item) {
        if (item.path) {
          this.$router.push(item.path)
        } else if (item.label === '注销') {
          this.logout({ userName: this.userName })
        } else if (item.label === '返回首页'){
          this.$router.push(`/${this.userName}`)
        }
      },
    }
  }
</script>

<style scoped lang="less">
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
