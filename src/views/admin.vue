<template>
  <div class="manage-container" v-resize="handleResize">
    <!--侧边栏区域-->
    <el-menu default-active="发布文章" class="manage-left el-menu-vertical-demo" :collapse="isCollapse">
      <el-menu-item
        v-for="(item, index) in menu"
        :index="item.label"
        :key="index"
        @click="handleClick(item)">
        <el-icon>
          <component :is="item.icon"></component>
        </el-icon>
        <span slot="title">{{ item.label }}</span>
      </el-menu-item>
    </el-menu>
    <!--右侧内容区域-->
    <router-view :innerWidth="innerWidth" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { service } from '@/service'
import { useUserStore } from '@/stores/user'
import { Edit, Search, Back, Close } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const innerWidth = ref(window.innerWidth)
const menu = [
  { path: '/admin', icon: Edit, label: '发布文章' },
  { path: '/admin/articles', icon: Search, label: '管理文章' },
  { path: '/', icon: Back, label: '返回首页' },
  { icon: Close, label: '注销' }
]
const isCollapse = computed(() => innerWidth.value <= 480)
const handleResize = () => innerWidth.value = window.innerWidth
const handleClick = (item) => {
  if (item.path) {
    router.push(item.path)
  } else if (item.label === '注销') {
    service.logout().then(() =>{
      userStore.setUser({})
      router.push('/')
    })
  } else if (item.label === '返回首页') {
    router.push('/')
  }
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

