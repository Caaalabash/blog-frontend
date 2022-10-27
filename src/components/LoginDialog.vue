<template>
  <el-dialog :model-value="visible" @close="handleClose(false)">
    <el-form ref="formRef" :model="form" :rules="rules">
      <el-form-item prop="userName">
        <el-input v-model="form.userName" placeholder="用户名">
        </el-input>
      </el-form-item>
      <el-form-item prop="userPwd">
        <el-input type="password" v-model="form.userPwd" placeholder="密码" @keyup.enter.native="sendRequest"/>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="sendRequest" plain>LOG IN</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { service } from '@/service'
import { useUserStore } from '@/stores/user'

const emit = defineEmits(['close'])
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  }
})
const userStore = useUserStore()
const form = reactive({
  userName: '',
  userPwd: ''
})
const formRef = ref()
const rules = {
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }
  ],
  userPwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }
  ]
}

const sendRequest = async () => {
  await formRef.value.validate()
  const { data } = await service.login({ method: 'POST', data: form })
  userStore.setUser(data)
  handleClose(true)
}
const handleClose = (loginSuccess) => {
  emit('close', loginSuccess)
}
</script>
<style scoped>
  @media (max-width: 768px) {
    /deep/ .el-dialog {
      width: 70%;
    }
  }
</style>


