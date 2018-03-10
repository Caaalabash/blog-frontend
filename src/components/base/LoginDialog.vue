<template>
  <el-dialog  :visible.sync="openLoginDialog"
              width="50vmin"
              :before-close="handleClose">

    <el-tabs v-model="activeName">
      <el-tab-pane label="Login" name="login"></el-tab-pane>
      <el-tab-pane label="Register" name="Register"></el-tab-pane>
    </el-tabs>

    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item prop="userName">
        <el-input v-model="form.userName" placeholder="用户名">
        </el-input>
      </el-form-item>
      <el-form-item prop="userPwd">
        <el-input type="password" v-model="form.userPwd" placeholder="密码">

        </el-input>
      </el-form-item>
      <el-form-item >
        <el-button v-html="signIn" type="primary" @click="sendRequest" plain></el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import { Prop , Watch } from 'vue-property-decorator'
import { State, Action, Getter ,Mutation} from "vuex-class";
import {ElForm}  from 'element-ui/types/form'
@Component
export default class LoginDialog extends Vue{
  //data
  activeName='login'
  form={
    userName:'',
    userPwd:''
  }
  rules={
    userName:[{ required: true, message: '请输入用户名', trigger: 'blur' },
              { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }],
    userPwd:[{ required: true, message: '请输入密码', trigger: 'blur' },
              { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }]
  }
  //props
  @Prop()
    openLoginDialog:boolean
  //computed
  get signIn(){
    return this.activeName==='login'? 'LOG IN': 'SIGN UP'
  }
  @Action login:any
  @Action register:any
  //methods
  handleClose(){
    (this.$refs['form'] as ElForm).resetFields()
    this.$emit('closeDialog')
  }
  sendType(){
    let _this = this
    async function a(){
      if(_this.activeName==='login'){
        await _this.login(_this.form)
      }else{
        await _this.register(_this.form)
      }
      _this.handleClose()
    }
    a.bind(this)()
  }
  sendRequest(){
    (this.$refs['form'] as ElForm).validate((valid:any)=>{
      if(valid){
        this.sendType()
      }
    })

  }
}
</script>


