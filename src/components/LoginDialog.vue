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
        <el-input type="password" v-model="form.userPwd" placeholder="密码" @keyup.enter="sendRequest"></el-input>
      </el-form-item>
      <el-form-item >
        <el-button v-html="signIn" type="primary" @click="sendRequest" plain></el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script type="text/ecmascript-6">
import {mapActions} from 'vuex'

export default{
  name: 'LoginDialog',
  props: {
    openLoginDialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      activeName: 'login',
      form: {
        userName: '',
        userPwd: ''
      },
      rules: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }],
        userPwd: [{ required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }]
      }
    }
  },
  computed: {
    signIn () {
      return this.activeName === 'login' ? 'LOG IN' : 'SIGN UP'
    }
  },
  methods: {
    ...mapActions([
      'login',
      'register'
    ]),
    handleClose () {
      this.$refs['form'].resetFields()
      this.$emit('closeDialog')
    },
    async sendType () {
      if (this.activeName === 'login') {
        await this.login(this.form)
      } else {
        await this.register(this.form)
      }
      this.handleClose()
    },
    sendRequest () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.sendType()
        }
      })
    }
  }
}
</script>


