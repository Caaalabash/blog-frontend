<template>
  <div>
    <manage-side-bar :users="users"></manage-side-bar>
    <router-view class="right" :users="users"></router-view>
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

