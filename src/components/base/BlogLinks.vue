<template>
  <div class="links">
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
  import service from '../../service/apiManage'
  export default{
    name:'BlogLinks',
    props:['user'],
    data(){
      return{
        infoList:{}
      }
    },
    methods:{
      login(){
        this.$emit('openDialog')
      },
      getLinks(){
        service.getUserInfo({userName:this.user}).then((res)=>{
          if(res.data.errno===0){
            this.infoList = res.data.res
          }else{
            this.$message.error(res.data.msg)
          }
        })
      }
    },
    created(){
      this.getLinks()
    }
  }
</script>

