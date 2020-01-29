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
    showLoginDialog: false,
  }),
  computed: {
    ...mapState(['user']),
  },
  methods: {
    openDialog() {
      if (this.user && this.user.userName) {
        this.$router.push('/admin/new')
      } else {
        this.showLoginDialog = true
      }
    },
    closeDialog() {
      this.showLoginDialog = false
    },
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