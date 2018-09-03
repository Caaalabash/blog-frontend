<template>
  <div class="manage-right">
    <!--表单-->
    <el-form ref="form" :rules="rules" :model="idea" class="form-container fl-column">
      <el-form-item prop="blogTitle" class="title">
        <el-input style="width: 50%" v-model="idea.blogTitle" placeholder="文章标题"></el-input>
      </el-form-item>
      <el-form-item class="type">
        <el-radio v-model="idea.blogType" label="public">公开</el-radio>
        <el-radio v-model="idea.blogType" label="private">私密</el-radio>
      </el-form-item>
      <!--编辑/查看区域-->
      <el-form-item class="text">
        <div id="editor" class="post">
          <textarea :value="idea.blogContent" @input="update" class="text-textarea"></textarea>
          <div v-html="compiledMarkdown" class="text-content markdown-body"></div>
        </div>
      </el-form-item>
      <!--按钮区域-->
      <el-form-item class="submit">
        <el-button plain style="margin-top: 20px" @click="sendIdea">发布</el-button>
        <el-button type="primary" style="margin-top: 20px" @click="openDialog">上传</el-button>
      </el-form-item>
    </el-form>
    <!--上传图片弹窗-->
    <el-dialog :visible="dialogVisble"
               @close="closeDialog">
      <el-upload
        class="upload-demo"
        drag
        :show-file-list="false"
        :file-list="fileList"
        action="/files"
        :httpRequest="upload"
        :before-upload="beforeAvatarUpload"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传图片文件，且不超过4MB</div>
      </el-upload>
      <el-input placeholder="文件路径" v-model="imgpath" id="target">
        <el-button slot="append" @click="copy" data-clipboard-target="#target" class="btn">复制</el-button>
      </el-input>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import ClipboardJS from 'clipboard'
import {mapActions, mapGetters} from 'vuex'
import {formatDate} from '../lib/lib'
import api from '../service/apiManage'
import debounce from 'lodash/debounce'

export default{
  props: ['blogDate', 'users'],
  data () {
    return {
      rules: {
        blogTitle: [{ required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 4, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }]
      },
      idea: {
        blogTitle: '',
        blogDate: '',
        blogContent: '',
        blogType: 'public'
      },
      dialogVisble: false,
      imgpath: '',
      fileList: []
    }
  },
  computed: {
    compiledMarkdown: function () {
      return marked(this.idea.blogContent, { sanitize: true })
    },
    ...mapGetters([
      'token',
      'blogList'
    ])
  },
  methods: {
    ...mapActions([
      'createNewIdea',
      'updateIdea'
    ]),
    // 赋值功能
    copy () {
      let that = this
      const clipboard = new ClipboardJS('.btn')
      clipboard.on('success', function (e) {
        that.$message.success('已复制到粘贴板')
        e.clearSelection()
      })
    },
    // 文件上传
    upload () {
      let formData = new FormData()
      formData.append('file', this.file)
      api.upload(formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': this.token,
          'userName': this.users.userName
        }
      }).then(res => {
        if (res.res) {
          this.imgpath = res.res
        }
      })
    },
    beforeAvatarUpload (file) {
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
    closeDialog () {
      this.dialogVisble = false
      this.fileList = []
      this.imgpath = ''
    },
    openDialog () {
      this.dialogVisble = true
    },
    update: debounce(function (e) {
      let key = this.blogDate ? `article${this.blogDate}` : 'manuscript'
      localStorage.setItem(key, JSON.stringify(this.idea))
      this.idea.blogContent = e.target.value
    }, 300),
    _send () {
      async function a () {
        if (this.blogDate) {
          await this.updateIdea(Object.assign(this.idea, {blogDate: this.blogDate}, {userName: this.users.userName}))
        } else {
          await this.createNewIdea(Object.assign({userName: this.users.userName}, this.idea))
        }
        this.clearForm()
      }
      a.bind(this)()
    },
    clearForm () {
      this.idea.blogTitle = ''
      this.idea.blogContent = ''
      this.idea.blogType = 'public'
    },
    sendIdea () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.idea.blogContent === '') {
            this.$message.error('文章内容不能为空')
          } else {
            this.idea.blogDate = formatDate()
            this._send()
          }
        }
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    let key = to.query.blogDate ? `article${to.query.blogDate}` : 'manuscript'
    // 如果是修改文章
    if (to.query.blogDate) {
      next(vm => {
        vm.idea = vm.blogList.filter(item => item.blogDate === to.query.blogDate)[0]
      })
    }
    // 如果浏览器缓存中存在该文章的缓存,则读取它
    if (localStorage.getItem(key)) {
      next(vm => {
        vm.idea = JSON.parse(localStorage.getItem(key))
        vm.$notify({
          title: '提示',
          message: '已采用缓存中的内容',
          duration: 2000
        })
      })
    } else {
      next()
    }
  }
}
</script>

<style scoped lang="less">
  @import '../assets/style/index.less';
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
      .fl-row;
      min-height: 50vh;

      textarea {
        border: 1px solid @borderColor;
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
      background-color: @grayColor;
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
