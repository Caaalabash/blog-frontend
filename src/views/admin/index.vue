<template>
  <div class="manage-right">
    <!--表单-->
    <el-form ref="formRef" :rules="rules" :model="idea" class="form-container fl-column">
      <el-form-item prop="blogTitle" class="title">
        <el-input style="width: 50%" v-model="idea.blogTitle" placeholder="文章标题"/>
      </el-form-item>
      <el-form-item class="type">
        <el-radio v-model="idea.blogType" label="public">公开</el-radio>
        <el-radio v-model="idea.blogType" label="private">私密</el-radio>
        <el-radio v-model="idea.blogType" label="sticky">置顶</el-radio>
      </el-form-item>
      <!--编辑/查看区域-->
      <el-form-item class="text">
        <div id="editor" class="post">
          <textarea :value="idea.blogContent" @input="update" class="text-textarea"/>
          <div v-marked="idea.blogContent" class="text-content markdown-body"></div>
        </div>
      </el-form-item>
      <!--按钮区域-->
      <el-form-item class="submit">
        <el-button plain style="margin-top: 20px" @click="sendIdea">发布</el-button>
        <el-button type="primary" style="margin-top: 20px" @click="openDialog">上传</el-button>
      </el-form-item>
    </el-form>
    <!--上传图片弹窗-->
    <el-dialog :model-value="dialogVisible" @close="closeDialog">
      <el-upload
        class="upload-demo"
        drag
        :show-file-list="false"
        :file-list="fileList"
        action="/files"
        :httpRequest="upload"
        :before-upload="beforeAvatarUpload"
        multiple
      >
        <i class="el-icon-upload"/>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传图片文件，且不超过10MB</div>
      </el-upload>
      <el-input placeholder="文件路径" v-model="imgPath" id="target">
        <template #append>
          <el-button data-clipboard-target="#target" class="copy-btn">复制</el-button>
        </template>
      </el-input>
    </el-dialog>
  </div>
</template>

<script setup>
import ClipboardJS from 'clipboard'
import { formatDate } from '@/utils'
import debounce from 'lodash/debounce'
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { service } from '@/service'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElNotification } from 'element-plus'

const rules = {
  blogTitle: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 4, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
  ]
}
let file = null
const userStore = useUserStore()
const route = useRoute()
const idea = reactive({
  blogTitle: '',
  blogDate: '',
  blogContent: '',
  blogType: 'public'
})
const formRef = ref()
const dialogVisible = ref(false)
const imgPath = ref('')
const fileList = ref([])
const id = computed(() => route.query.id)
const localStorageKey = computed(() => id.value ? `article${id.value}` : 'manuscript')

const initContent = () => {
  if (id.value) {
    service.getBlogDetail({ params: { id: id.value } }).then(res => {
      Object.assign(idea, res.data)
    })
  } else if (localStorage.getItem('manuscript')) {
    Object.assign(idea, JSON.parse(localStorage.getItem('manuscript')))
    ElNotification({
      title: '提示',
      message: '已采用缓存中的内容',
      duration: 2000,
    })
  }
}
const initCopy = () => {
  const clipboardInstance = new ClipboardJS('.copy-btn')
  clipboardInstance.on('success', e => {
    ElMessage.success('已复制到粘贴板')
    e.clearSelection()
  })
}
const clearForm = () => {
  idea.blogTitle  = ''
  idea.blogContent = ''
  idea.blogType = 'public'
}
const upload = async () => {
  const formData = new FormData()
  formData.append('uploadfile', file)
  const { data } = await service.upload({
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
  imgPath.value = data
}
const beforeAvatarUpload = (f) => {
  const isImage = f.type.includes('image')
  const isLt10M = f.size / 1024 / 1024 < 10
  if (!isImage) {
    ElMessage.error('只能上传图片')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('上传图片大小不能超过 10MB!')
    return false
  }
  file = f
  return true
}
const closeDialog = () => {
  dialogVisible.value = false
  fileList.value = []
  imgPath.value = ''
}
const openDialog = () => {
  dialogVisible.value = true
}
const update = debounce((e) => idea.blogContent = e.target.value, 300)
const sendIdea = async () => {
  await formRef.value.validate()
  if (idea.blogContent === '') {
    ElMessage.error('文章内容不能为空')
    return
  }
  if (id.value) {
    const { id, ...rest } = idea
    await service.changeIdea({ method: 'PUT', data: rest, params: { id } })
  } else {
    idea.blogDate = formatDate()
    await service.createNewIdea({
      method: 'POST',
      data: {
        author: userStore.userName,
        ...idea
      },
    })
  }
  clearForm()
  localStorage.removeItem(localStorageKey.value)
}
watch(idea, () => localStorage.setItem(localStorageKey.value, JSON.stringify(idea)))
onMounted(initCopy)
initContent()
</script>

<style scoped lang="less">
  /*针对el-upload的响应式css*/
  .upload-demo{
    /deep/ .el-upload-dragger{
      width: 100%;
    }
    /deep/ .el-upload{
      width: 70%;
    }
  }
  .form-container{
    width: 100%;
    .text #editor{
      display: flex;
      flex-direction: row;
      min-height: 50vh;

      textarea {
        border: 1px solid #c9c9c9;
        resize: none;
        outline: none;
      }
      @media (max-width: 600px){
        flex-direction: column;
      }
    }
    .text-textarea,
    .text-content{
      flex:0 0 450px;
      min-height: 50vh;
    }
    .text-content{
      padding: 15px;
      background-color: rgb(247,247,247);
    }
    @media (max-width: 600px) {
      .text-textarea,
      .text-content{
        flex:0 0 100%;
        margin: 5px;
      }
    }
  }
</style>
