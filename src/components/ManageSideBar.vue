<template>
  <el-menu
    default-active="new-idea"
    class="manage-left el-menu-vertical-demo "
    :router="true"
    :collapse="isCollapse"
  >
    <el-menu-item index="new-idea">
      <i class="el-icon-edit-outline"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="ideas">
      <i class="el-icon-search"></i>
      <span slot="title">管理文章</span>
    </el-menu-item>
    <el-menu-item index="setting">
      <i class="el-icon-setting"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
    <el-menu-item index="chat">
      <i class="el-icon-message"></i>
      <span slot="title">站内信</span>
    </el-menu-item>
    <el-menu-item index="pv" v-if="isAdmin">
      <i class="el-icon-bell"></i>
      <span slot="title">日志</span>
    </el-menu-item>
    <el-menu-item index="MaxeanoOnly" v-if="isMaxeano">
      <i class="el-icon-star-off"></i>
      <span slot="title">猪猪专属</span>
    </el-menu-item>
    <el-menu-item :index="`/${userName}`" >
      <i class="el-icon-back"></i>
      <span slot="title">我的首页</span>
    </el-menu-item>
    <el-menu-item index="/" >
      <i class="el-icon-back"></i>
      <span slot="title">网站首页</span>
    </el-menu-item>
    <el-menu-item index="/" @click="_logout">
      <i class="el-icon-close"></i>
      <span slot="title">退出登录</span>
    </el-menu-item>
  </el-menu>
</template>

<script type="text/ecmascript-6">
import { mapActions, mapGetters } from 'vuex'
export default{
  name: 'ManageSideBar',
  props: ['innerWidth'],
  computed: {
    ...mapGetters([
      'userName',
      'isMaxeano',
      'isAdmin'
    ]),
    isCollapse() {
      return this.innerWidth <= 480
    },
  },
  methods: {
    ...mapActions([
      'logout'
    ]),
    _logout () {
      this.logout({ userName: this.userName })
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
