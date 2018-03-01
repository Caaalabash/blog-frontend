<template>
  <div class="manage-right">
    <el-form ref="form" :rules="rules" :model="idea" class="form-container">
      <el-form-item prop="blogTitle" class="title">
        <el-input style="width: 50%" v-model="idea.blogTitle" placeholder="文章标题"></el-input>
      </el-form-item>
      <el-form-item class="type">
        <el-radio v-model="idea.blogType" label="public">公开</el-radio>
        <el-radio v-model="idea.blogType" label="private">私密</el-radio>
      </el-form-item>
      <el-form-item class="text">
        <div id="editor" class="post">
          <textarea :value="idea.blogContent" @input="update" class="text-textarea"></textarea>
          <div v-html="compiledMarkdown" class="text-content"></div>
        </div>
      </el-form-item>
      <el-form-item class="submit">
        <el-button plain style="margin-top: 20px" @click="sendIdea">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
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
    _send(){
      async function a(){
        if(this.blogDate){
          await this.updateIdea(Object.assign(this.idea,{blogDate:this.blogDate},{userName:this.users.userName}))
        }else{
          await this.createNewIdea(Object.assign({userName:this.users.userName},this.idea))
        }
        this.clearForm()
      }
      a.bind(this)()
    },
    clearForm(){
      this.idea.blogTitle=''
      this.idea.blogContent=''
      this.idea.blogType='public'
    },
    sendIdea(){
      this.$refs['form'].validate((valid)=>{
        if(valid){
          if(this.idea.blogContent===''){
            this.$message.error('文章内容不能为空')
          }else{
            this.idea.blogDate = formatDate()
            this._send()
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
  .form-container{
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  #editor{
    display: flex;
    flex-direction: row;
    min-height: 50vh;
  }
  .text-textarea{
    min-height: 50vh;
    flex:0 1 400px;
  }
  .text-content{
    flex:0 1 400px;
    min-height: 50vh;
    background-color: rgba(0,0,0,.1);
  }
  @media screen and (max-width: 600px) {
    #editor{
      flex-direction: column;
    }
    .text-textarea,.text-content{
      flex:0 1 100%;
      margin: 5px;
    }
  }
</style>
