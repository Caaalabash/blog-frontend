<template>
  <div class="index-links">
    <a  :href="infoList.twitter" target="_blank">
      <img src="../../assets/twitter.png" alt="">
    </a>
    <a  :href="infoList.github" target="_blank">
      <img src="../../assets/github.png" alt="">
    </a>
    <a  :href="infoList.weibo" target="_blank">
      <img src="../../assets/weibo.png" alt="">
    </a>
    <a href="" @click.prevent="login">
      <img src="../../assets/user.png" alt="">
    </a>
  </div>
</template>

<script type="text/ecmascript-6">
  export default{
    name:'BlogLinks',
    props:['user','users'],
    data(){
      return{
        infoList:this.users.userInfo
      }
    },
    methods:{
      login(){
        this.$emit('openDialog')
      },
    }

  }
</script>


