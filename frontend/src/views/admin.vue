<template>
  <div class="manage-container" v-resize="handleResize" v-loading="!menu.length">
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
    <router-view :users="users" :innerWidth="innerWidth" />
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapActions } from 'vuex'

  export default{
    name: 'admin',
    data: () => ({
      innerWidth: window.innerWidth,
      menu: []
    }),
    computed: {
      ...mapGetters([
        'users',
      ]),
      isCollapse() {
        return this.innerWidth <= 480
      },
    },
    created() {
      this.$api.getMenu().then(res => {
        this.menu = res.data
        if (!this.menu.length) this.$router.replace({ path: `/error?code=403` })
      })
    },
    methods: {
      ...mapActions(['logout']),
      handleResize() {
        this.innerWidth = window.innerWidth
      },
      handleClick(item) {
        if (item.path) {
          this.$router.push(item.path)
        } else if (item.label === '注销') {
          this.logout({ userName: this.userName })
        } else if (item.label === '返回首页'){
          this.$router.push(`/${this.userName}`)
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
  .manage-container{
    display: flex;
    width: 100%;
    height: 100%;
  }
  .manage-left{
    flex:0 0 64px;
    height: 100%;
    border-right: 1px solid #c9c9c9;
  }
  .manage-right{
    flex:1 1 900px;
    margin: 20px 30px 0 30px;
    @media (max-width: 480px){
      flex:0 0 100%;
      margin: 10px 10px 0 10px;
    }
  }
</style>

