<template>
  <el-menu
    default-active="new-idea"
    class="el-menu-vertical-demo manage-left"
    router="true"
    :collapse="isCollapse"
  >
    <el-menu-item index="new-idea">
      <icon class="el-icon-edit-outline"></icon>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="ideas">
      <icon class="el-icon-search"></icon>
      <span slot="title">管理文章</span>
    </el-menu-item>
    <el-menu-item index="setting">
      <icon class="el-icon-setting"></icon>
      <span slot="title">个人设置</span>
    </el-menu-item>
    <el-menu-item :index="`/${users.userName}`">
      <icon class="el-icon-back"></icon>
      <span  slot="title">返回首页</span>
    </el-menu-item>
    <el-menu-item index="/" @click="logout">
      <icon class="el-icon-close"></icon>
      <span  slot="title">退出登录</span>
    </el-menu-item>
  </el-menu>
</template>

<script type="text/ecmascript-6">
import {mapMutations} from 'vuex'
export default{
  name:'ManageSideBar',
  props:['users'],
  data(){
    return{
      isCollapse:window.innerWidth<420
    }
  },
  methods:{
    ...mapMutations([
      'LOG_OUT'
    ]),
    logout(){
      this.LOG_OUT()
      this.$router.push('/')
    },
    handleResize(){
      this.isCollapse = window.innerWidth<420
    }
  },
  mounted(){
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy(){
    window.removeEventListener('resize', this.handleResize)
  },
}
</script>

<style>
  .manage-left{
    height: 100%;
    border-right: 1px solid #c9c9c9;
  }
</style>
