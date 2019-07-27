<template>
  <div class="manage-container" v-resize="handleResize" v-loading="!menu.length">
    <!--侧边栏区域-->
    <ManageSideBar :users="users" :innerWidth="innerWidth" :menu="menu" />
    <!--右侧内容区域-->
    <router-view :users="users" :innerWidth="innerWidth" />
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'
  import ManageSideBar from '@/components/ManageSideBar.vue'

  export default{
    name: 'admin',
    components: {
      ManageSideBar
    },
    data: () => ({
      innerWidth: window.innerWidth,
      menu: []
    }),
    computed: {
      ...mapGetters([
        'users',
      ])
    },
    created() {
      this.$api.getMenu().then(res => {
        this.menu = res.data
        if (!this.menu.length) this.$router.replace({ path: `/error?code=403` })
      })
    },
    methods: {
      handleResize() {
        this.innerWidth = window.innerWidth
      },
    },
  }
</script>

<style scoped lang="less">
  .manage-container{
    display: flex;
    width: 100%;
    height: 100%;
  }
  .manage-left{
    flex:0 0 64px;
    height: 100%;
    border-right: 1px solid #c9c9c9;
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

