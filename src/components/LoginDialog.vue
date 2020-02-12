<template>
  <el-dialog :visible.sync="visible" :before-close="handleClose">

    <el-tabs v-model="tab">
      <el-tab-pane label="Login" name="login"></el-tab-pane>
    </el-tabs>

    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item prop="userName">
        <el-input v-model="form.userName" placeholder="用户名">
        </el-input>
      </el-form-item>
      <el-form-item prop="userPwd">
        <el-input type="password" v-model="form.userPwd" placeholder="密码" @keyup.enter.native="sendRequest"></el-input>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="sendRequest" plain>LOG IN</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { mapActions } from 'vuex'

export default {
  name: 'LoginDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    tab: 'login',
    form: {
      userName: '',
      userPwd: ''
    },
    rules: {
      userName: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }
      ],
      userPwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }
      ]
    }
  }),
  methods: {
    ...mapActions([
      'login',
    ]),
    handleClose () {
      this.$refs['form'].resetFields()
      this.$emit('close')
    },
    async sendType () {
      await this.login(this.form)
      this.handleClose()
    },
    sendRequest () {
      this.$refs['form'].validate(valid => {
        if (valid) this.sendType()
      })
    }
  }
}
</script>

<style scoped>
  @media (max-width: 768px) {
    /deep/ .el-dialog {
      width: 70%;
    }
  }
</style>


