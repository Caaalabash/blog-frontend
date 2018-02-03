<template>
  <div>
    <el-form ref="form" :rules="rules" :model="idea">
      <el-form-item prop="blogTitle">
        <el-input style="width: 50%" v-model="idea.blogTitle">
          <template slot="prepend" >文章标题</template>
        </el-input>
      </el-form-item>
      <el-form-item >
        <el-radio v-model="idea.blogType" label="public">公开</el-radio>
        <el-radio v-model="idea.blogType" label="private">私密</el-radio>
      </el-form-item>
      <el-form-item >
        <div id="editor">
          <textarea :value="idea.blogContent" @input="update"></textarea>
          <div v-html="compiledMarkdown"></div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button plain style="margin-top: 20px" @click="sendIdea">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import service from '../../service/apiManage'
import {formatDate} from '../../lib/lib'
export default{
  props:['blogDate','userName'],
  data(){
    return{
      idea:{
        blogTitle:'',
        blogContent: '# hello',
        blogDate:'',
        blogType:'public'
      },
      rules:{
        blogTitle:[{ required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }]
      }
    }
  },
  computed: {
    compiledMarkdown: function () {
      console.log(marked(this.idea.blogContent, { sanitize: true }))
      return marked(this.idea.blogContent, { sanitize: true })
    }
  },
  methods: {
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
            let handler
            this.blogDate?handler = this.changeIdea():handler=this.createNewIdea()
            handler.then((res)=>{
              if(res.data.errno===0){
                this.$message.success(res.data.msg)
                this.idea.blogContent=''
                this.idea.blogTitle=''
                this.idea.blogDate=''
                this.idea.blodType = 'public'
              }else if(res.data.errno===1){
                this.$message.error(res.data.msg)
              }
            })
          }
        }
      })
    },
    changeIdea(){
      return service.changeIdea(Object.assign(this.idea,{blogDate:this.blogDate},{userName:this.userName}))
    },
    createNewIdea(){
      return service.createNewIdea(Object.assign({userName:this.userName},this.idea))
    },
    getIdea(id){
      service.getIdea({'blogDate':id,'userName':this.userName}).then((res)=>{
        if(res.data.errno===0){
          this.idea = res.data.res
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
  },
  beforeRouteEnter (to, from, next) {
    if(to.query.blogDate){
      next(vm => {
        vm.getIdea(vm.blogDate)
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
    height: 800px;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: #333;
  }

  textarea, #editor div {
    display: inline-block;
    width: 49%;
    height: 100%;
    vertical-align: top;
    box-sizing: border-box;
    padding: 0 20px;
  }

  textarea {
    border: none;
    border-right: 1px solid #ccc;
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
</style>
