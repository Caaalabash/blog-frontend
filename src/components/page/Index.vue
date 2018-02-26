<template>
  <div class="page-container">
    <div class="index-container">
      <blog-index-header :user="user" :users="users" ></blog-index-header>
      <blog-index-links @openDialog="openDialog" :user="user" :users="users"></blog-index-links>
      <transition name="move" mode="out-in">
        <router-view :users="users"></router-view>
      </transition>
      <login-dialog :openLoginDialog="openLoginDialog" @closeDialog="closeDialog"></login-dialog>
    </div>
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
      'blog-index-header':BlogHeader,
      'blog-index-links':BlogLinks,
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
      },
    }
  }
</script>

<style >
  .page-container{
    display: flex;
    justify-content: center;
    width: inherit;
    height: inherit;
  }
  .index-container{
    display: flex;
    flex-direction: column;
    flex:0 1 700px;
    width: inherit;
    height: inherit;
  }
  .index-header{
    margin-top: 50px;
    letter-spacing: 5px;
    cursor: pointer;
    text-align: center;
  }
  .index-links{
    margin-top: 20px;
    text-align: center;
  }
  .index-main{
    margin-top: 20px;
  }
  .index-links a {
    cursor: pointer;
    margin: 0 5px;
  }
  .index-links img {
    width: 15px;
    height: 15px;
  }
  @media screen and (max-width: 700px) {
    .index-main{
      margin: 10px;
    }
  }

</style>





