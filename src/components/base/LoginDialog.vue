<template>
  <el-dialog  :visible.sync="isVisible"
              width="30%"
              :before-close="handleClose">

    <el-tabs v-model="activeName">
      <el-tab-pane label="Login" name="login"></el-tab-pane>
      <el-tab-pane label="Register" name="Register"></el-tab-pane>
    </el-tabs>

    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item prop="userName">
        <el-input v-model="form.userName">
          <template slot="prepend">name</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="userPwd">
        <el-input type="password" v-model="form.userPwd">
          <template slot="prepend">userPwd</template>
        </el-input>
      </el-form-item>
      <el-form-item >
        <el-button v-html="signIn" type="primary" @click="sendRequest" plain></el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script type="text/ecmascript-6">
import service from '../../service/apiManage'
import {setStorage,getStorage} from '../../lib/lib'
export default{
  name:'LoginDialog',
  props:{
    isVisible:{
      type:Boolean,
      default:false
    }
  },
  computed:{
    signIn(){
      return this.activeName==='login'? 'LOG IN': 'SIGN UP'
    }
  },
  data(){
    return{
      activeName:'login',
      form:{
        userName:'',
        userPwd:''
      },
      rules:{
        userName:[{ required: true, message: '请输入用户名', trigger: 'blur' },
                  { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }],
        userPwd:[{ required: true, message: '请输入密码', trigger: 'blur' },
                  { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }]
      }
    }

  },
  methods:{
    handleClose(){
      this.$refs['form'].resetFields()
      this.$emit('closeDialog')
    },
    sendRequest(){
      this.$refs['form'].validate((valid)=>{
        if(valid){
          if(this.activeName==='login'){
            service.checkUser(this.form).then((res)=>{
              if(res.data.errno===0){
                this.$message.success(res.data.msg)
                setStorage('currentUser',this.form.userName)
                this.handleClose()
                this.$router.push(`/${getStorage('currentUser')}/manage`)

              }else if(res.data.errno===1){
                this.$message.error(res.data.msg)
              }
            })
          }else{
            service.createUser(this.form).then((res)=>{
              if(res.data.errno===0){
                this.$message.success(res.data.msg)
                setStorage('currentUser',this.form.userName)
                this.handleClose()
              }else if(res.data.errno===1){
                this.$message.error(res.data.msg)
              }
            })
          }
        }
      })

    }
  }
}
</script>

