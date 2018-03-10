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

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { Prop , Watch } from 'vue-property-decorator'
import { State, Action, Getter ,Mutation} from "vuex-class";
@Component
export default class ManageSetting extends Vue{
  //data
  //props
  @Prop()
    user:string
  @Prop()
    users:any
  //state
  @Action updateUserInfo:any

  //method
  _changeUserInfo(){
      this.updateUserInfo(Object.assign(this.users.userInfo,{userName:this.users.userName}))
  }
}
</script>
