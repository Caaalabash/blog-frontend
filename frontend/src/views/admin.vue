<template>
  <div class="manage-container" v-resize="handleResize">
    <!--侧边栏区域-->
    <el-menu default-active="发布文章" class="manage-left el-menu-vertical-demo" :collapse="isCollapse">
      <el-menu-item
        v-for="(item, index) in menu"
        :index="item.label"
        :key="index"
        @click="handleClick(item)">
        <i :class="item.icon"></i>
        <span slot="title">{{ item.label }}</span>
      </el-menu-item>
    </el-menu>
    <!--右侧内容区域-->
    <router-view :user="user" :innerWidth="innerWidth" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'admin',
  data: () => ({
    innerWidth: window.innerWidth,
    menu: [
      { path: '/admin/new', icon: 'el-icon-edit-outline', label: '发布文章' },
      { path: '/admin/articles', icon: 'el-icon-search', label: '管理文章' },
      { path: '/', icon: 'el-icon-back', label: '返回首页' },
      { icon: 'el-icon-close', label: '注销' }
    ]
  }),
  computed: {
    ...mapState(['user']),
    isCollapse() {
      return this.innerWidth <= 480
    },
  },
  methods: {
    ...mapActions(['logout']),
    handleResize() {
      this.innerWidth = window.innerWidth
    },
    async handleClick(item) {
      if (item.path) {
        this.$router.push(item.path)
      } else if (item.label === '注销') {
        await this.logout()
        this.$router.push('/')
      } else if (item.label === '返回首页') {
        this.$router.push('/')
      }
    },
  },
}
</script>

<style scoped lang="less">
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .manage-container {
    display: flex;
    width: 100%;
    height: 100%;
  }
  .manage-left {
    flex:0 0 64px;
    height: 100%;
    border-right: 1px solid #c9c9c9;
  }
  .manage-right {
    flex:1 1 900px;
    margin: 20px 30px 0 30px;
    @media (max-width: 480px) {
      flex:0 0 100%;
      margin: 10px 10px 0 10px;
    }
  }
</style>

