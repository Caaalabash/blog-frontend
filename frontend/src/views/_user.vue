<template>
  <main class="index-layout">
    <BlogHeader :user="user" :infoList="infoList" @open="openDialog" />
    <router-view class="index-layout-content" />
    <LoginDialog :visible="showLoginDialog" @close="closeDialog" />
  </main>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import BlogHeader from '@/components/BlogHeader'
import LoginDialog from '@/components/LoginDialog'

export default {
  name: 'index',
  props: ['user'],
  components: {
    BlogHeader,
    LoginDialog
  },
  data: () => ({
    infoList: {
      twitter: 'https://twitter.com/caaalabash',
      github: 'https://github.com/Caaalabash',
      juejin: 'https://juejin.im/user/5a9009795188257a7f1dbf70'
    },
    showLoginDialog: false,
  }),
  computed: {
    ...mapState(['users']),
  },
  watch: {
    user: 'getInfo'
  },
  created() {
    this.getInfo()
  },
  methods: {
    openDialog() {
      if (this.users && this.users.userName) {
        this.$router.push(`/admin/new`)
      } else {
        this.showLoginDialog = true
      }
    },
    closeDialog() {
      this.showLoginDialog = false
    },
    getInfo() {
      this.$api.getUserInfo({ userName: this.user }).then(res => {
        this.infoList = { ...this.infoList, ...res.data }
      })
    }
  },
}
</script>

<style lang="less">
  .index-layout {
    padding: 58px 0 24px;
    background-color: rgb(82, 86, 89);
    &-content {
      box-sizing: border-box;
      width: 720px;
      min-height: calc(100vh - 82px);
      margin: 0 auto;
    }
  }
  @media (max-width: 768px) {
    .index-layout {
      padding: 58px 10px 10px;
      &-content {
        box-sizing: border-box;
        width: 100%;
        min-height: calc(100vh - 68px);
      }
    }
  }
</style>