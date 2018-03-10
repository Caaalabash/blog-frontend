<template>
  <div class="page-container">
    <div class="index-container">
      <blog-header :user="user" :users="users" ></blog-header>
      <blog-links :user="user" :users="users" @openDialog="openDialog"></blog-links>
     <transition name="move" mode="out-in">
        <router-view :users="users"></router-view>
      </transition>
       <login-dialog :openLoginDialog="openLoginDialog" @closeDialog="closeDialog"></login-dialog>
    </div>
  </div>

</template>

<script lang="ts">
  import Vue from "vue";
  import Component from "vue-class-component";
  import {  Prop , Watch } from 'vue-property-decorator'
  import { State, Action, Getter,Mutation } from "vuex-class"
  import BlogHeader from '../base/BlogHeader.vue'
  import BlogLinks from  '../base/BlogLinks.vue'
  import LoginDialog from '../base/LoginDialog.vue'

  @Component({
    components:{
      'blog-header':BlogHeader,
      "blog-links":BlogLinks,
      "login-dialog":LoginDialog
    }
  })
  export default class Index extends Vue{
    //prop
    @Prop({default:''})
      user:any
    @Getter openLoginDialog:any
    @Getter loginStatus:any
    @Getter users:any
    @Mutation OPEN_LOGIN_DIALOG:any
    //method
    closeDialog(){
      this.OPEN_LOGIN_DIALOG(false)
    }
    openDialog(){
      if(!this.loginStatus){
          this.OPEN_LOGIN_DIALOG(true)
        }else{
          this.$router.push({path:`/${this.users.userName}/manage`})
        }
    }
  }
</script>

<style >
  .page-container{
    display: flex;
    justify-content: center;
    width: 750px;
    padding: 10px;
    height: inherit;
  }
  .index-container{
    display: flex;
    flex-direction: column;
    flex:0 1 750px;
    width: inherit;
    height: inherit;
  }
  .index-header{
    margin-top: 50px;
    letter-spacing: 5px;
    cursor: pointer;
    text-align: center;
  }
  .index-header>a{
    font-size: 20px;
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
  /*@media screen and (max-width: 700px) {
    .index-main{
      margin: 10px;
    }
  }*/

</style>





