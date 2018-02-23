<template>
  <el-form ref="form" :rules="rules" :model="idea" style="width: 40vmax">
    <el-form-item prop="blogTitle">
      <el-input style="width: 50%" v-model="idea.blogTitle" placeholder="文章标题"></el-input>
    </el-form-item>
    <el-form-item >
      <el-radio v-model="idea.blogType" label="public">公开</el-radio>
      <el-radio v-model="idea.blogType" label="private">私密</el-radio>
    </el-form-item>
    <el-form-item >
      <div id="editor" class="post">
        <textarea :value="idea.blogContent" @input="update" class="youridea"></textarea>
        <div v-html="compiledMarkdown" class="content"></div>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button plain style="margin-top: 20px" @click="sendIdea">发布</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import {mapActions,mapGetters} from 'vuex'
import {formatDate} from '../../lib/lib'

export default{
  props:['blogDate','users'],
  data(){
    return{
      rules:{
        blogTitle:[{ required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }]
      },
      idea:{
        blogId:'',
        blogTitle:'',
        blogDate:'',
        blogContent:'',
        blogType:'public'
      }
    }
  },
  computed: {
    compiledMarkdown: function () {
      return marked(this.idea.blogContent, { sanitize: true })
    },
    ...mapGetters({
      blogList:'blogList'
    })
  },
  methods: {
    ...mapActions([
      'createNewIdea',
      'updateIdea',
    ]),
    update:_.debounce(function (e) {
      this.idea.blogContent = e.target.value
    }, 300),

    sendIdea(){
      this.$refs['form'].validate((valid)=>{
        if(valid){
          if(this.idea.blogContent===''){
            this.$message.error('文章内容不能为空')
          }else{
            this.idea.blogDate = formatDate()
            this.blogDate ?
              this.updateIdea(Object.assign(this.idea,{blogDate:this.blogDate},{userName:this.users.userName})):
              this.createNewIdea(Object.assign({userName:this.users.userName},this.idea))
            //发布成功
            //在没有async await之前
            setTimeout(()=>{
              this.idea.blogTitle=''
              this.idea.blogContent=''
              this.idea.blogType='public'
            },1000)
          }
        }
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    if(to.query.blogDate){
      next(vm => {
        vm.idea = vm.blogList.filter(item=>item.blogDate===to.query.blogDate)[0]
      })
    }else{
      next()
    }
  }
}
</script>

<style scoped>
  html, body, #editor {
    margin: 0;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: #333;
  }

  textarea, #editor div {
    display: inline-block;
    height: 100%;
    vertical-align: top;
    box-sizing: border-box;
    padding: 0 20px;
  }

  textarea {
    border: 1px solid #ccc;
    resize: none;
    outline: none;
    background-color: #f6f6f6;
    font-size: 14px;
    font-family: 'Monaco', courier, monospace;
    padding: 20px;
  }

  code {
    color: #f66;
  }
  .youridea{
    width:35vmax;
    min-height: 60vh;
  }
  .content{
    margin-top: 10vh;
    background-color: rgba(0,0,0,.1);
    width:35vmax;
  }
</style>
