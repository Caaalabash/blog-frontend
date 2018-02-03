<template>
  <div>
    <el-input v-model="userInfo.twitter">
      <template slot="prepend">Twitter</template>
    </el-input>
    <el-input v-model="userInfo.github">
      <template slot="prepend">Github</template>
    </el-input>
    <el-input v-model="userInfo.weibo">
      <template slot="prepend">微博</template>
    </el-input>
    <el-button  icon="el-icon-edit" @click="changeUserInfo">提交</el-button>
  </div>
</template>

<script type="text/ecmascript-6">
import service from '../../service/apiManage'
export default{
  name:'ManageSetting',
  props:['user'],
  data(){
    return{
      userInfo:{
        twitter:'',
        github:'',
        weibo:''
      }
    }
  },
  methods:{
    getUserInfo(){
      service.getUserInfo({'userName':this.user}).then((res)=>{
        if(res.data.errno===0){
          this.userInfo = res.data.res
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    changeUserInfo(){
      service.changeUserInfo(Object.assign(this.userInfo,{userName:this.user})).then((res)=>{
        if(res.data.errno===0){
          this.$message.success(res.data.msg)
        }else{
          this.$message.error(res.data.msg)
        }
      })
    }
  },
  created(){
    this.getUserInfo()
  }
}
</script>
