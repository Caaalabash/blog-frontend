<template>
  <main class="index-layout">
    <BlogHeader :user="user" :infoList="infoList" @open="openDialog" />
    <router-view class="index-layout-content" />
    <LoginDialog :visible="showLoginDialog" @close="closeDialog" />
  </main>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapActions } from 'vuex'
import BlogHeader from '../components/BlogHeader'
import LoginDialog from '../components/LoginDialog'
import apiManage from '../service/apiManage'

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
    ...mapGetters([
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
    openDialog() {
      apiManage.checkStatus().then(res => {
        if (res.errno === 1) this.showLoginDialog = true
        else this.$router.push(`/${this.userName}/manage`)
      })
    },
    closeDialog() {
      this.showLoginDialog = false
    },
    getInfo() {
      this.$api.getUserInfo({ userName: this.user }).then(res => {
        this.infoList = { ...this.infoList, ...res.data }
        this.setUserInfo(this.infoList)
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