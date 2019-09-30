<template>
  <main class="index-layout">
    <router-view class="index-layout-content" />
    <div class="invisible-login" @click="openDialog"></div>
    <LoginDialog :visible="showLoginDialog" @close="closeDialog" />
  </main>
</template>

<script>
import { mapState } from 'vuex'
import LoginDialog from '@/components/LoginDialog'

export default {
  name: 'index',
  props: ['user'],
  components: {
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
  .index-layout-content {
    box-sizing: border-box;
  }
  .invisible-login {
    position: absolute;
    top: 0;
    left: 0;
    width: 30px;
    height: 30px;
  }
</style>