<template>
  <div class="wrapper">
    <blog-header :user="user"></blog-header>
    <blog-links @openDialog="openDialog" :user="user"></blog-links>
    <transition name="move" mode="out-in">
      <router-view></router-view>
    </transition>
    <login-dialog :isVisible="dialogVisible" @closeDialog="closeDialog"></login-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import BlogHeader from '../base/BlogHeader'
  import BlogLinks from  '../base/BlogLinks'
  import LoginDialog from '../base/LoginDialog'
  import {getStorage} from '../../lib/lib'
  import service from '../../service/apiManage'
  export default{
    name:'index',
    props:{
      user:{
        default:'Calabash'
      }
    },
    components:{
      'blog-header':BlogHeader,
      'blog-links':BlogLinks,
      'login-dialog':LoginDialog
    },
    data(){
      return{
        dialogVisible:false,
        currentUser:getStorage('currentUser')
      }
    },
    methods:{
      openDialog(){
        this.currentUser = getStorage('currentUser')
        if(!this.currentUser){
          this.dialogVisible=true
        }else{
          this.$router.push({path:`/${this.currentUser}/manage`})
        }
      },
      closeDialog(){
        this.dialogVisible=false
      },
    }
  }
</script>




