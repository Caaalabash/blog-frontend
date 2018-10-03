<template>
  <div class="manage-container">
    <!--侧边栏区域-->
    <manage-side-bar :users="users"></manage-side-bar>
    <!--右侧内容区域-->
    <router-view :users="users"></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
import ManageSideBar from '../components/ManageSideBar.vue'

export default{
  name: 'Manage',
  components: {
    'manage-side-bar': ManageSideBar
  },
  computed: {
    ...mapGetters([
      'users',
    ])
  }
}
</script>

<style scoped lang="less">
  @import '../assets/style/index.less';
  .manage-container{
    display: flex;
    width: 100%;
    height: 100%;
  }
  .manage-left{
    flex:0 0 64px;
    height: 100%;
    border-right: 1px solid @borderColor;
  }
  .manage-right{
    flex:1 1 900px;
    margin: 20px 30px 0 30px;
    @media (max-width: 480px){
      flex:0 0 100%;
      margin: 10px 10px 0 10px;
    }
  }
</style>

