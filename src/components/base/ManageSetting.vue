<template>
  <div class="manage-right">
    <el-input v-model="users.userInfo.twitter">
      <template slot="prepend">Twitter</template>
    </el-input>
    <el-input v-model="users.userInfo.github">
      <template slot="prepend">Github</template>
    </el-input>
    <el-input v-model="users.userInfo.weibo">
      <template slot="prepend">微博</template>
    </el-input>
    <el-button  icon="el-icon-edit" @click="_changeUserInfo">提交</el-button>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters,mapActions} from 'vuex'
export default{
  name:'ManageSetting',
  props:['user','users'],
  data(){
    return{
    }
  },

  methods:{
    ...mapActions([
      'updateUserInfo'
    ]),
    _changeUserInfo(){
      this.updateUserInfo(Object.assign(this.users.userInfo,{userName:this.users.userName}))
    }
  }
}
</script>
