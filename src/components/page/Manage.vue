<template>
  <el-container class="flex_container">
    <manage-side-bar :users="users" class="flex_left"></manage-side-bar>
    <el-main class="flex_right">
      <router-view :users="users"></router-view>
    </el-main>
  </el-container>
</template>

<script type="text/ecmascript-6">

import ManageSideBar from '../base/ManageSideBar.vue'
import {mapGetters} from 'vuex'

export default{
  name:'Manage',
  computed:{
    ...mapGetters([
      'users'
    ])
  },
  components:{
    'manage-side-bar':ManageSideBar
  }
}
</script>
<style>
  .flex_container{
    display: flex;
  }
  .flex_left{
    flex:3;
    margin-top: 10vh;
  }
  .flex_right{
    flex:12;
  }
</style>

