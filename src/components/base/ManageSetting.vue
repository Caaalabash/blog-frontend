<template>
  <div class="manage_right">
    <el-input v-model="userInfo.twitter">
      <template slot="prepend">Twitter</template>
    </el-input>
    <el-input v-model="userInfo.github">
      <template slot="prepend">Github</template>
    </el-input>
    <el-input v-model="userInfo.weibo">
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
  computed:{
    ...mapGetters([
      'userInfo'
    ])
  },
  methods:{
    ...mapActions([
      'getUserInfo',
      'updateUserInfo'
    ]),
    _getUserInfo(){
      this.getUserInfo({userName:this.users.userName})
    },
    _changeUserInfo(){
      this.updateUserInfo(Object.assign(this.userInfo,{userName:this.users.userName}))
    }
  },
  created(){
    this._getUserInfo()
  }
}
</script>
