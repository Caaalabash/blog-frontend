<template>
  <div class="manage_grid">
    <manage-side-bar :users="users" ></manage-side-bar>
    <router-view :users="users"></router-view>
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
.manage_grid{
  display: grid;
  grid-template-columns: 200px auto;
}
.manage_right{
  padding: 40px 0 0 40px;
}
@media screen and (max-width: 420px) {
  .manage_right{
    padding: 10px;
  }
  .manage_grid{
    grid-template-columns: 64px auto;
  }
}
</style>

