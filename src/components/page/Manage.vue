<template>
  <div>
    <manage-side-bar :user="user"></manage-side-bar>
    <router-view class="right" :user="user"></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import ManageSideBar from '../base/ManageSideBar.vue'
export default{
  name:'Manage',
  props:{
    user:{
      default:''
    }
  },
  components:{
    'manage-side-bar':ManageSideBar
  }
}
</script>

