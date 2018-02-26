<template>
  <div class="container">
    <div class="manage-container">
      <manage-side-bar :users="users" ></manage-side-bar>
      <router-view :users="users"></router-view>
    </div>
  </div>
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
.container{
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
}
.manage-container{
  display: flex;
  width: 100%;
}
.manage-left{
  flex-basis: 200px;
  height: 100%;
  border-right: 1px solid #c9c9c9;
}
.manage-right{
  margin: 20px 0 0 50px;
  flex-basis: 700px;
}
@media screen and (max-width: 420px) {
  .manage-right{
    margin: 10px 0 0 10px;
    flex-basis: 100%;
  }
  .manage-left{
    flex-basis: 64px;
  }
}
</style>

