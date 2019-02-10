<template>
  <main class="page-container">
    <div class="index-container">
      <!-- header组件 -->
      <blog-index-header :user="user" :infoList="infoList" @openDialog="openDialog"></blog-index-header>
      <!-- 文章列表部分 -->
      <router-view></router-view>
      <!-- 登陆弹窗部分 -->
      <login-dialog :openLoginDialog="showLoginDialog" @closeDialog="closeDialog"></login-dialog>
    </div>
  </main>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapActions, mapState } from 'vuex'
import BlogHeader from '../components/BlogHeader'
import LoginDialog from '../components/LoginDialog'

export default{
  name: 'index',
  // 来源为router动态参数
  props: ['user'],
  components: {
    'blog-index-header': BlogHeader,
    'login-dialog': LoginDialog
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
      // token过期则需要重新登录
      if (this.token) await this.checkStatus({ userName: this.userName })
      if (!this.loginStatus) this.showLoginDialog = true
    },
    closeDialog() {
      this.showLoginDialog && (this.showLoginDialog = false)
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

<style lang="less" >
  @import '../assets/style/index.less';
  .page-container{
    display: flex;
    justify-content: center;
    width: inherit;
    height: inherit;

    .index-container{
      .fl-column;
      flex:0 1 700px;
      width: inherit;
      height: inherit;
    }
  }
  /*用于假装遮罩层*/
  .fake{
    .fl-column;
    align-items: center;
    box-shadow: none;
    background-color: transparent;
    visibility: hidden;

    .dialogSrc{
      visibility: visible;
      width: 40vw;

      @media (max-width:950px){
        width: 50vw;
      }
      @media (max-width:480px){
        width:70vw;
      }
    }
  }
</style>





