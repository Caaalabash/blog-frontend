<template>
  <el-menu default-active="发布文章" class="manage-left el-menu-vertical-demo" :collapse="isCollapse">
    <el-menu-item
      v-for="(item, index) in menu"
      :index="item.label"
      :key="index"
      v-if="item.visible"
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
      menu() {
        return [
          {
            path: '/admin/new',
            icon: 'el-icon-edit-outline',
            label: '发布文章',
            visible: true,
          }, {
            path: '/admin/articles',
            icon: 'el-icon-search',
            label: '管理文章',
            visible: true,
          }, {
            path: '/admin/setting',
            icon: 'el-icon-setting',
            label: '个人设置',
            visible: true,
          }, {
            path: '/admin/maxeano',
            icon: 'el-icon-star-off',
            label: '猪猪专属',
            visible: this.isMaxeano,
          }, {
            path: '/admin/chat',
            icon: 'el-icon-message',
            label: '站内信',
            visible: this.isAdmin
          }, {
            path: '/admin/pv',
            icon: 'el-icon-bell',
            label: '日志',
            visible: true,
          }, {
            path: '/',
            icon: 'el-icon-back',
            label: '返回首页',
            visible: true,
          }, {
            icon: 'el-icon-close',
            label: '注销',
            visible: true,
          }
        ]
      }
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
