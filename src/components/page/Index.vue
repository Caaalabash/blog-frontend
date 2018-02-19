<template>
  <div class="wrapper">
    <blog-header :user="user" :users="users"></blog-header>
    <blog-links @openDialog="openDialog" :user="user" :users="users"></blog-links>
    <transition name="move" mode="out-in">
      <router-view></router-view>
    </transition>
    <login-dialog :openLoginDialog="openLoginDialog" @closeDialog="closeDialog"></login-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import BlogHeader from '../base/BlogHeader'
  import BlogLinks from  '../base/BlogLinks'
  import LoginDialog from '../base/LoginDialog'
  import {mapMutations,mapGetters} from 'vuex'
  export default{
    name:'index',
    props:['user'],
    components:{
      'blog-header':BlogHeader,
      'blog-links':BlogLinks,
      'login-dialog':LoginDialog
    },
    data(){
      return{

      }
    },
    computed:{
      ...mapGetters([
        'openLoginDialog',
        'loginStatus',
        'users'
      ])
    },
    methods:{
      ...mapMutations([
        'OPEN_LOGIN_DIALOG'
      ]),
      openDialog(){
        if(!this.loginStatus){
          this.OPEN_LOGIN_DIALOG(true)
        }else{
          this.$router.push({path:`/${this.users.userName}/manage`})
        }
      },
      closeDialog(){
        this.OPEN_LOGIN_DIALOG(false)
        if(this.loginStatus){
          console.log(1)
          this.$router.push({path:`/${this.users.userName}/manage`})
        }
      },
    }
  }
</script>




