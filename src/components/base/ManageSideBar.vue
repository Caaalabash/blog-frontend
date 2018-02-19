<template>
  <div class="sidebar">
    <router-link to="new-idea" tag="h3">发布文章</router-link>
    <router-link to="ideas" tag="h3">管理文章</router-link>
    <router-link to="setting" tag="h3">个人设置</router-link>
    <router-link :to="`/${users.userName}`" tag="h3">返回首页</router-link>
    <h3 @click="logout" >退出登录</h3>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapMutations} from 'vuex'
export default{
  name:'ManageSideBar',
  props:['users'],
  methods:{
    ...mapMutations([
      'LOG_OUT'
    ]),
    logout(){
      this.LOG_OUT()
      this.$router.push('/')
    }
  }
}
</script>
