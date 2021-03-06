<template>
  <div class="manage-right">
    <!--表单-->
    <el-form ref="form" :rules="rules" :model="idea" class="form-container fl-column">
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
    <el-dialog :visible="dialogVisible" @close="closeDialog">
      <el-upload
        class="upload-demo"
        drag
        :show-file-list="false"
        :file-list="fileList"
        action="/files"
        :httpRequest="upload"
        :before-upload="beforeAvatarUpload"
        multiple>
        <i class="el-icon-upload"/>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传图片文件，且不超过4MB</div>
      </el-upload>
      <el-input placeholder="文件路径" v-model="imgPath" id="target">
        <el-button slot="append" data-clipboard-target="#target" class="copy-btn">复制</el-button>
      </el-input>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import ClipboardJS from 'clipboard'
import { formatDate } from '@/lib/lib'
import debounce from 'lodash/debounce'

export default{
  props: ['user'],
  data: () => ({
    rules: {
      blogTitle: [
        { required: true, message: '请输入文章标题', trigger: 'blur' },
        { min: 4, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
      ]
    },
    idea: {
      blogTitle: '',
      blogDate: '',
      blogContent: '',
      blogType: 'public'
    },
    dialogVisible: false,
    imgPath: '',
    fileList: []
  }),
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  created() {
    if (this.id) {
      this.$api.getIdea(this.id).then(res => {
        this.idea = res.data
      })
    } else if (localStorage.getItem('manuscript')) {
      this.idea = JSON.parse(localStorage.getItem('manuscript'))
      this.$notify({
        title: '提示',
        message: '已采用缓存中的内容',
        duration: 2000,
      })
    }
  },
  mounted() {
    const clipboardInstance = new ClipboardJS('.copy-btn')
    clipboardInstance.on('success', e => {
      this.$message.success('已复制到粘贴板')
      e.clearSelection()
    })
  },
  methods: {
    clearForm() {
      this.idea.blogTitle = ''
      this.idea.blogContent = ''
      this.idea.blogType = 'public'
    },
    // 文件上传
    async upload() {
      const formData = new FormData()
      formData.append('uploadfile', this.file)
      const { data } = await this.$api.upload(formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      this.imgPath = data
    },
    beforeAvatarUpload(file) {
      const isImage = file.type.includes('image')
      const isLt4M = file.size / 1024 / 1024 < 4
      if (!isImage) {
        this.$message.error('只能上传图片')
        return false
      }
      if (!isLt4M) {
        this.$message.error('上传图片大小不能超过 4MB!')
        return false
      }
      this.file = file
      return true
    },
    closeDialog() {
      this.dialogVisible = false
      this.fileList = []
      this.imgPath = ''
    },
    openDialog() {
      this.dialogVisible = true
    },
    update: debounce(function(e) {
      const key = this.id ? `article${this.id}` : 'manuscript'
      localStorage.setItem(key, JSON.stringify(this.idea))
      this.idea.blogContent = e.target.value
    }, 300),
    sendIdea () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.idea.blogContent === '') {
            this.$message.error('文章内容不能为空')
          } else {
            this._send()
          }
        }
      })
    },
    async _send () {
      const cacheKey = this.blogDate ? `article${this.blogDate}` : 'manuscript'
      if (this.id) {
        await this.$api.changeIdea(this.idea)
      } else {
        this.idea.blogDate = formatDate()
        await this.$api.createNewIdea({ author: this.user.userName, ...this.idea })
      }
      this.clearForm()
      localStorage.removeItem(cacheKey)
    },
  },
}
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
