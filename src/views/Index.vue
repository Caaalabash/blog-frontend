<template>
  <main class="index-layout">
    <BlogHeader :user="user" :infoList="infoList" @open="openDialog" />
    <router-view class="index-layout-content" />
    <LoginDialog :visible="showLoginDialog" @close="closeDialog" />
  </main>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapActions, mapState } from 'vuex'
import BlogHeader from '../components/BlogHeader'
import LoginDialog from '../components/LoginDialog'

export default {
  name: 'index',
  props: ['user'],
  components: {
    BlogHeader,
    LoginDialog
  },
  data: () => ({
    infoList: {
      twitter: 'http://www.lanternpro.site/',
      github: 'https://github.com/',
      weibo: 'https://weibo.com/'
    },
    showLoginDialog: false,
  }),
  computed: {
    ...mapState(['token']),
    ...mapGetters([
      'loginStatus',
      'userName',
    ])
  },
  watch: {
    user: 'getInfo'
  },
  methods: {
    ...mapActions([
      'checkStatus',
      'setUserInfo'
    ]),
    async openDialog() {
      if (this.token) await this.checkStatus({ userName: this.userName })
      if (!this.loginStatus) this.showLoginDialog = true
    },
    closeDialog() {
      this.showLoginDialog = false
    },
    getInfo() {
      this.$api.getUserInfo({ userName: this.user }).then(res => {
        this.infoList = { ...this.infoList, ...res.res }
        if (this.loginStatus) this.setUserInfo(this.infoList)
      })
    }
  },
  created() {
    this.getInfo()
  },
}
</script>

<style lang="less">
  .index-layout {
    padding: 50px 30px 0;
    &-content {
      width: 700px;
      margin: 0 auto;
    }
  }
  @media (max-width: 768px) {
    .index-layout {
      padding: 50px 24px 0;
      &-content {
        width: 100%;
      }
    }
  }
</style>





