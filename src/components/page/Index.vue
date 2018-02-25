<template>
  <div class="gird-container">
    <blog-header :user="user" :users="users" ></blog-header>
    <blog-links @openDialog="openDialog" :user="user" :users="users"></blog-links>
    <transition name="move" mode="out-in">
      <router-view :users="users"></router-view>
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
      },
    }
  }
</script>

<style >
  .gird-container{
    display: grid;
    height: 100vh;
    width: 100vw;
    grid-template-columns: auto 700px auto;
    grid-template-rows:100px 30px auto ;
    grid-template-areas: ". header ."
    ". links  ."
    ". main   .";
  }
  .header{
    grid-area: header;
    padding-top: 50px;
    letter-spacing: 5px;
    text-align: center;
  }
  .header a {
    font-size: 15px;
    color: #444;
  }
  .links{
    grid-area:links;
    text-align: center;
    font-family: "Roboto", "Helvetica Neue", "Hiragino Sans GB", "LiHei Pro", Arial, serif;
    color: #999;
    font-size: 24px;
  }
  .links a {
    cursor: pointer;
    padding: 2px;
    margin: 0 3px;
  }
  .links img {
    width: 15px;
    height: 15px;
  }
  .main{
    grid-area:main;
  }
  @media screen and (max-width: 420px) {
    .header {
      padding-top: 40px;
    }
    .header a {
      font-size: 14px;
    }
    .gird-container{
      grid-template-columns: auto 70vw auto;
    }
  }
</style>





